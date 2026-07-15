import { authApi, publicApi } from "../../backoffice/js/api.js";
import { appUrl, backofficePath } from "../../backoffice/js/paths.js";

const grid = document.getElementById("presentations-grid");
const countEl = document.getElementById("pres-count");
const backofficeLink = document.getElementById("link-backoffice");

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

function renderCard(item) {
  const statusClass = item.status === "published" ? "portal-card__tag--published" : "portal-card__tag--draft";
  const statusLabel = item.status === "published" ? "Publicada" : "Rascunho";
  return `
    <a class="portal-card" href="${esc(appUrl(item.url))}">
      <h3>${esc(item.titulo)}</h3>
      <p>${esc(item.diretoria || "Apresentação HTML interativa")}</p>
      <div class="portal-card__meta">
        ${item.mesReferencia ? `<span class="portal-card__tag">Ref. ${esc(item.mesReferencia)}</span>` : ""}
        <span class="portal-card__tag ${statusClass}">${statusLabel}</span>
        ${item.updatedAt ? `<span class="portal-card__tag">Atualizado ${esc(formatDate(item.updatedAt))}</span>` : ""}
      </div>
      <span class="portal-card__cta">Abrir apresentação →</span>
    </a>`;
}

async function init() {
  try {
    const items = await publicApi.listPresentations();
    countEl.textContent = String(items.length);
    if (!items.length) {
      grid.innerHTML = `<p class="portal-empty">Nenhuma apresentação encontrada em <code>presentations/</code>.</p>`;
      return;
    }
    grid.innerHTML = items.map(renderCard).join("");
  } catch (err) {
    countEl.textContent = "0";
    grid.innerHTML = `<p class="portal-error">${esc(err.message)}</p>`;
  }

  try {
    const user = await authApi.me();
    if (user) {
      backofficeLink.textContent = `Backoffice (${user.nome})`;
      backofficeLink.href = backofficePath("index.html");
    }
  } catch {
    /* visitante anônimo */
  }
}

init();
