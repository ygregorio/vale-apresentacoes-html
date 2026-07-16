/**

 * Slide unificado VP-1 / VP-2: gráfico + comentário executivo + MCS + ações.

 */



import { renderMcsVp1Panel } from "./mcs-slide.js";



function esc(value) {

  return String(value ?? "")

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;");

}



function fmtIndicatorValue(value, indicatorId) {

  const format = window.VALE_INDICATORS?.indicators?.[indicatorId]?.meta?.format;

  if (format === "percent") {

    return `${Number(value).toFixed(2).replace(".", ",")}%`;

  }

  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Math.round(value));

}



function parseDateFromStatus(status) {

  const s = String(status || "");

  const full = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (full) {

    return new Date(Number(full[3]), Number(full[2]) - 1, Number(full[1]));

  }

  const short = s.match(/(\d{1,2})\/(\d{1,2})(?!\/)/);

  if (short) {

    return new Date(2026, Number(short[2]) - 1, Number(short[1]));

  }

  return null;

}



function classifyAction(status) {

  const raw = String(status || "—").trim();

  const lower = raw.toLowerCase();



  if (/conclu[ií]d/.test(lower)) {

    return { kind: "concluida", label: "Concluído", css: "vp1-action-status--done" };

  }



  if (/atras/.test(lower)) {

    return { kind: "atrasada", label: "Atrasado", css: "vp1-action-status--late" };

  }



  const prazo = parseDateFromStatus(raw);

  const ref = window.VALE_INDICATORS?.meta?.referencia || "jun/26";

  const refMatch = ref.match(/(\d{1,2})\/(\d{2,4})/);

  const refEnd = refMatch

    ? new Date(

        refMatch[2].length === 2 ? 2000 + Number(refMatch[2]) : Number(refMatch[2]),

        Number(refMatch[1]) - 1,

        30

      )

    : new Date(2026, 5, 30);



  if (prazo && prazo < refEnd && !/cont[ií]nu/.test(lower) && !/andamento/.test(lower)) {

    return { kind: "atrasada", label: "Atrasado", css: "vp1-action-status--late" };

  }



  return { kind: "andamento", label: raw, css: "vp1-action-status--progress" };

}



function summarizeActions(actions) {

  const counts = { concluida: 0, andamento: 0, atrasada: 0 };

  for (const a of actions) {

    counts[classifyAction(a.status).kind] += 1;

  }

  return counts;

}



const VP2_REGION_MAP = {

  Norte: "vp2-norte",

  Sul: "vp2-sul",

};



function computeRate(indicatorId, primary, secondary) {

  if (!primary) return 0;

  const format = window.VALE_INDICATORS?.indicators?.[indicatorId]?.meta?.format;

  if (format === "percent") {

    return (secondary / primary) * 100;

  }

  if (!secondary) return 0;

  return (primary / secondary) * 100;

}



function meetsMeta(indicatorId, value) {

  const meta = window.VALE_INDICATORS?.indicators?.[indicatorId]?.meta;

  if (meta?.value == null) return false;

  if (meta.format === "percent") {

    return value >= meta.value;

  }

  const trend = meta.trend || "up";

  return trend === "up" ? value >= meta.value : value <= meta.value;

}



function getVp2Result(vp2Id, indicatorId) {

  const ind = window.VALE_INDICATORS?.indicators?.[indicatorId];

  const children = ind?.gerencias?.filter(

    (g) => g.parentId === vp2Id && g.series?.barPrimary?.length

  );

  if (!children?.length) return null;



  const idx = children[0].series.barPrimary.length - 1;

  let sumPrimary = 0;

  let sumSecondary = 0;

  for (const child of children) {

    sumPrimary += child.series.barPrimary[idx];

    sumSecondary += child.series.barSecondary[idx] ?? 0;

  }



  const valor = computeRate(indicatorId, sumPrimary, sumSecondary);

  return { valor, status: meetsMeta(indicatorId, valor) ? "above" : "below" };

}



function renderVp2Badge(label, indicatorId, escopo) {

  if (escopo !== "vp1") return "";



  const vp2Id = VP2_REGION_MAP[label];

  if (!vp2Id) return "";



  const result = getVp2Result(vp2Id, indicatorId);

  if (!result) return "";



  const kpiClass =

    result.status === "above" ? "vp1-area-kpi--above" : "vp1-area-kpi--below";

  return `<span class="vp1-area-kpi vp1-exec__region-kpi ${kpiClass}">${esc(fmtIndicatorValue(result.valor, indicatorId))}</span>`;

}



function getSlideContext(slide) {

  const indicatorId = slide.dataset.indicator || "ovbk";

  const escopo = slide.dataset.escopo || "vp1";

  return { indicatorId, escopo };

}



function getPreview(indicatorId, escopo) {

  return (

    window.VALE_INDICATORS?.slidePreviews?.[indicatorId]?.[escopo] ||

    (escopo === "vp1" ? window.VALE_INDICATORS?.vp1Preview : null)

  );

}



function getAnalise(indicatorId, escopo) {

  return (

    window.VALE_INDICATORS?.analisesPorEscopo?.[indicatorId]?.[escopo] ||

    (escopo === "vp1" ? window.VALE_INDICATORS?.analises?.[indicatorId] : null)

  );

}



function getMcs(indicatorId, escopo) {

  const ind = window.VALE_INDICATORS?.indicators?.[indicatorId];

  if (escopo === "vp1") return ind?.mcsConsolidado;

  return ind?.mcsVp2?.[escopo];

}



function formatExecParagraph(text, index, status, indicatorId, escopo) {

  if (index === 0) {

    const alertClass =

      status === "below"

        ? " vp1-exec__lead--below"

        : status === "above"

          ? " vp1-exec__lead--above"

          : "";

    return `<p class="vp1-exec__lead${alertClass}"><strong>${esc(text)}</strong></p>`;

  }



  const regionMatch = text.match(/^\*\*(Norte|Sul)\*\*\s*—\s*(.+)$/s);

  if (regionMatch) {

    const [, label, body] = regionMatch;

    const badge = renderVp2Badge(label, indicatorId, escopo);

    const navMap = window.VALE_INDICATORS?.slideNav?.[indicatorId];

    const targetId = escopo === "vp1" ? navMap?.[label] : null;

    const nameHtml = targetId

      ? `<button type="button" class="vp1-exec__region-link" data-goto-slide="${esc(targetId)}">${esc(label)}</button>`

      : `<strong>${esc(label)}</strong>`;

    return `<p class="vp1-exec__region">${badge}<span class="vp1-exec__region-text">${nameHtml} — ${esc(body)}</span></p>`;

  }



  const html = esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  return `<p>${html}</p>`;

}



function renderExecutive(slide) {

  const slot = slide.querySelector("[data-vp1-exec]");

  if (!slot) return;



  const { indicatorId, escopo } = getSlideContext(slide);

  const preview = getPreview(indicatorId, escopo);

  const analise = getAnalise(indicatorId, escopo);

  const ind = window.VALE_INDICATORS?.indicators?.[indicatorId];

  if (!analise || !preview) return;



  const indLabel = ind?.meta?.label || indicatorId.toUpperCase();

  const paragrafos = (analise.paragrafos || [])

    .map((p, i) => formatExecParagraph(p, i, analise.status, indicatorId, escopo))

    .join("");



  slot.innerHTML = `

    <h3 class="vp1-exec__heading">Comentário executivo</h3>

    <div class="vp1-ranking">

      <div class="vp1-rank-card vp1-rank-card--best">

        <div class="vp1-rank-card__label">Melhor área</div>

        <p class="vp1-rank-card__name">${esc(preview.melhorArea.nome)}</p>

        <p class="vp1-rank-card__value">Taxa ${esc(indLabel)}: ${fmtIndicatorValue(preview.melhorArea.valor, indicatorId)}</p>

      </div>

      <div class="vp1-rank-card vp1-rank-card--worst">

        <div class="vp1-rank-card__label">Pior área</div>

        <p class="vp1-rank-card__name">${esc(preview.piorArea.nome)}</p>

        <p class="vp1-rank-card__value">Taxa ${esc(indLabel)}: ${fmtIndicatorValue(preview.piorArea.valor, indicatorId)}</p>

      </div>

    </div>

    <div class="vp1-exec__text">${paragrafos}</div>

  `;

}



function renderMcs(slide) {

  const slot = slide.querySelector("[data-vp1-mcs]");

  if (!slot) return;



  const { indicatorId, escopo } = getSlideContext(slide);

  const mcs = getMcs(indicatorId, escopo);

  if (!mcs) {

    slot.innerHTML = `<p class="mcs-empty">MCS consolidado não disponível.</p>`;

    return;

  }



  slot.innerHTML = `

    <h3 class="vp1-section-title">Análise de causas — MCS</h3>

    ${renderMcsVp1Panel(mcs)}

  `;

}



function renderActionRows(actions, filter = "all") {

  const filtered =

    filter === "all" ? actions : actions.filter((a) => classifyAction(a.status).kind === filter);



  if (!filtered.length) {

    return `<tr><td colspan="3" class="vp1-actions-empty">Nenhuma ação neste status.</td></tr>`;

  }



  return filtered

    .map((a) => {

      const st = classifyAction(a.status);

      return `<tr data-action-kind="${st.kind}">

          <td class="vp1-actions-area">${esc(a.gerencia)}</td>

          <td>${esc(a.descricao)}</td>

          <td><span class="vp1-action-status ${st.css}">${esc(st.label)}</span></td>

        </tr>`;

    })

    .join("");

}



function renderActions(slide, activeFilter = "all") {

  const slot = slide.querySelector("[data-vp1-actions]");

  if (!slot) return;



  const { indicatorId, escopo } = getSlideContext(slide);

  const preview = getPreview(indicatorId, escopo);

  const actions = preview?.acoesPrioritarias || [];

  if (!actions.length) {

    slot.innerHTML = `<p class="mcs-empty">Nenhuma ação cadastrada.</p>`;

    return;

  }



  const counts = summarizeActions(actions);

  const cards = [

    { kind: "concluida", count: counts.concluida, label: "Concluídas", css: "vp1-action-card--done" },

    { kind: "andamento", count: counts.andamento, label: "Em andamento", css: "vp1-action-card--progress" },

    { kind: "atrasada", count: counts.atrasada, label: "Atrasadas", css: "vp1-action-card--late" },

  ];



  slot.innerHTML = `

    <h3 class="vp1-section-title">Principais ações e prazos</h3>

    <div class="vp1-action-cards" role="toolbar" aria-label="Filtrar ações por status">

      ${cards

        .map(

          (c) => `

        <button type="button"

          class="vp1-action-card ${c.css}${activeFilter === c.kind ? " is-active" : ""}"

          data-action-filter="${c.kind}"

          aria-pressed="${activeFilter === c.kind ? "true" : "false"}">

          <span class="vp1-action-card__count">${c.count}</span>

          <span class="vp1-action-card__label">${c.label}</span>

        </button>`

        )

        .join("")}

    </div>

    <div class="vp1-actions-scroll">

      <table class="vp1-actions-table">

        <thead>

          <tr><th>Área</th><th>Ação</th><th>Status</th></tr>

        </thead>

        <tbody data-vp1-actions-body>${renderActionRows(actions, activeFilter)}</tbody>

      </table>

    </div>

  `;



  slot.dataset.activeFilter = activeFilter;

}



function bindActionFilters(slide) {

  const slot = slide.querySelector("[data-vp1-actions]");

  if (!slot || slot.dataset.filterBound === "true") return;



  slot.dataset.filterBound = "true";

  slot.addEventListener("click", (event) => {

    const card = event.target.closest("[data-action-filter]");

    if (!card) return;



    const { indicatorId, escopo } = getSlideContext(slide);

    const preview = getPreview(indicatorId, escopo);

    const actions = preview?.acoesPrioritarias || [];

    const kind = card.dataset.actionFilter;

    const current = slot.dataset.activeFilter || "all";

    const next = current === kind ? "all" : kind;



    slot.querySelectorAll("[data-action-filter]").forEach((btn) => {

      const active = btn.dataset.actionFilter === next;

      btn.classList.toggle("is-active", active);

      btn.setAttribute("aria-pressed", active ? "true" : "false");

    });



    const tbody = slot.querySelector("[data-vp1-actions-body]");

    if (tbody) {

      tbody.innerHTML = renderActionRows(actions, next === "all" ? "all" : next);

    }

    slot.dataset.activeFilter = next;

  });

}



function bindRegionLinks(slide) {

  const exec = slide.querySelector("[data-vp1-exec]");

  if (!exec || exec.dataset.navBound === "true") return;



  exec.dataset.navBound = "true";

  exec.addEventListener("click", (event) => {

    const btn = event.target.closest("[data-goto-slide]");

    if (!btn) return;

    const targetId = btn.dataset.gotoSlide;

    if (targetId && window.__valeDeck?.goToSlideId) {

      window.__valeDeck.goToSlideId(targetId);

    }

  });

}



function fitMcsChain(slide) {

  const panel = slide.querySelector(".vp1-mcs-panel");

  const vp1 = slide.querySelector(".mcs-vp1");

  const sectionTitle = slide.querySelector(".vp1-mcs-panel .vp1-section-title");

  const chain = slide.querySelector(".mcs-vp1__chain");

  const title = slide.querySelector(".mcs-vp1 .mcs-why-flow__title");

  const meta = slide.querySelector(".mcs-vp1__meta");

  if (!panel || !vp1 || !chain || !sectionTitle) return;



  vp1.classList.remove("is-scaled");

  vp1.style.transform = "";

  vp1.style.width = "";

  vp1.style.marginBottom = "";



  const panelStyle = getComputedStyle(panel);

  const panelBottom =

    panel.getBoundingClientRect().bottom - parseFloat(panelStyle.paddingBottom);

  const available = panelBottom - sectionTitle.getBoundingClientRect().bottom - 4;

  const needed =

    (title?.offsetHeight ?? 0) + (meta?.offsetHeight ?? 0) + chain.scrollHeight;



  if (needed <= available || available <= 0) return;



  let scale = available / needed;

  const maxBottom = panelBottom;

  const salv = slide.querySelector(".mcs-why-box--salvadora");



  for (let i = 0; i < 10; i += 1) {

    vp1.classList.add("is-scaled");

    vp1.style.transform = `scale(${scale})`;

    vp1.style.transformOrigin = "top center";

    vp1.style.width = `${100 / scale}%`;

    vp1.style.marginBottom = `${-(needed * (1 - scale))}px`;



    const probe = salv || chain.lastElementChild;

    if (!probe || probe.getBoundingClientRect().bottom <= maxBottom + 1) break;

    scale *= 0.96;

  }

}



function bindMcsFit(slide) {

  const panel = slide.querySelector(".vp1-mcs-panel");

  if (!panel || panel.dataset.mcsFitBound === "true") return;



  panel.dataset.mcsFitBound = "true";

  const run = () => fitMcsChain(slide);



  if (typeof ResizeObserver !== "undefined") {

    const observer = new ResizeObserver(run);

    observer.observe(panel);

  }



  window.addEventListener("resize", run);

  requestAnimationFrame(run);

}



export function initVp1IndicatorSlide(slide) {

  renderExecutive(slide);

  renderMcs(slide);

  renderActions(slide);

  bindActionFilters(slide);

  bindRegionLinks(slide);

  bindMcsFit(slide);

}


