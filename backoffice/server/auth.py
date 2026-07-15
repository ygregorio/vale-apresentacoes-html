"""Autenticação, sessões, usuários e log de auditoria."""

from __future__ import annotations

import hashlib
import hmac
import json
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

SESSION_COOKIE = "vale_session"
SESSION_TTL_HOURS = 8
PBKDF2_ITERATIONS = 260_000
ROLES = frozenset({"admin", "user"})


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class AuthStore:
    def __init__(self, root: Path) -> None:
        self.auth_dir = root / "data" / "auth"
        self.users_file = self.auth_dir / "users.json"
        self.sessions_file = self.auth_dir / "sessions.json"
        self.audit_file = self.auth_dir / "audit-log.jsonl"
        self.bootstrap_file = self.auth_dir / ".bootstrap-admin.txt"
        self.auth_dir.mkdir(parents=True, exist_ok=True)
        self._lock = None  # threading lock set by server if needed

    @staticmethod
    def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
        if salt is None:
            salt = secrets.token_hex(16)
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            PBKDF2_ITERATIONS,
        )
        return salt, digest.hex()

    @staticmethod
    def verify_password(password: str, salt: str, password_hash: str) -> bool:
        _, computed = AuthStore.hash_password(password, salt)
        return hmac.compare_digest(computed, password_hash)

    def _read_json(self, path: Path, default):
        if not path.exists():
            return default
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default

    def _write_json(self, path: Path, data) -> None:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def load_users(self) -> dict:
        return self._read_json(self.users_file, {"users": []})

    def save_users(self, data: dict) -> None:
        self._write_json(self.users_file, data)

    def load_sessions(self) -> dict:
        return self._read_json(self.sessions_file, {"sessions": {}})

    def save_sessions(self, data: dict) -> None:
        self._write_json(self.sessions_file, data)

    def bootstrap_hint(self) -> str | None:
        if not self.bootstrap_file.exists():
            return None
        return (
            "Senha inicial do admin salva em data/auth/.bootstrap-admin.txt "
            "no computador onde o servidor Python está rodando."
        )

    def reset_admin_password(self, new_password: str | None = None) -> tuple[str, str]:
        password = (new_password or "").strip() or secrets.token_urlsafe(10)
        if len(password) < 6:
            raise ValueError("Senha deve ter ao menos 6 caracteres")

        data = self.load_users()
        users = data.get("users", [])
        admin = next((u for u in users if u.get("username") == "admin"), None)
        if not admin:
            raise ValueError("Usuário admin não encontrado")

        salt, password_hash = self.hash_password(password)
        admin["salt"] = salt
        admin["passwordHash"] = password_hash
        admin["updatedAt"] = utc_now()
        self.save_users(data)
        self.bootstrap_file.write_text(
            f"Usuário inicial: admin\nSenha inicial: {password}\nAltere após o login.\n",
            encoding="utf-8",
        )
        return admin["username"], password

    def bootstrap_if_needed(self, env_password: str | None = None) -> str | None:
        data = self.load_users()
        if data.get("users"):
            return None

        password = (env_password or "").strip() or secrets.token_urlsafe(12)
        salt, password_hash = self.hash_password(password)
        now = utc_now()
        admin = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "nome": "Administrador",
            "role": "admin",
            "ativo": True,
            "salt": salt,
            "passwordHash": password_hash,
            "createdAt": now,
            "updatedAt": now,
        }
        self.save_users({"users": [admin]})
        self.bootstrap_file.write_text(
            f"Usuário inicial: admin\nSenha inicial: {password}\nAltere após o primeiro login.\n",
            encoding="utf-8",
        )
        return password

    def find_user_by_username(self, username: str) -> dict | None:
        username = username.strip().lower()
        for user in self.load_users().get("users", []):
            if user.get("username", "").lower() == username and user.get("ativo", True):
                return user
        return None

    def find_user_by_id(self, user_id: str) -> dict | None:
        for user in self.load_users().get("users", []):
            if user.get("id") == user_id:
                return user
        return None

    def public_user(self, user: dict) -> dict:
        return {
            "id": user["id"],
            "username": user["username"],
            "nome": user.get("nome") or user["username"],
            "role": user.get("role", "user"),
            "ativo": user.get("ativo", True),
            "createdAt": user.get("createdAt"),
            "updatedAt": user.get("updatedAt"),
        }

    def list_users_public(self) -> list[dict]:
        return [self.public_user(u) for u in self.load_users().get("users", [])]

    def create_user(self, body: dict) -> dict:
        username = str(body.get("username", "")).strip().lower()
        password = str(body.get("password", ""))
        nome = str(body.get("nome", "")).strip() or username
        role = str(body.get("role", "user")).strip().lower()

        if not username or len(username) < 3:
            raise ValueError("Usuário deve ter ao menos 3 caracteres")
        if not password or len(password) < 6:
            raise ValueError("Senha deve ter ao menos 6 caracteres")
        if role not in ROLES:
            raise ValueError("Perfil inválido (admin ou user)")

        data = self.load_users()
        if any(u.get("username", "").lower() == username for u in data.get("users", [])):
            raise ValueError("Nome de usuário já existe")

        salt, password_hash = self.hash_password(password)
        now = utc_now()
        user = {
            "id": str(uuid.uuid4()),
            "username": username,
            "nome": nome,
            "role": role,
            "ativo": True,
            "salt": salt,
            "passwordHash": password_hash,
            "createdAt": now,
            "updatedAt": now,
        }
        data.setdefault("users", []).append(user)
        self.save_users(data)
        return self.public_user(user)

    def update_user(self, user_id: str, body: dict, actor: dict) -> dict:
        data = self.load_users()
        users = data.get("users", [])
        target = next((u for u in users if u.get("id") == user_id), None)
        if not target:
            raise ValueError("Usuário não encontrado")

        if target.get("username") == "admin" and body.get("role") == "user" and actor.get("id") == target.get("id"):
            raise ValueError("O administrador principal não pode rebaixar a si mesmo")

        admins = [u for u in users if u.get("role") == "admin" and u.get("ativo", True)]
        if target.get("role") == "admin" and body.get("role") == "user" and len(admins) <= 1:
            raise ValueError("Deve existir ao menos um administrador ativo")

        if "nome" in body:
            target["nome"] = str(body["nome"]).strip() or target["username"]
        if "role" in body:
            role = str(body["role"]).strip().lower()
            if role not in ROLES:
                raise ValueError("Perfil inválido")
            target["role"] = role
        if "ativo" in body:
            if target.get("username") == "admin" and actor.get("id") == target.get("id") and not body["ativo"]:
                raise ValueError("Você não pode desativar sua própria conta admin")
            target["ativo"] = bool(body["ativo"])
        if body.get("password"):
            password = str(body["password"])
            if len(password) < 6:
                raise ValueError("Senha deve ter ao menos 6 caracteres")
            salt, password_hash = self.hash_password(password)
            target["salt"] = salt
            target["passwordHash"] = password_hash

        target["updatedAt"] = utc_now()
        self.save_users(data)
        return self.public_user(target)

    def delete_user(self, user_id: str, actor: dict) -> None:
        if actor.get("id") == user_id:
            raise ValueError("Você não pode excluir sua própria conta")
        data = self.load_users()
        users = data.get("users", [])
        target = next((u for u in users if u.get("id") == user_id), None)
        if not target:
            raise ValueError("Usuário não encontrado")
        if target.get("role") == "admin":
            admins = [u for u in users if u.get("role") == "admin" and u.get("ativo", True)]
            if len(admins) <= 1:
                raise ValueError("Não é possível excluir o último administrador")
        data["users"] = [u for u in users if u.get("id") != user_id]
        self.save_sessions({"sessions": {k: v for k, v in self.load_sessions().get("sessions", {}).items() if v.get("userId") != user_id}})
        self.save_users(data)

    def authenticate(self, username: str, password: str) -> dict | None:
        user = self.find_user_by_username(username)
        if not user:
            return None
        if not self.verify_password(password, user["salt"], user["passwordHash"]):
            return None
        return user

    def create_session(self, user_id: str) -> tuple[str, datetime]:
        token = secrets.token_urlsafe(32)
        expires = datetime.now(timezone.utc) + timedelta(hours=SESSION_TTL_HOURS)
        data = self.load_sessions()
        sessions = data.setdefault("sessions", {})
        sessions[token] = {
            "userId": user_id,
            "expiresAt": expires.isoformat(),
            "createdAt": utc_now(),
        }
        self._purge_expired_sessions(sessions)
        self.save_sessions(data)
        return token, expires

    def _purge_expired_sessions(self, sessions: dict) -> None:
        now = datetime.now(timezone.utc)
        expired = []
        for token, sess in sessions.items():
            try:
                exp = datetime.fromisoformat(sess["expiresAt"])
                if exp.tzinfo is None:
                    exp = exp.replace(tzinfo=timezone.utc)
            except (KeyError, ValueError):
                expired.append(token)
                continue
            if exp <= now:
                expired.append(token)
        for token in expired:
            sessions.pop(token, None)

    def destroy_session(self, token: str | None) -> None:
        if not token:
            return
        data = self.load_sessions()
        sessions = data.setdefault("sessions", {})
        sessions.pop(token, None)
        self.save_sessions(data)

    def resolve_session(self, token: str | None) -> dict | None:
        if not token:
            return None
        data = self.load_sessions()
        sessions = data.get("sessions", {})
        sess = sessions.get(token)
        if not sess:
            return None
        try:
            exp = datetime.fromisoformat(sess["expiresAt"])
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)
        except (KeyError, ValueError):
            self.destroy_session(token)
            return None
        if exp <= datetime.now(timezone.utc):
            self.destroy_session(token)
            return None
        user = self.find_user_by_id(sess.get("userId", ""))
        if not user or not user.get("ativo", True):
            self.destroy_session(token)
            return None
        return user

    def log_action(
        self,
        *,
        action: str,
        user: dict | None = None,
        detail: dict | None = None,
        ip: str | None = None,
    ) -> None:
        entry = {
            "ts": utc_now(),
            "action": action,
            "username": (user or {}).get("username"),
            "userId": (user or {}).get("id"),
            "role": (user or {}).get("role"),
            "ip": ip,
            "detail": detail or {},
        }
        with self.audit_file.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(entry, ensure_ascii=False) + "\n")

    def list_audit(self, limit: int = 200) -> list[dict]:
        if not self.audit_file.exists():
            return []
        lines = self.audit_file.read_text(encoding="utf-8").splitlines()
        items = []
        for line in lines[-limit:]:
            line = line.strip()
            if not line:
                continue
            try:
                items.append(json.loads(line))
            except json.JSONDecodeError:
                continue
        items.reverse()
        return items
