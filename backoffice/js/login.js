import { authApi } from "./api.js";
import { backofficePath, isGitHubPages, portalPath } from "./paths.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");
const infoEl = document.getElementById("login-info");
const btn = document.getElementById("btn-login");

function showError(msg) {
  errorEl.textContent = msg || "";
  errorEl.hidden = !msg;
}

function showInfo(msg) {
  if (!infoEl) return;
  infoEl.textContent = msg || "";
  infoEl.hidden = !msg;
}

function isGitHubPagesHost() {
  return isGitHubPages();
}

async function checkEnvironment() {
  if (isGitHubPagesHost()) {
    showInfo(
      "Você está no GitHub Pages. A navegação funciona aqui, mas login e salvamento exigem o servidor local " +
        "(.\\scripts\\serve.ps1 → http://localhost:8765/backoffice/login.html)."
    );
    btn.disabled = false;
    return true;
  }

  if (window.location.protocol === "file:") {
    showError(
      "Abra o backoffice pelo servidor local (http://localhost:8765), não abrindo o arquivo HTML direto do disco."
    );
    btn.disabled = true;
    return false;
  }

  try {
    const status = await authApi.status();
    if (status?.bootstrapHint) {
      showInfo(`${status.bootstrapHint} Usuário padrão: admin.`);
    }
    return true;
  } catch (err) {
    showError(
      err.message ||
        "API do backoffice indisponível. Execute .\\scripts\\serve.ps1 e use http://localhost:8765/backoffice/login.html"
    );
    btn.disabled = true;
    return false;
  }
}

async function redirectIfLoggedIn() {
  try {
    await authApi.me();
    window.location.href = backofficePath("index.html");
  } catch {
    /* permanece na tela de login */
  }
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  showError("");
  btn.disabled = true;
  const data = new FormData(form);
  const username = String(data.get("username") || "").trim();
  const password = String(data.get("password") || "").trim();
  try {
    await authApi.login(username, password);
    window.location.href = backofficePath("index.html");
  } catch (err) {
    showError(err.message || "Falha no login");
  } finally {
    btn.disabled = false;
  }
});

(async () => {
  const ok = await checkEnvironment();
  if (ok) await redirectIfLoggedIn();
})();
