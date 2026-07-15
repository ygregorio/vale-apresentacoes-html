const API_BASE = "";

const API_UNAVAILABLE_MSG =
  "API indisponível na porta 8765. Pare o servidor antigo (Ctrl+C no terminal) e inicie com: .\\scripts\\serve.ps1 — esse script sobe a API do backoffice junto com os arquivos estáticos.";

function parseResponseError(text, status) {
  const trimmed = String(text || "").trim();
  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("Error response")
  ) {
    return API_UNAVAILABLE_MSG;
  }
  try {
    const data = trimmed ? JSON.parse(trimmed) : null;
    return data?.error || data?.errors?.join?.("\n") || `Erro ${status}`;
  } catch {
    return trimmed || `Erro ${status}`;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(parseResponseError(text, res.status));
    err.status = res.status;
    throw err;
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(parseResponseError(text, res.status));
  }
}

export const authApi = {
  status: () => request("/api/auth/status"),
  login: (username, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request("/api/auth/logout", { method: "POST", body: "{}" }),
  me: () => request("/api/auth/me"),
};

export const usersApi = {
  list: () => request("/api/users"),
  create: (body) => request("/api/users", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/api/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    request(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const auditApi = {
  list: (limit = 200) => request(`/api/audit-log?limit=${limit}`),
};

export const publicApi = {
  listPresentations: () => request("/api/public/presentations"),
};

export const api = {
  listReferencias: () => request("/api/referencias"),
  getReferencia: (id) => request(`/api/referencias/${encodeURIComponent(id)}`),
  createReferencia: (body) =>
    request("/api/referencias", { method: "POST", body: JSON.stringify(body) }),
  saveReferencia: (id, body) =>
    request(`/api/referencias/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteReferencia: (id) =>
    request(`/api/referencias/${encodeURIComponent(id)}`, { method: "DELETE" }),
  validate: (id) =>
    request(`/api/referencias/${encodeURIComponent(id)}/validate`, { method: "POST", body: "{}" }),
  publish: (id) =>
    request(`/api/referencias/${encodeURIComponent(id)}/publish`, { method: "POST", body: "{}" }),
};

export async function requireAuth() {
  try {
    return await authApi.me();
  } catch (err) {
    if (err.status === 401) {
      window.location.href = "/backoffice/login.html";
      return null;
    }
    throw err;
  }
}
