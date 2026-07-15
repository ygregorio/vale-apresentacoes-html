import { authApi } from "./api.js";

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

function isGitHubPages() {
  return /github\.io$/i.test(window.location.hostname);
}

async function checkEnvironment() {
  if (isGitHubPages()) {
    showError(
      "O backoffice não funciona no GitHub Pages — ele exige o servidor Python local com API. " +
        "Inicie com .\\scripts\\serve.ps1 e acesse http://localhost:8765/backoffice/login.html"
    );
    btn.disabled = true;
    return false;
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
    window.location.href = "/backoffice/index.html";
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
    window.location.href = "/backoffice/index.html";
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
