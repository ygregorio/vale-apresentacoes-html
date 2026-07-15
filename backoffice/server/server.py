#!/usr/bin/env python3
"""Servidor estático + API JSON para o backoffice de indicadores."""

from __future__ import annotations

import json
import mimetypes
import os
import re
import sys
from datetime import datetime, timezone
from http import cookies
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from auth import SESSION_COOKIE, AuthStore
from publisher import publish, validate_referencia

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "referencias"
DATA_DIR.mkdir(parents=True, exist_ok=True)

SLUG_RE = re.compile(r"^[a-z0-9-]+$")
AUTH = AuthStore(ROOT)

BACKOFFICE_PUBLIC_PREFIXES = (
    "/backoffice/login.html",
    "/backoffice/css/",
    "/backoffice/js/login.js",
    "/backoffice/js/auth.js",
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_json_body(handler: SimpleHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length") or 0)
    raw = handler.rfile.read(length) if length else b"{}"
    try:
        return json.loads(raw.decode("utf-8") or "{}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"JSON inválido: {exc}") from exc


def send_json(handler: SimpleHTTPRequestHandler, status: int, payload, *, set_cookie: str | None = None, clear_cookie: bool = False) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", handler.headers.get("Origin") or "*")
    handler.send_header("Access-Control-Allow-Credentials", "true")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    if set_cookie:
        handler.send_header("Set-Cookie", set_cookie)
    if clear_cookie:
        handler.send_header("Set-Cookie", f"{SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0")
    handler.end_headers()
    handler.wfile.write(body)


def redirect(handler: SimpleHTTPRequestHandler, location: str, status: int = 302) -> None:
    handler.send_response(status)
    handler.send_header("Location", location)
    handler.end_headers()


def ref_path(ref_id: str) -> Path:
    if not SLUG_RE.fullmatch(ref_id):
        raise ValueError("ID inválido")
    return DATA_DIR / f"{ref_id}.json"


def list_referencias() -> list[dict]:
    items = []
    for path in sorted(DATA_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            items.append(
                {
                    "id": data.get("id") or path.stem,
                    "status": data.get("status", "draft"),
                    "updatedAt": data.get("updatedAt"),
                    "config": {
                        "tituloApresentacao": (data.get("config") or {}).get("tituloApresentacao"),
                        "diretoria": (data.get("config") or {}).get("diretoria"),
                        "mesReferencia": (data.get("config") or {}).get("mesReferencia"),
                        "presentationSlug": (data.get("config") or {}).get("presentationSlug"),
                    },
                }
            )
        except json.JSONDecodeError:
            continue
    return items


def list_public_presentations() -> list[dict]:
    seen = set()
    items = []

    for ref in list_referencias():
        slug = (ref.get("config") or {}).get("presentationSlug")
        if not slug or slug in seen:
            continue
        pres_index = ROOT / "presentations" / slug / "index.html"
        if not pres_index.exists():
            continue
        seen.add(slug)
        cfg = ref.get("config") or {}
        items.append(
            {
                "slug": slug,
                "titulo": cfg.get("tituloApresentacao") or slug,
                "diretoria": cfg.get("diretoria") or "",
                "mesReferencia": cfg.get("mesReferencia") or "",
                "status": ref.get("status", "draft"),
                "updatedAt": ref.get("updatedAt"),
                "url": f"/presentations/{slug}/index.html",
                "source": "referencia",
                "referenciaId": ref.get("id"),
            }
        )

    pres_root = ROOT / "presentations"
    if pres_root.is_dir():
        for path in sorted(pres_root.iterdir()):
            if not path.is_dir() or path.name in seen:
                continue
            index = path / "index.html"
            if not index.exists():
                continue
            seen.add(path.name)
            items.append(
                {
                    "slug": path.name,
                    "titulo": path.name.replace("-", " ").title(),
                    "diretoria": "",
                    "mesReferencia": "",
                    "status": "published",
                    "updatedAt": None,
                    "url": f"/presentations/{path.name}/index.html",
                    "source": "folder",
                    "referenciaId": None,
                }
            )

    items.sort(key=lambda x: (x.get("titulo") or x["slug"]).lower())
    return items


def new_referencia_template(body: dict | None = None) -> dict:
    body = body or {}
    ref_id = body.get("id") or f"referencia-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    if not SLUG_RE.fullmatch(ref_id):
        ref_id = re.sub(r"[^a-z0-9-]", "-", ref_id.lower()).strip("-") or "referencia-nova"
    meses = ["jan/26", "fev/26", "mar/26", "abr/26", "mai/26"]
    zeros = [0] * len(meses)
    return {
        "id": ref_id,
        "status": "draft",
        "updatedAt": utc_now(),
        "config": {
            "tituloApresentacao": body.get("tituloApresentacao") or "Indicadores de Transportes",
            "subtituloApresentacao": "",
            "diretoria": body.get("diretoria") or "",
            "areaResponsavel": body.get("areaResponsavel") or "",
            "areaHierarquia": body.get("areaHierarquia") or "",
            "mesReferencia": body.get("mesReferencia") or meses[-1],
            "mesesSerie": meses,
            "presentationSlug": body.get("presentationSlug") or ref_id,
            "theme": "verde-aqua",
        },
        "hierarquia": [],
        "indicators": [],
    }


def is_backoffice_protected(path: str) -> bool:
    if not path.startswith("/backoffice"):
        return False
    for prefix in BACKOFFICE_PUBLIC_PREFIXES:
        if path == prefix or path.startswith(prefix):
            return False
    return True


def session_cookie_value(handler: SimpleHTTPRequestHandler) -> str | None:
    raw = handler.headers.get("Cookie") or ""
    jar = cookies.SimpleCookie()
    jar.load(raw)
    morsel = jar.get(SESSION_COOKIE)
    return morsel.value if morsel else None


class BackofficeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format: str, *args) -> None:
        sys.stderr.write("%s - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))

    def _client_ip(self) -> str:
        return self.client_address[0] if self.client_address else ""

    def _current_user(self) -> dict | None:
        return AUTH.resolve_session(session_cookie_value(self))

    def _audit(self, action: str, user: dict | None = None, detail: dict | None = None) -> None:
        AUTH.log_action(action=action, user=user, detail=detail, ip=self._client_ip())

    def _require_user(self, *, admin_only: bool = False) -> dict | None:
        user = self._current_user()
        if not user:
            send_json(self, 401, {"error": "Autenticação necessária"})
            return None
        if admin_only and user.get("role") != "admin":
            send_json(self, 403, {"error": "Acesso restrito a administradores"})
            return None
        return user

    def _session_cookie_header(self, token: str, expires) -> str:
        max_age = int((expires - datetime.now(timezone.utc)).total_seconds())
        return f"{SESSION_COOKIE}={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={max_age}"

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self.headers.get("Origin") or "*")
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == "/api/public/presentations":
            send_json(self, 200, list_public_presentations())
            return

        if path == "/api/auth/me":
            user = self._current_user()
            if not user:
                send_json(self, 401, {"error": "Não autenticado"})
                return
            send_json(self, 200, AUTH.public_user(user))
            return

        if path == "/api/audit-log":
            user = self._require_user(admin_only=True)
            if not user:
                return
            limit = 200
            qs = parsed.query or ""
            for part in qs.split("&"):
                if part.startswith("limit="):
                    try:
                        limit = max(1, min(500, int(part.split("=", 1)[1])))
                    except ValueError:
                        pass
            send_json(self, 200, AUTH.list_audit(limit))
            return

        if path == "/api/users":
            user = self._require_user(admin_only=True)
            if not user:
                return
            send_json(self, 200, AUTH.list_users_public())
            return

        if path == "/api/referencias":
            user = self._require_user()
            if not user:
                return
            send_json(self, 200, list_referencias())
            return

        match = re.fullmatch(r"/api/referencias/([^/]+)", path)
        if match:
            user = self._require_user()
            if not user:
                return
            ref_id = match.group(1)
            try:
                fp = ref_path(ref_id)
                if not fp.exists():
                    send_json(self, 404, {"error": "Referência não encontrada"})
                    return
                data = json.loads(fp.read_text(encoding="utf-8"))
                send_json(self, 200, data)
            except ValueError as exc:
                send_json(self, 400, {"error": str(exc)})
            return

        if is_backoffice_protected(path):
            if not self._current_user():
                redirect(self, "/backoffice/login.html")
                return

        return super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        try:
            if path == "/api/auth/login":
                body = read_json_body(self)
                username = str(body.get("username", "")).strip()
                password = str(body.get("password", ""))
                user = AUTH.authenticate(username, password)
                if not user:
                    self._audit("auth.login_failed", detail={"username": username})
                    send_json(self, 401, {"error": "Usuário ou senha inválidos"})
                    return
                token, expires = AUTH.create_session(user["id"])
                self._audit("auth.login", user=user)
                send_json(
                    self,
                    200,
                    AUTH.public_user(user),
                    set_cookie=self._session_cookie_header(token, expires),
                )
                return

            if path == "/api/auth/logout":
                user = self._current_user()
                AUTH.destroy_session(session_cookie_value(self))
                if user:
                    self._audit("auth.logout", user=user)
                send_json(self, 200, {"ok": True}, clear_cookie=True)
                return

            if path == "/api/users":
                actor = self._require_user(admin_only=True)
                if not actor:
                    return
                body = read_json_body(self)
                created = AUTH.create_user(body)
                self._audit("user.create", user=actor, detail={"targetId": created["id"], "username": created["username"], "role": created["role"]})
                send_json(self, 201, created)
                return

            if path == "/api/referencias":
                user = self._require_user()
                if not user:
                    return
                body = read_json_body(self)
                data = new_referencia_template(body)
                fp = ref_path(data["id"])
                if fp.exists():
                    send_json(self, 409, {"error": "Referência já existe"})
                    return
                fp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                self._audit("referencia.create", user=user, detail={"refId": data["id"]})
                send_json(self, 201, data)
                return

            match = re.fullmatch(r"/api/referencias/([^/]+)/(validate|publish)", path)
            if match:
                user = self._require_user()
                if not user:
                    return
                ref_id, action = match.group(1), match.group(2)
                fp = ref_path(ref_id)
                if not fp.exists():
                    send_json(self, 404, {"error": "Referência não encontrada"})
                    return
                data = json.loads(fp.read_text(encoding="utf-8"))
                if action == "validate":
                    errors = validate_referencia(data)
                    send_json(self, 200, {"ok": not errors, "errors": errors})
                    return
                if action == "publish":
                    result = publish(data, ROOT)
                    if not result.get("ok"):
                        send_json(self, 400, result)
                        return
                    data["status"] = "published"
                    data["updatedAt"] = utc_now()
                    data["lastPublishedAt"] = utc_now()
                    fp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                    self._audit("referencia.publish", user=user, detail={"refId": ref_id, "slug": data.get("config", {}).get("presentationSlug")})
                    send_json(self, 200, result)
                    return

            send_json(self, 404, {"error": "Rota não encontrada"})
        except ValueError as exc:
            send_json(self, 400, {"error": str(exc)})

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        match_user = re.fullmatch(r"/api/users/([^/]+)", path)
        if match_user:
            actor = self._require_user(admin_only=True)
            if not actor:
                return
            try:
                body = read_json_body(self)
                updated = AUTH.update_user(match_user.group(1), body, actor)
                self._audit("user.update", user=actor, detail={"targetId": updated["id"], "username": updated["username"]})
                send_json(self, 200, updated)
            except ValueError as exc:
                send_json(self, 400, {"error": str(exc)})
            return

        match = re.fullmatch(r"/api/referencias/([^/]+)", path)
        if not match:
            send_json(self, 404, {"error": "Rota não encontrada"})
            return

        user = self._require_user()
        if not user:
            return

        ref_id = match.group(1)
        try:
            body = read_json_body(self)
            if body.get("id") and body["id"] != ref_id:
                send_json(self, 400, {"error": "ID do corpo difere da URL"})
                return
            body["id"] = ref_id
            body["updatedAt"] = utc_now()
            fp = ref_path(ref_id)
            fp.write_text(json.dumps(body, ensure_ascii=False, indent=2), encoding="utf-8")
            self._audit("referencia.save", user=user, detail={"refId": ref_id})
            send_json(self, 200, body)
        except ValueError as exc:
            send_json(self, 400, {"error": str(exc)})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        match_user = re.fullmatch(r"/api/users/([^/]+)", path)
        if match_user:
            actor = self._require_user(admin_only=True)
            if not actor:
                return
            try:
                target_id = match_user.group(1)
                AUTH.delete_user(target_id, actor)
                self._audit("user.delete", user=actor, detail={"targetId": target_id})
                send_json(self, 200, {"ok": True})
            except ValueError as exc:
                send_json(self, 400, {"error": str(exc)})
            return

        match = re.fullmatch(r"/api/referencias/([^/]+)", path)
        if not match:
            send_json(self, 404, {"error": "Rota não encontrada"})
            return

        user = self._require_user(admin_only=True)
        if not user:
            return

        ref_id = match.group(1)
        try:
            fp = ref_path(ref_id)
            if not fp.exists():
                send_json(self, 404, {"error": "Referência não encontrada"})
                return
            fp.unlink()
            self._audit("referencia.delete", user=user, detail={"refId": ref_id})
            send_json(self, 200, {"ok": True})
        except ValueError as exc:
            send_json(self, 400, {"error": str(exc)})

    def guess_type(self, path: str) -> str:
        ctype = mimetypes.guess_type(path)[0]
        if path.endswith(".js"):
            return "application/javascript; charset=utf-8"
        return ctype or "application/octet-stream"


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    bootstrap_pw = AUTH.bootstrap_if_needed(os.environ.get("VALE_ADMIN_PASSWORD"))
    server = ThreadingHTTPServer(("127.0.0.1", port), BackofficeHandler)
    print(f"Backoffice + estáticos em http://localhost:{port}")
    print(f"Portal: http://localhost:{port}/")
    print(f"Login: http://localhost:{port}/backoffice/login.html")
    print(f"Raiz do projeto: {ROOT}")
    if bootstrap_pw:
        print("\n*** PRIMEIRO ACESSO — credencial admin criada ***")
        print("Usuário: admin")
        print(f"Senha: {bootstrap_pw}")
        print(f"Também salvo em: {AUTH.bootstrap_file}")
        print("Altere a senha após o login.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando.")
        server.server_close()


if __name__ == "__main__":
    main()
