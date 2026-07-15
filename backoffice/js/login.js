import { authApi } from "./api.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");
const btn = document.getElementById("btn-login");

function showError(msg) {
  errorEl.textContent = msg || "";
  errorEl.hidden = !msg;
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
  try {
    await authApi.login(data.get("username"), data.get("password"));
    window.location.href = "/backoffice/index.html";
  } catch (err) {
    showError(err.message || "Falha no login");
  } finally {
    btn.disabled = false;
  }
});

redirectIfLoggedIn();
