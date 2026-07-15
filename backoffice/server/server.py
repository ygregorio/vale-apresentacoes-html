#!/usr/bin/env python3
"""Servidor estático + API JSON para o backoffice de indicadores."""

from __future__ import annotations

import json
import mimetypes
import re
import sys
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from publisher import publish, validate_referencia

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "referencias"
DATA_DIR.mkdir(parents=True, exist_ok=True)

SLUG_RE = re.compile(r"^[a-z0-9-]+$")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_json_body(handler: SimpleHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length") or 0)
    raw = handler.rfile.read(length) if length else b"{}"
    try:
        return json.loads(raw.decode("utf-8") or "{}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"JSON inválido: {exc}") from exc


def send_json(handler: SimpleHTTPRequestHandler, status: int, payload) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


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
                        "diretoria": (data.get("config") or {}).get("diretoria"),
                        "mesReferencia": (data.get("config") or {}).get("mesReferencia"),
                        "presentationSlug": (data.get("config") or {}).get("presentationSlug"),
                    },
                }
            )
        except json.JSONDecodeError:
            continue
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


class BackofficeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format: str, *args) -> None:
        sys.stderr.write("%s - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == "/api/referencias":
            send_json(self, 200, list_referencias())
            return

        match = re.fullmatch(r"/api/referencias/([^/]+)", path)
        if match:
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

        return super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        try:
            if path == "/api/referencias":
                body = read_json_body(self)
                data = new_referencia_template(body)
                fp = ref_path(data["id"])
                if fp.exists():
                    send_json(self, 409, {"error": "Referência já existe"})
                    return
                fp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                send_json(self, 201, data)
                return

            match = re.fullmatch(r"/api/referencias/([^/]+)/(validate|publish)", path)
            if match:
                ref_id, action = match.group(1), match.group(2)
                fp = ref_path(ref_id)
                if not fp.exists():
                    send_json(self, 404, {"error": "Referência não encontrada"})
                    return
                data = json.loads(fp.read_text(encoding="utf-8"))
                if action == "validate":
                    send_json(self, 200, {"ok": not validate_referencia(data), "errors": validate_referencia(data)})
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
                    send_json(self, 200, result)
                    return

            send_json(self, 404, {"error": "Rota não encontrada"})
        except ValueError as exc:
            send_json(self, 400, {"error": str(exc)})

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        match = re.fullmatch(r"/api/referencias/([^/]+)", path)
        if not match:
            send_json(self, 404, {"error": "Rota não encontrada"})
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
            send_json(self, 200, body)
        except ValueError as exc:
            send_json(self, 400, {"error": str(exc)})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        match = re.fullmatch(r"/api/referencias/([^/]+)", path)
        if not match:
            send_json(self, 404, {"error": "Rota não encontrada"})
            return
        ref_id = match.group(1)
        try:
            fp = ref_path(ref_id)
            if not fp.exists():
                send_json(self, 404, {"error": "Referência não encontrada"})
                return
            fp.unlink()
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
    server = ThreadingHTTPServer(("127.0.0.1", port), BackofficeHandler)
    print(f"Backoffice + estáticos em http://localhost:{port}")
    print(f"UI: http://localhost:{port}/backoffice/index.html")
    print(f"Raiz do projeto: {ROOT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando.")
        server.server_close()


if __name__ == "__main__":
    main()
