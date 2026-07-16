/* MCS — Modelo, Causa e Solução (padrão Vale/VPS) */

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusClass(status) {
  if (status === "above") return "mcs-status--above";
  if (status === "below") return "mcs-status--below";
  return "mcs-status--neutral";
}

const DEFAULT_CATEGORIAS = ["Material", "Mão de obra", "Máquina", "Método"];

function renderCategorias(categorias, selected) {
  return `<div class="mcs-categories" role="list" aria-label="Categorias de causa (4M)">
    ${categorias
      .map(
        (nome) =>
          `<span class="mcs-category${nome === selected ? " mcs-category--selected" : ""}" role="listitem">${esc(nome)}</span>`
      )
      .join("")}
  </div>`;
}

function renderMotivoBox(motivo) {
  if (!motivo) return "";
  return `<div class="mcs-motivo-box">
    <span class="mcs-motivo-box__label">Motivo</span>
    <p class="mcs-motivo-box__text">${esc(motivo)}</p>
  </div>`;
}

function renderWhyArrow() {
  return `<div class="mcs-why-arrow" aria-hidden="true"><span class="mcs-why-arrow__line"></span><span class="mcs-why-arrow__head"></span></div>`;
}

function normalizeMcsData(porques, causaRaiz, extras) {
  let data = extras || {};
  if (porques && typeof porques === "object" && !Array.isArray(porques) && porques.porques) {
    data = porques;
    causaRaiz = data.causaRaiz;
    porques = data.porques;
  }
  const categorias = data.categorias || DEFAULT_CATEGORIAS;
  return {
    porques,
    causaRaiz,
    acaoSalvadora: data.acaoSalvadora || data.acao_salvadora,
    motivo: data.motivo,
    categorias,
    categoria: data.categoria || categorias[categorias.length - 1],
  };
}

function renderWhyChain(porques, causaRaiz, acaoSalvadora) {
  const steps = (porques || [])
    .map((p, i) => {
      const nivel = p.nivel ?? i + 1;
      const hasNext = i < porques.length - 1 || causaRaiz || acaoSalvadora;
      return `
        <div class="mcs-why-step">
          <div class="mcs-why-box">
            <span class="mcs-why-box__label">${esc(nivel)}º Por quê</span>
            <p class="mcs-why-box__text">${esc(p.texto || p)}</p>
          </div>
          ${hasNext ? renderWhyArrow() : ""}
        </div>`;
    })
    .join("");

  const root = causaRaiz
    ? `
      <div class="mcs-why-step mcs-why-step--root">
        <div class="mcs-why-box mcs-why-box--root">
          <span class="mcs-why-box__label">Causa raiz</span>
          <p class="mcs-why-box__text">${esc(causaRaiz)}</p>
        </div>
        ${acaoSalvadora ? renderWhyArrow() : ""}
      </div>`
    : "";

  const salvadora = acaoSalvadora
    ? `
      <div class="mcs-why-step mcs-why-step--salvadora">
        <div class="mcs-why-box mcs-why-box--salvadora">
          <span class="mcs-why-box__label">Ação salvadora</span>
          <p class="mcs-why-box__text">${esc(acaoSalvadora)}</p>
        </div>
      </div>`
    : "";

  return `${steps}${root}${salvadora}`;
}

export function renderMcsVp1Panel(mcs) {
  const data = normalizeMcsData(mcs);
  if (!data.porques?.length && !data.causaRaiz) {
    return `<p class="mcs-empty">Cadastre a análise de causas no backoffice.</p>`;
  }

  return `
    <div class="mcs-vp1">
      <p class="mcs-why-flow__title">5 Porquês — por que o problema aconteceu?</p>
      <div class="mcs-vp1__meta">
        ${renderCategorias(data.categorias, data.categoria)}
      </div>
      <div class="mcs-vp1__chain mcs-why-flow">
        ${renderWhyChain(data.porques, data.causaRaiz, data.acaoSalvadora)}
      </div>
    </div>`;
}

export function renderPorques(porques, causaRaiz, extras) {
  const data = normalizeMcsData(porques, causaRaiz, extras);

  if (!data.porques?.length && !data.causaRaiz) {
    return `<p class="mcs-empty">Cadastre a análise de causas no backoffice.</p>`;
  }

  return `
    <div class="mcs-why-flow">
      <p class="mcs-why-flow__title">5 Porquês — por que o problema aconteceu?</p>
      ${renderCategorias(data.categorias, data.categoria)}
      ${renderMotivoBox(data.motivo)}
      ${renderWhyChain(data.porques, data.causaRaiz, data.acaoSalvadora)}
    </div>`;
}

function renderList(items, cls = "mcs-list") {
  if (!items?.length) return "";
  return `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function renderAcoes(acoes) {
  if (!acoes?.length) return `<p class="mcs-empty">Nenhuma ação cadastrada.</p>`;
  return `<table class="mcs-table"><thead><tr><th>#</th><th>Ação</th><th>Responsável</th><th>Status</th></tr></thead><tbody>${acoes
    .map(
      (a, i) =>
        `<tr><td>${esc(a.numero ?? i + 1)}</td><td>${esc(a.descricao)}</td><td>${esc(a.responsavel || "—")}</td><td>${esc(a.status || a.prazo || "—")}</td></tr>`
    )
    .join("")}</tbody></table>`;
}

function renderKpiSlide(mcs) {
  const badge = mcs.statusLabel
    ? `<span class="mcs-status ${statusClass(mcs.status)}">${esc(mcs.statusLabel)}</span>`
    : "";
  return `
    <section class="slide slide--mcs slide--mcs-kpi" data-mcs-slide>
      <header class="mcs-topbar">
        <div class="mcs-topbar__main">
          <p class="mcs-topbar__eyebrow">${esc(mcs.modelo || "Modelo de gestão Vale")}</p>
          <h1 class="mcs-topbar__title">${esc(mcs.titulo || mcs.indicador)}</h1>
          <p class="mcs-topbar__subtitle">${esc(mcs.gerencia || "")}${mcs.referencia ? ` · Ref. ${esc(mcs.referencia)}` : ""}</p>
        </div>
        ${mcs.atualizadoEm ? `<span class="mcs-topbar__date">Atualizado: ${esc(mcs.atualizadoEm)}</span>` : ""}
      </header>
      <div class="mcs-body mcs-body--kpi">
        <aside class="mcs-kpi-panel">
          <h3 class="mcs-section-title">Indicador</h3>
          <table class="mcs-kpi-table">
            <thead><tr><th>Pilar</th><th>KPI</th><th>Real</th><th>Meta</th><th>GAP</th></tr></thead>
            <tbody><tr>
              <td>${esc(mcs.pilar || "Gestão")}</td>
              <td>${esc(mcs.kpi || mcs.indicador)}</td>
              <td><strong>${esc(mcs.real || "—")}</strong></td>
              <td>${esc(mcs.meta || "—")}</td>
              <td>${esc(mcs.gap || "—")}</td>
            </tr></tbody>
          </table>
          ${badge}
          ${mcs.motivo ? `<div class="mcs-motivo"><h4>Motivo</h4><p>${esc(mcs.motivo)}</p></div>` : ""}
        </aside>
        <div class="mcs-causes-panel">
          <h3 class="mcs-section-title">Análise de causas</h3>
          ${renderPorques(mcs.porques, mcs.causaRaiz)}
        </div>
        <aside class="mcs-solution-panel">
          <h3 class="mcs-section-title">Solução</h3>
          ${renderList(mcs.solucao, "mcs-solution-list")}
        </aside>
      </div>
      <div class="mcs-actions-wrap">
        <h3 class="mcs-section-title">Plano de ação</h3>
        ${renderAcoes(mcs.acoes)}
      </div>
      <img class="slide__logo" src="../../presentation-kit/assets/logo/vale-logo-color.png" alt="Vale">
    </section>`;
}

function renderAnomaliaSlide(mcs) {
  return `
    <section class="slide slide--mcs slide--mcs-anomalia" data-mcs-slide>
      <header class="mcs-topbar">
        <div class="mcs-topbar__main">
          <p class="mcs-topbar__eyebrow">Serviços Operacionais · ${esc(mcs.gerencia || "Transportes")}</p>
          <h1 class="mcs-topbar__title">${esc(mcs.indicador || "Overbooking")}</h1>
          <p class="mcs-topbar__subtitle">${esc(mcs.modelo || "Anomalia de transporte")}${mcs.referencia ? ` · Ref. ${esc(mcs.referencia)}` : ""}</p>
        </div>
      </header>
      <div class="mcs-body mcs-body--anomalia">
        <div class="mcs-anomalia-grid">
          <div class="mcs-block mcs-block--causas">
            <h3 class="mcs-section-title">Principais causas</h3>
            ${renderList(mcs.causasPrincipais)}
            ${renderList(mcs.observacoes, "mcs-obs-list")}
          </div>
          <div class="mcs-block mcs-block--porques">
            <h3 class="mcs-section-title">Análise do problema</h3>
            ${renderPorques(mcs.porques, mcs.causaRaiz)}
          </div>
          <div class="mcs-block mcs-block--solucao">
            <h3 class="mcs-section-title">Solução / controle</h3>
            ${renderList(mcs.solucao, "mcs-solution-list")}
          </div>
        </div>
      </div>
      <div class="mcs-actions-wrap">
        <h3 class="mcs-section-title">Detalhamento — ações</h3>
        ${renderAcoes(mcs.acoes)}
      </div>
      <img class="slide__logo" src="../../presentation-kit/assets/logo/vale-logo-color.png" alt="Vale">
    </section>`;
}

function renderMcsSlide(mcs) {
  if (mcs.layout === "anomalia") return renderAnomaliaSlide(mcs);
  return renderKpiSlide(mcs);
}

export function injectMcsSlides(slidesRoot, options = {}) {
  const payload = window.VALE_INDICATORS?.mcsSlides;
  if (!payload?.length || !slidesRoot) return 0;

  const afterEl = options.after ? slidesRoot.querySelector(options.after) : null;
  const beforeEl = !afterEl && options.before !== false
    ? slidesRoot.querySelector(options.before || ".slide--content-text")
    : null;

  const html = payload.map(renderMcsSlide).join("");
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  const nodes = [...wrap.children];

  if (afterEl) {
    let anchor = afterEl;
    for (const node of nodes) {
      anchor.insertAdjacentElement("afterend", node);
      anchor = node;
    }
  } else if (beforeEl) {
    for (const node of nodes) {
      slidesRoot.insertBefore(node, beforeEl);
    }
  } else {
    for (const node of nodes) {
      slidesRoot.appendChild(node);
    }
  }

  return nodes.length;
}

export function initMcsSlides(options = {}) {
  const root = document.querySelector(".deck__slides");
  return injectMcsSlides(root, options);
}
