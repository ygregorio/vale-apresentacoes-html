import { api, auditApi, authApi, requireAuth, usersApi } from "./api.js";
import {
  NIVEIS,
  NIVEL_LABELS,
  ESCOPO_LABELS,
  getChartNodes,
  getNodesForEscopo,
  describeEscopoResumo,
  getDescendantIds,
  getHierarchyPath,
  getNodeMap,
  getParentOptions,
  migrateGerenciasToHierarquia,
  parentNivelFor,
  resolveParentForNivel,
  sortHierarquiaForDisplay,
} from "./hierarquia.js";

const state = {
  step: "home",
  ref: null,
  dirty: false,
  saving: false,
  hierForm: null,
  indForm: null,
  currentUser: null,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const appRoot = $("#app-root");
const pageTitle = $("#page-title");
const pageSubtitle = $("#page-subtitle");
const topbarActions = $("#topbar-actions");
const mainNav = $("#main-nav");
const adminNav = $("#admin-nav");
const sidebarUser = $("#sidebar-user");
const toastEl = $("#toast");
const globalError = $("#global-error");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toastEl.hidden = true;
  }, 2800);
}

function showError(msg) {
  globalError.textContent = msg || "";
  globalError.hidden = !msg;
}

function setNavVisible(visible) {
  mainNav.hidden = !visible;
  $$(".bo-nav__item", mainNav).forEach((btn) => {
    btn.classList.toggle("is-active", visible && btn.dataset.step === state.step);
  });
}

function setAdminNavVisible(visible) {
  adminNav.hidden = !visible;
  if (!visible) return;
  $$(".bo-nav__item", adminNav).forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.step === state.step);
  });
}

function updateSidebarUser(user) {
  sidebarUser.innerHTML = `
    <strong>${esc(user.nome)}</strong>
    <span class="bo-user__role">${user.role === "admin" ? "Administrador" : "Usuário"}</span>
    <button type="button" class="bo-btn bo-btn--ghost bo-btn--sm bo-btn--block" id="btn-logout">Sair</button>`;
  $("#btn-logout", sidebarUser).addEventListener("click", async () => {
    await authApi.logout();
    window.location.href = "/backoffice/login.html";
  });
}

function ensureIndicatorStructure(ind, meses, hierarquia) {
  ind.escopoNivel = ind.escopoNivel || "VP";
  const nodes = getNodesForEscopo(hierarquia, ind.escopoNivel);
  ind.valores = ind.valores || {};
  ind.valores.consolidado = ind.valores.consolidado || {};
  ind.valores.gerencias = ind.valores.gerencias || {};
  ind.analisesGerencia = ind.analisesGerencia || {};
  ind.analiseConsolidado = ind.analiseConsolidado || {
    tituloCurto: "",
    status: "below",
    statusLabel: "",
    paragrafos: [""],
  };
  ind.labels = ind.labels || { barPrimary: "", barSecondary: "", line: "" };

  for (const key of ["barPrimary", "barSecondary", "line"]) {
    const arr = ind.valores.consolidado[key];
    if (!Array.isArray(arr) || arr.length !== meses.length) {
      ind.valores.consolidado[key] = meses.map((_, i) => (arr?.[i] ?? 0));
    }
  }
  for (const g of nodes) {
    ind.valores.gerencias[g.id] = ind.valores.gerencias[g.id] || {};
    for (const key of ["barPrimary", "barSecondary", "line"]) {
      const arr = ind.valores.gerencias[g.id][key];
      if (!Array.isArray(arr) || arr.length !== meses.length) {
        ind.valores.gerencias[g.id][key] = meses.map((_, i) => (arr?.[i] ?? 0));
      }
    }
    ind.analisesGerencia[g.id] = ind.analisesGerencia[g.id] || {
      status: "below",
      statusLabel: "",
      positivos: [""],
      negativos: [""],
    };
  }
}

function normalizeRef(ref) {
  migrateGerenciasToHierarquia(ref);
  const meses = ref.config?.mesesSerie || [];
  ref.hierarquia = (ref.hierarquia || []).map((h, i) => ({
    ...h,
    ordem: h.ordem ?? i + 1,
    parentId: h.nivel === "VP" ? null : h.parentId || null,
  }));
  ref.indicators = (ref.indicators || []).map((ind, i) => {
    if (!ind.escopoNivel) ind.escopoNivel = "VP";
    ensureIndicatorStructure(ind, meses, ref.hierarquia);
    return { ...ind, ordem: ind.ordem ?? i + 1 };
  });
  return ref;
}

async function saveRef(showMsg = true) {
  if (!state.ref || state.saving) return;
  state.saving = true;
  try {
    const saved = await api.saveReferencia(state.ref.id, state.ref);
    state.ref = normalizeRef(saved);
    state.dirty = false;
    if (showMsg) showToast("Salvo com sucesso");
  } catch (err) {
    showError(err.message);
    throw err;
  } finally {
    state.saving = false;
  }
}

function markDirty() {
  state.dirty = true;
  renderTopbarActions();
}

function renderTopbarActions() {
  if (!state.ref) {
    topbarActions.innerHTML = "";
    return;
  }
  topbarActions.innerHTML = `
    ${state.dirty ? '<span class="bo-badge bo-badge--draft">Alterações não salvas</span>' : ""}
    <button type="button" class="bo-btn bo-btn--primary" id="btn-save">Salvar</button>
  `;
  $("#btn-save", topbarActions)?.addEventListener("click", () => saveRef());
}

async function goHome() {
  if (state.dirty && !confirm("Há alterações não salvas. Deseja sair mesmo assim?")) return;
  state.ref = null;
  state.step = "home";
  state.dirty = false;
  setNavVisible(false);
  setAdminNavVisible(state.currentUser?.role === "admin");
  pageTitle.textContent = "Referências";
  pageSubtitle.textContent = "Cadastre indicadores diretamente na tela";
  renderTopbarActions();
  showError("");
  await renderHome();
}

function goAdminStep(step) {
  if (state.currentUser?.role !== "admin") {
    showError("Acesso restrito a administradores.");
    return;
  }
  if (state.dirty && !confirm("Há alterações não salvas. Deseja sair mesmo assim?")) return;
  state.ref = null;
  state.step = step;
  state.dirty = false;
  setNavVisible(false);
  setAdminNavVisible(true);
  pageTitle.textContent = step === "usuarios" ? "Usuários" : "Auditoria";
  pageSubtitle.textContent =
    step === "usuarios" ? "Gerencie contas e perfis de acesso" : "Histórico de ações no sistema";
  renderTopbarActions();
  renderStep();
}

async function openRef(id) {
  showError("");
  const ref = normalizeRef(await api.getReferencia(id));
  state.ref = ref;
  state.step = "config";
  state.dirty = false;
  setNavVisible(true);
  setAdminNavVisible(false);
  pageTitle.textContent = ref.config.diretoria || ref.id;
  pageSubtitle.textContent = `Referência ${ref.config.mesReferencia || "—"} · ${ref.config.areaResponsavel || "—"}`;
  renderTopbarActions();
  renderStep();
}

function goStep(step) {
  if (!state.ref) {
    showError("Abra ou crie uma referência na lista antes de usar o menu lateral.");
    return;
  }
  state.step = step;
  $$(".bo-nav__item", mainNav).forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.step === step);
  });
  renderStep();
}

async function renderHome() {
  setNavVisible(false);
  state.step = "home";
  const tpl = document.importNode($("#tpl-home").content, true);
  appRoot.replaceChildren(tpl);
  const tbody = $("#refs-table tbody", appRoot);
  const refs = await api.listReferencias();

  if (!refs.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="bo-empty">Nenhuma referência cadastrada</td></tr>`;
  } else {
    tbody.innerHTML = refs
      .map(
        (r) => `
      <tr>
        <td><code>${r.id}</code></td>
        <td>${r.config?.diretoria || "—"}</td>
        <td>${r.config?.mesReferencia || "—"}</td>
        <td><span class="bo-badge bo-badge--${r.status === "published" ? "published" : "draft"}">${r.status || "draft"}</span></td>
        <td>${r.updatedAt ? new Date(r.updatedAt).toLocaleString("pt-BR") : "—"}</td>
        <td class="bo-inline-actions">
          <button type="button" class="bo-btn bo-btn--sm bo-btn--primary" data-open="${r.id}">Abrir</button>
          ${state.currentUser?.role === "admin" ? `<button type="button" class="bo-btn bo-btn--sm bo-btn--danger" data-del="${r.id}">Excluir</button>` : ""}
        </td>
      </tr>`
      )
      .join("");
  }

  $$("[data-open]", appRoot).forEach((btn) =>
    btn.addEventListener("click", () => openRef(btn.dataset.open))
  );
  $$("[data-del]", appRoot).forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm(`Excluir referência "${btn.dataset.del}"?`)) return;
      await api.deleteReferencia(btn.dataset.del);
      showToast("Referência excluída");
      await renderHome();
    })
  );

  const newForm = $("#new-ref-form", appRoot);
  $("#btn-new-ref", appRoot).addEventListener("click", () => {
    newForm.hidden = false;
  });
  $("#btn-cancel-new", appRoot).addEventListener("click", () => {
    newForm.hidden = true;
  });
  $("#form-new-ref", appRoot).addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    try {
      const created = await api.createReferencia(body);
      showToast("Referência criada");
      await openRef(created.id);
    } catch (err) {
      showError(err.message);
    }
  });
}

function renderConfig() {
  const c = state.ref.config;
  appRoot.innerHTML = `
    <div class="bo-panel">
      <h2>Configuração da referência</h2>
      <p class="bo-help">Diretoria, áreas responsáveis, hierarquia e parâmetros da apresentação — tudo cadastrado aqui.</p>
      <form class="bo-form bo-form--grid" id="form-config">
        <label>Título da apresentação<input name="tituloApresentacao" value="${esc(c.tituloApresentacao)}"></label>
        <label>Subtítulo (capa)<input name="subtituloApresentacao" value="${esc(c.subtituloApresentacao)}"></label>
        <label>Diretoria<input name="diretoria" required value="${esc(c.diretoria)}"></label>
        <label>Área responsável<input name="areaResponsavel" required value="${esc(c.areaResponsavel)}"></label>
        <label>Área de hierarquia<input name="areaHierarquia" value="${esc(c.areaHierarquia)}"></label>
        <label>Mês de referência<input name="mesReferencia" required value="${esc(c.mesReferencia)}"></label>
        <label>Slug da apresentação (pasta)<input name="presentationSlug" required pattern="[a-z0-9-]+" value="${esc(c.presentationSlug)}"></label>
        <label class="bo-form__actions--full">Meses da série (um por linha)
          <textarea name="mesesSerie" rows="5">${esc((c.mesesSerie || []).join("\n"))}</textarea>
        </label>
      </form>
    </div>`;

  $("#form-config", appRoot).addEventListener("input", (e) => {
    const fd = new FormData(e.target.form);
    const mesesRaw = String(fd.get("mesesSerie") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const prevMeses = state.ref.config.mesesSerie || [];
    Object.assign(state.ref.config, {
      tituloApresentacao: fd.get("tituloApresentacao"),
      subtituloApresentacao: fd.get("subtituloApresentacao"),
      diretoria: fd.get("diretoria"),
      areaResponsavel: fd.get("areaResponsavel"),
      areaHierarquia: fd.get("areaHierarquia"),
      mesReferencia: fd.get("mesReferencia"),
      presentationSlug: fd.get("presentationSlug"),
      mesesSerie: mesesRaw,
    });
    if (mesesRaw.length !== prevMeses.length) {
      state.ref = normalizeRef(state.ref);
    }
    pageTitle.textContent = state.ref.config.diretoria || state.ref.id;
    pageSubtitle.textContent = `Referência ${state.ref.config.mesReferencia} · ${state.ref.config.areaResponsavel}`;
    markDirty();
  });
}

function buildParentSelectHtml(hierarquia, nivel, selectedId, attrName, excludeId = null) {
  if (nivel === "VP") {
    return `<label>Hierarquia superior<input disabled value="— (topo; pode haver vários VPs)"></label>`;
  }
  const parentNivel = parentNivelFor(nivel);
  const opts = getParentOptions(hierarquia, nivel, excludeId);
  const hint =
    opts.length === 0
      ? `<span class="bo-hier-hint">Cadastre antes um nó ${parentNivel} para vincular este ${nivel}.</span>`
      : `<span class="bo-hier-hint">Selecione a qual ${parentNivel} este ${nivel} pertence (${opts.length} disponível${opts.length > 1 ? "eis" : ""}).</span>`;
  return `
    <label>Hierarquia superior
      ${hint}
      <select ${attrName} data-field="parentId" ${opts.length ? "required" : "disabled"}>
        <option value="">— selecione —</option>
        ${opts
          .map(
            (p) =>
              `<option value="${esc(p.id)}" ${p.id === selectedId ? "selected" : ""}>${esc(p.nome)} (${esc(p.nivel)})</option>`
          )
          .join("")}
      </select>
    </label>`;
}

function renderHierarquia() {
  const map = getNodeMap(state.ref.hierarquia);
  const sorted = sortHierarquiaForDisplay(state.ref.hierarquia);
  const form = state.hierForm;

  const formPanel = form
    ? `
    <div class="bo-panel bo-panel--add-form" id="hier-add-panel">
      <h3>Novo nó na hierarquia</h3>
      <p class="bo-help">Escolha o <strong>nível</strong> e a <strong>hierarquia superior</strong> antes de confirmar. Vários VPs e VP-1s são permitidos.</p>
      <form class="bo-form bo-form--grid" id="form-new-hier">
        <label>Nível
          <select name="nivel" id="new-hier-nivel" required>
            ${NIVEIS.map(
              (n) =>
                `<option value="${n}" ${form.nivel === n ? "selected" : ""}>${esc(NIVEL_LABELS[n])}</option>`
            ).join("")}
          </select>
        </label>
        <div id="new-hier-parent-wrap" class="bo-form__actions--full">
          ${buildParentSelectHtml(state.ref.hierarquia, form.nivel, form.parentId, 'name="parentId" id="new-hier-parent"')}
        </div>
        <label>Nome<input name="nome" required value="${esc(form.nome)}" placeholder="Ex.: Marcelo — Diretoria"></label>
        <label>ID (slug)<input name="id" pattern="[a-z0-9-]+" value="${esc(form.id)}" placeholder="gerado automaticamente se vazio"></label>
        <label>Ordem<input type="number" name="ordem" value="${form.ordem}"></label>
        <div class="bo-form__actions bo-form__actions--full">
          <button type="submit" class="bo-btn bo-btn--primary">Confirmar nó</button>
          <button type="button" class="bo-btn bo-btn--ghost" id="btn-cancel-hier">Cancelar</button>
        </div>
      </form>
    </div>`
    : "";

  const rows = sorted
    .map((h) => {
      const parentField = buildParentSelectHtml(
        state.ref.hierarquia,
        h.nivel,
        h.parentId,
        `data-h="${h.id}"`,
        h.id
      );

      return `
    <div class="bo-card bo-card--hier" data-hid="${h.id}">
      <div class="bo-card__header">
        <div>
          <span class="bo-hier-badge bo-hier-badge--${h.nivel.replace("-", "")}">${esc(h.nivel)}</span>
          <h3 class="bo-card__title">${esc(h.nome)}</h3>
          <p class="bo-hier-path">${esc(getHierarchyPath(h.id, map))}</p>
        </div>
        <button type="button" class="bo-btn bo-btn--sm bo-btn--danger" data-remove-h="${h.id}">Remover</button>
      </div>
      <div class="bo-form bo-form--grid">
        <label>ID (slug)<input data-h="${h.id}" data-field="id" value="${esc(h.id)}" pattern="[a-z0-9-]+"></label>
        <label>Nome<input data-h="${h.id}" data-field="nome" value="${esc(h.nome)}"></label>
        <label>Nível
          <select data-h="${h.id}" data-field="nivel">
            ${NIVEIS.map(
              (n) =>
                `<option value="${n}" ${h.nivel === n ? "selected" : ""}>${esc(NIVEL_LABELS[n])}</option>`
            ).join("")}
          </select>
        </label>
        ${parentField}
        <label>Ordem (entre irmãos)<input type="number" data-h="${h.id}" data-field="ordem" value="${h.ordem}"></label>
      </div>
    </div>`;
    })
    .join("");

  appRoot.innerHTML = `
    ${formPanel}
    <div class="bo-panel">
      <div class="bo-panel__header">
        <h2>Hierarquia</h2>
        <button type="button" class="bo-btn bo-btn--primary" id="btn-add-hier" ${form ? "disabled" : ""}>Adicionar nó</button>
      </div>
      <p class="bo-help">
        Cadastre VP, VP-1, VP-2, VP-3 e VP-4 — <strong>vários nós no mesmo nível</strong> são permitidos.
        Cada nó (exceto VP) deve estar ligado a um nó do nível imediatamente acima. Unidades VP-4 alimentam os gráficos por unidade.
      </p>
      <div class="bo-hier-legend">
        ${NIVEIS.map((n) => `<span class="bo-hier-badge bo-hier-badge--${n.replace("-", "")}">${n}</span>`).join("")}
      </div>
      <div class="bo-list-cards">${rows || '<p class="bo-empty">Nenhum nó cadastrado. Clique em <strong>Adicionar nó</strong> e comece pelo VP.</p>'}</div>
    </div>`;

  $("#btn-add-hier", appRoot)?.addEventListener("click", () => {
    const list = state.ref.hierarquia;
    state.hierForm = {
      nivel: "VP",
      parentId: null,
      nome: "",
      id: "",
      ordem: list.length + 1,
    };
    renderHierarquia();
  });

  $("#btn-cancel-hier", appRoot)?.addEventListener("click", () => {
    state.hierForm = null;
    renderHierarquia();
  });

  $("#new-hier-nivel", appRoot)?.addEventListener("change", (e) => {
    const nivel = e.target.value;
    state.hierForm.nivel = nivel;
    state.hierForm.parentId = resolveParentForNivel(state.ref.hierarquia, nivel, state.hierForm.parentId);
    const wrap = $("#new-hier-parent-wrap", appRoot);
    if (wrap) {
      wrap.innerHTML = buildParentSelectHtml(
        state.ref.hierarquia,
        nivel,
        state.hierForm.parentId,
        'name="parentId" id="new-hier-parent"'
      );
    }
  });

  $("#form-new-hier", appRoot)?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nivel = fd.get("nivel");
    const parentId = nivel === "VP" ? null : String(fd.get("parentId") || "") || null;
    const nome = String(fd.get("nome") || "").trim();
    if (!nome) {
      showError("Informe o nome do nó.");
      return;
    }
    if (nivel !== "VP" && !parentId) {
      showError(`Selecione a hierarquia superior (${parentNivelFor(nivel)}).`);
      return;
    }
    const opts = getParentOptions(state.ref.hierarquia, nivel);
    if (nivel !== "VP" && !opts.some((o) => o.id === parentId)) {
      showError("Hierarquia superior inválida para o nível selecionado.");
      return;
    }
    let id = slugify(String(fd.get("id") || "") || nome);
    if (!id) id = slugify(`no-${nivel}-${state.ref.hierarquia.length + 1}`);
    if (state.ref.hierarquia.some((h) => h.id === id)) {
      showError(`ID "${id}" já existe. Escolha outro slug.`);
      return;
    }
    state.ref.hierarquia.push({
      id,
      nome,
      nivel,
      parentId,
      ordem: Number(fd.get("ordem")) || state.ref.hierarquia.length + 1,
    });
    state.hierForm = null;
    state.ref = normalizeRef(state.ref);
    markDirty();
    showError("");
    showToast("Nó adicionado");
    renderHierarquia();
  });

  $$("[data-remove-h]", appRoot).forEach((btn) =>
    btn.addEventListener("click", () => {
      const hid = btn.dataset.removeH;
      const desc = getDescendantIds(hid, state.ref.hierarquia);
      const total = desc.size + 1;
      const msg =
        total > 1
          ? `Remover este nó e ${desc.size} filho(s) abaixo?`
          : "Remover este nó da hierarquia?";
      if (!confirm(msg)) return;
      const removeIds = new Set([hid, ...desc]);
      state.ref.hierarquia = state.ref.hierarquia.filter((h) => !removeIds.has(h.id));
      for (const ind of state.ref.indicators) {
        for (const rid of removeIds) {
          delete ind.valores?.gerencias?.[rid];
          delete ind.analisesGerencia?.[rid];
        }
      }
      state.ref = normalizeRef(state.ref);
      markDirty();
      renderHierarquia();
    })
  );

  const onHierField = (el) => {
    const oldId = el.dataset.h;
    const field = el.dataset.field;
    const h = state.ref.hierarquia.find((x) => x.id === oldId);
    if (!h) return;

    if (field === "id") {
      const newId = slugify(el.value) || oldId;
      if (newId !== oldId && !state.ref.hierarquia.some((x) => x.id === newId)) {
        for (const node of state.ref.hierarquia) {
          if (node.parentId === oldId) node.parentId = newId;
        }
        for (const ind of state.ref.indicators) {
          if (ind.valores?.gerencias?.[oldId]) {
            ind.valores.gerencias[newId] = ind.valores.gerencias[oldId];
            delete ind.valores.gerencias[oldId];
          }
          if (ind.analisesGerencia?.[oldId]) {
            ind.analisesGerencia[newId] = ind.analisesGerencia[oldId];
            delete ind.analisesGerencia[oldId];
          }
        }
        h.id = newId;
        el.dataset.h = newId;
      }
    } else if (field === "nome") {
      h.nome = el.value;
    } else if (field === "ordem") {
      h.ordem = Number(el.value) || 0;
    } else if (field === "nivel") {
      h.nivel = el.value;
      h.parentId = resolveParentForNivel(state.ref.hierarquia, h.nivel, h.parentId, h.id);
      markDirty();
      renderHierarquia();
      return;
    } else if (field === "parentId") {
      h.parentId = el.value || null;
    }
    markDirty();
  };

  $$("[data-h]", appRoot).forEach((el) => {
    el.addEventListener("input", () => onHierField(el));
    el.addEventListener("change", () => onHierField(el));
  });
}

function emptyIndicatorForm() {
  const n = (state.ref?.indicators?.length || 0) + 1;
  return {
    id: "",
    ordem: n,
    titulo: "",
    escopoNivel: "VP",
    metaValue: "",
    metaFormat: "percent",
    metaTrend: "down",
    barPrimary: "",
    barSecondary: "",
    line: "",
  };
}

function renderIndicatorDimensoesFields(ind, prefix = "edit") {
  const escopo = ind.escopoNivel || "VP";
  const isNew = prefix === "new";
  const escopoCtrl = isNew
    ? `name="escopoNivel" id="new-ind-escopo"`
    : `data-ind="${ind.id}" data-field="escopoNivel"`;
  const dimCtrl = (labelKey, formName) =>
    isNew
      ? `name="${formName}" required`
      : `data-ind="${ind.id}" data-field="labels.${labelKey}"`;
  const val = (labelKey, formKey) => esc(ind.labels?.[labelKey] || ind[formKey] || "");

  return `
    <fieldset class="bo-fieldset bo-form__actions--full">
      <legend>Dimensão hierárquica</legend>
      <p class="bo-hier-hint">Define até qual nível o indicador exige preenchimento de valores e análises.</p>
      <label>Aplicar até o nível
        <select ${escopoCtrl}>
          ${NIVEIS.map(
            (n) =>
              `<option value="${n}" ${escopo === n ? "selected" : ""}>${esc(ESCOPO_LABELS[n])}</option>`
          ).join("")}
        </select>
      </label>
      <p class="bo-hier-hint" ${isNew ? 'id="new-ind-escopo-resumo"' : ""}>${esc(describeEscopoResumo(state.ref.hierarquia, escopo))}</p>
    </fieldset>
    <fieldset class="bo-fieldset bo-form__actions--full">
      <legend>Dimensões do gráfico (séries)</legend>
      <p class="bo-hier-hint">Cadastre as dimensões/séries livres — não há catálogo fechado. Ex.: passageiros, taxa, viagens.</p>
      <div class="bo-form bo-form--grid">
        <label>Dimensão barra primária<input ${dimCtrl("barPrimary", "barPrimary")} value="${val("barPrimary", "barPrimary")}" placeholder="Ex.: Passageiros transportados / 100"></label>
        <label>Dimensão barra secundária<input ${dimCtrl("barSecondary", "barSecondary")} value="${val("barSecondary", "barSecondary")}" placeholder="Ex.: Passageiros overbook"></label>
        <label>Dimensão linha (indicador)<input ${dimCtrl("line", "line")} value="${val("line", "line")}" placeholder="Ex.: OVBK"></label>
      </div>
    </fieldset>`;
}

function renderIndicators() {
  const form = state.indForm;

  const formPanel = form
    ? `
    <div class="bo-panel bo-panel--add-form" id="ind-add-panel">
      <h3>Novo indicador</h3>
      <p class="bo-help">Informe identificação, meta, <strong>dimensão hierárquica</strong> e as <strong>dimensões do gráfico</strong> antes de confirmar.</p>
      <form class="bo-form bo-form--grid" id="form-new-ind">
        <label>ID (slug)<input name="id" pattern="[a-z0-9-]+" value="${esc(form.id)}" placeholder="ex.: ovbk, ptl, meu-indicador"></label>
        <label>Ordem<input type="number" name="ordem" value="${form.ordem}"></label>
        <label class="bo-form__actions--full">Título<input name="titulo" required value="${esc(form.titulo)}" placeholder="Ex.: OVBK – Taxa de overbook"></label>
        ${renderIndicatorDimensoesFields(form, "new")}
        <label>Meta (valor)<input type="number" step="any" name="metaValue" value="${esc(form.metaValue)}" required></label>
        <label>Formato da meta
          <select name="metaFormat">
            <option value="percent" ${form.metaFormat === "percent" ? "selected" : ""}>Percentual</option>
            <option value="number" ${form.metaFormat === "number" ? "selected" : ""}>Numérico</option>
          </select>
        </label>
        <label>Tendência da meta
          <select name="metaTrend">
            <option value="up" ${form.metaTrend === "up" ? "selected" : ""}>Quanto maior, melhor</option>
            <option value="down" ${form.metaTrend === "down" ? "selected" : ""}>Quanto menor, melhor</option>
          </select>
        </label>
        <div class="bo-form__actions bo-form__actions--full">
          <button type="submit" class="bo-btn bo-btn--primary">Confirmar indicador</button>
          <button type="button" class="bo-btn bo-btn--ghost" id="btn-cancel-ind">Cancelar</button>
        </div>
      </form>
    </div>`
    : "";

  const cards = state.ref.indicators
    .sort((a, b) => a.ordem - b.ordem)
    .map(
      (ind) => `
    <div class="bo-card" data-ind="${ind.id}">
      <div class="bo-card__header">
        <div>
          <h3 class="bo-card__title">${esc(ind.titulo || ind.id)}</h3>
          <p class="bo-hier-hint">${esc(ind.labels?.line || "—")} · escopo ${esc(ind.escopoNivel || "VP")} · ${esc(describeEscopoResumo(state.ref.hierarquia, ind.escopoNivel || "VP"))}</p>
        </div>
        <button type="button" class="bo-btn bo-btn--sm bo-btn--danger" data-remove-ind="${ind.id}">Remover</button>
      </div>
      <div class="bo-form bo-form--grid">
        <label>ID<input data-ind="${ind.id}" data-field="id" value="${esc(ind.id)}" pattern="[a-z0-9-]+"></label>
        <label>Ordem<input type="number" data-ind="${ind.id}" data-field="ordem" value="${ind.ordem}"></label>
        <label class="bo-form__actions--full">Título<input data-ind="${ind.id}" data-field="titulo" value="${esc(ind.titulo)}"></label>
        ${renderIndicatorDimensoesFields(ind, "edit")}
        <label>Meta (valor)<input type="number" step="any" data-ind="${ind.id}" data-field="meta.value" value="${ind.meta?.value ?? ""}"></label>
        <label>Formato da meta
          <select data-ind="${ind.id}" data-field="meta.format">
            <option value="percent" ${ind.meta?.format === "percent" ? "selected" : ""}>Percentual</option>
            <option value="number" ${ind.meta?.format === "number" ? "selected" : ""}>Numérico</option>
          </select>
        </label>
        <label>Tendência da meta
          <select data-ind="${ind.id}" data-field="meta.trend">
            <option value="up" ${ind.meta?.trend === "up" ? "selected" : ""}>Quanto maior, melhor</option>
            <option value="down" ${ind.meta?.trend === "down" ? "selected" : ""}>Quanto menor, melhor</option>
          </select>
        </label>
      </div>
    </div>`
    )
    .join("");

  appRoot.innerHTML = `
    ${formPanel}
    <div class="bo-panel">
      <div class="bo-panel__header">
        <h2>Indicadores</h2>
        <button type="button" class="bo-btn bo-btn--primary" id="btn-add-ind" ${form ? "disabled" : ""}>Adicionar indicador</button>
      </div>
      <p class="bo-help">Cadastre indicadores livres com suas dimensões (séries do gráfico) e o nível hierárquico de aplicação. Não há lista fechada — você define tudo na tela.</p>
      <div class="bo-list-cards">${cards || '<p class="bo-empty">Nenhum indicador cadastrado. Clique em <strong>Adicionar indicador</strong>.</p>'}</div>
    </div>`;

  $("#btn-add-ind", appRoot)?.addEventListener("click", () => {
    state.indForm = emptyIndicatorForm();
    renderIndicators();
    $("#form-new-ind", appRoot)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#btn-cancel-ind", appRoot)?.addEventListener("click", () => {
    state.indForm = null;
    renderIndicators();
  });

  $("#new-ind-escopo", appRoot)?.addEventListener("change", (e) => {
    state.indForm.escopoNivel = e.target.value;
    const resumo = $("#new-ind-escopo-resumo", appRoot);
    if (resumo) resumo.textContent = describeEscopoResumo(state.ref.hierarquia, e.target.value);
  });

  $("#form-new-ind", appRoot)?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const titulo = String(fd.get("titulo") || "").trim();
    const barPrimary = String(fd.get("barPrimary") || "").trim();
    const barSecondary = String(fd.get("barSecondary") || "").trim();
    const line = String(fd.get("line") || "").trim();
    const escopoNivel = String(fd.get("escopoNivel") || "VP");
    const metaRaw = fd.get("metaValue");

    if (!titulo) {
      showError("Informe o título do indicador.");
      return;
    }
    if (!barPrimary || !barSecondary || !line) {
      showError("Informe as três dimensões do gráfico (barra primária, secundária e linha).");
      return;
    }
    if (metaRaw === "" || metaRaw == null) {
      showError("Informe o valor da meta.");
      return;
    }

    let id = slugify(String(fd.get("id") || "") || line || titulo);
    if (!id) id = `indicador-${state.ref.indicators.length + 1}`;
    if (state.ref.indicators.some((i) => i.id === id)) {
      showError(`ID "${id}" já existe. Escolha outro slug.`);
      return;
    }

    state.ref.indicators.push({
      id,
      ordem: Number(fd.get("ordem")) || state.ref.indicators.length + 1,
      titulo,
      escopoNivel,
      meta: {
        value: Number(metaRaw),
        format: String(fd.get("metaFormat") || "percent"),
        trend: String(fd.get("metaTrend") || "down"),
      },
      labels: { barPrimary, barSecondary, line },
      valores: { consolidado: {}, gerencias: {} },
      analiseConsolidado: {
        tituloCurto: line || titulo,
        status: "below",
        statusLabel: "",
        paragrafos: [""],
      },
      analisesGerencia: {},
    });
    state.indForm = null;
    state.ref = normalizeRef(state.ref);
    markDirty();
    showError("");
    showToast("Indicador adicionado");
    renderIndicators();
  });

  $$("[data-remove-ind]", appRoot).forEach((btn) =>
    btn.addEventListener("click", () => {
      state.ref.indicators = state.ref.indicators.filter((i) => i.id !== btn.dataset.removeInd);
      markDirty();
      renderIndicators();
    })
  );

  $$("[data-ind]", appRoot).forEach((el) => {
    el.addEventListener("input", () => updateIndicatorField(el));
    el.addEventListener("change", () => updateIndicatorField(el));
  });
}

function updateIndicatorField(el) {
  const indId = el.dataset.ind;
  const field = el.dataset.field;
  const ind = state.ref.indicators.find((i) => i.id === indId);
  if (!ind) return;

  if (field === "id") {
    const newId = slugify(el.value) || indId;
    if (newId !== indId && !state.ref.indicators.some((i) => i.id === newId)) {
      ind.id = newId;
      el.dataset.ind = newId;
      el.closest("[data-ind]")?.setAttribute?.("data-ind", newId);
    }
  } else if (field === "ordem") {
    ind.ordem = Number(el.value) || 0;
  } else if (field === "titulo") {
    ind.titulo = el.value;
  } else if (field === "meta.value") {
    ind.meta = ind.meta || {};
    ind.meta.value = el.value === "" ? "" : Number(el.value);
  } else if (field === "meta.format") {
    ind.meta = ind.meta || {};
    ind.meta.format = el.value;
  } else if (field === "meta.trend") {
    ind.meta = ind.meta || {};
    ind.meta.trend = el.value;
  } else if (field === "escopoNivel") {
    ind.escopoNivel = el.value;
    state.ref = normalizeRef(state.ref);
    markDirty();
    renderIndicators();
    return;
  } else if (field.startsWith("labels.")) {
    const key = field.split(".")[1];
    ind.labels = ind.labels || {};
    ind.labels[key] = el.value;
  }
  markDirty();
}

function linesToArray(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ensureCurrentRefStructure() {
  if (!state.ref) return;
  state.ref = normalizeRef(state.ref);
}

function nodesForIndicator(ind) {
  return getNodesForEscopo(state.ref.hierarquia || [], ind?.escopoNivel || "VP");
}

function groupScopeNodesByNivel(nodes) {
  const groups = [];
  for (const nivel of NIVEIS) {
    const items = nodes.filter((n) => n.nivel === nivel);
    if (items.length) groups.push({ nivel, items });
  }
  return groups;
}

function renderScopeAreaTabs(nodes, activeId, consolidadoKey, consolidadoLabel) {
  const map = getNodeMap(state.ref.hierarquia);
  const groups = groupScopeNodesByNivel(nodes);
  let html = `<div class="bo-tabs">
    <button type="button" class="bo-tabs__btn ${activeId === consolidadoKey ? "is-active" : ""}" data-scope-tab="${consolidadoKey}">${esc(consolidadoLabel)}</button>
  </div>`;
  for (const group of groups) {
    html += `
      <div class="bo-scope-group">
        <div class="bo-scope-group__label">
          <span class="bo-hier-badge bo-hier-badge--${group.nivel.replace("-", "")}">${esc(group.nivel)}</span>
          <span>${esc(NIVEL_LABELS[group.nivel] || group.nivel)}</span>
        </div>
        <div class="bo-tabs">
          ${group.items
            .map((g) => {
              const path = getHierarchyPath(g.id, map);
              return `<button type="button" class="bo-tabs__btn ${activeId === g.id ? "is-active" : ""}" data-scope-tab="${g.id}" title="${esc(path)}">
                ${esc(g.nome)}
              </button>`;
            })
            .join("")}
        </div>
      </div>`;
  }
  return html;
}

function renderScopeContext(ind, activeId, nodes) {
  const escopo = ind.escopoNivel || "VP";
  const map = getNodeMap(state.ref.hierarquia);
  if (activeId === "consolidado" || activeId === "__consolidado__") {
    return `
      <div class="bo-scope-context">
        <strong>Consolidado</strong>
        <span>Escopo do indicador: ${esc(ESCOPO_LABELS[escopo])} · ${esc(describeEscopoResumo(state.ref.hierarquia, escopo))}</span>
      </div>`;
  }
  const node = nodes.find((n) => n.id === activeId);
  if (!node) return "";
  return `
    <div class="bo-scope-context">
      <span class="bo-hier-badge bo-hier-badge--${node.nivel.replace("-", "")}">${esc(node.nivel)}</span>
      <strong>${esc(node.nome)}</strong>
      <span>${esc(getHierarchyPath(node.id, map))}</span>
    </div>`;
}

function renderValores() {
  ensureCurrentRefStructure();
  const indicators = [...(state.ref.indicators || [])].sort((a, b) => a.ordem - b.ordem);
  if (!indicators.length) {
    appRoot.innerHTML = `<div class="bo-panel"><p class="bo-empty">Cadastre indicadores primeiro.</p></div>`;
    return;
  }
  if (!(state.ref.hierarquia || []).length) {
    appRoot.innerHTML = `<div class="bo-panel"><p class="bo-empty">Cadastre a hierarquia antes de informar valores.</p></div>`;
    return;
  }

  let activeInd = indicators[0].id;
  let activeScope = "consolidado";

  function seriesTarget(ind, scope, areaId) {
    if (scope === "consolidado") {
      ind.valores.consolidado = ind.valores.consolidado || {};
      for (const key of ["barPrimary", "barSecondary", "line"]) {
        if (!Array.isArray(ind.valores.consolidado[key])) ind.valores.consolidado[key] = [];
      }
      return ind.valores.consolidado;
    }
    ind.valores.gerencias = ind.valores.gerencias || {};
    const meses = state.ref.config.mesesSerie || [];
    if (!ind.valores.gerencias[areaId]) {
      ind.valores.gerencias[areaId] = {
        barPrimary: meses.map(() => 0),
        barSecondary: meses.map(() => 0),
        line: meses.map(() => 0),
      };
    }
    const bucket = ind.valores.gerencias[areaId];
    for (const key of ["barPrimary", "barSecondary", "line"]) {
      if (!Array.isArray(bucket[key]) || bucket[key].length !== meses.length) {
        bucket[key] = meses.map((_, i) => bucket[key]?.[i] ?? 0);
      }
    }
    return bucket;
  }

  function buildGrid(ind, scope, areaId) {
    const meses = state.ref.config.mesesSerie || [];
    const target = seriesTarget(ind, scope, areaId);
    const rows = [
      { key: "barPrimary", label: ind.labels?.barPrimary || "Barra primária" },
      { key: "barSecondary", label: ind.labels?.barSecondary || "Barra secundária" },
      { key: "line", label: ind.labels?.line || "Linha" },
    ];
    const head = meses.map((m) => `<th>${esc(m)}</th>`).join("");
    const body = rows
      .map(
        (row) => `
      <tr>
        <th>${esc(row.label)}</th>
        ${meses
          .map(
            (_, mi) => `
          <td><input type="number" step="any"
            data-ind="${ind.id}" data-scope="${scope}" data-area="${areaId || ""}"
            data-key="${row.key}" data-idx="${mi}"
            value="${target[row.key][mi] ?? 0}"></td>`
          )
          .join("")}
      </tr>`
      )
      .join("");
    return `<div class="bo-grid-values"><table><thead><tr><th>Série</th>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function render() {
    const ind = indicators.find((i) => i.id === activeInd) || state.ref.indicators.find((i) => i.id === activeInd);
    if (!ind) return;
    ensureIndicatorStructure(ind, state.ref.config.mesesSerie || [], state.ref.hierarquia);
    const scopeNodes = nodesForIndicator(ind);
    if (activeScope !== "consolidado" && !scopeNodes.some((n) => n.id === activeScope)) {
      activeScope = "consolidado";
    }

    const indTabs = indicators
      .map(
        (i) =>
          `<button type="button" class="bo-tabs__btn ${i.id === activeInd ? "is-active" : ""}" data-ind-tab="${i.id}">
            ${esc((i.id || "").toUpperCase())}
            <span class="bo-hier-badge bo-hier-badge--${(i.escopoNivel || "VP").replace("-", "")}">${esc(i.escopoNivel || "VP")}</span>
          </button>`
      )
      .join("");

    const canEdit =
      activeScope === "consolidado" || scopeNodes.some((n) => n.id === activeScope);

    appRoot.innerHTML = `
      <div class="bo-panel">
        <h2>Valores mensais</h2>
        <p class="bo-help">
          As abas de área seguem o <strong>escopo do indicador</strong> e a <strong>hierarquia</strong> cadastrada.
          Consolidado sempre aparece; demais áreas respeitam “aplicar até o nível”.
        </p>
        <div class="bo-tabs">${indTabs}</div>
        ${renderScopeAreaTabs(scopeNodes, activeScope, "consolidado", "Consolidado")}
        ${renderScopeContext(ind, activeScope, scopeNodes)}
        ${
          !scopeNodes.length
            ? `<p class="bo-empty">Nenhuma área no escopo <strong>${esc(ind.escopoNivel || "VP")}</strong>. Amplie o escopo do indicador ou complete a hierarquia.</p>`
            : ""
        }
        ${
          canEdit
            ? buildGrid(ind, activeScope === "consolidado" ? "consolidado" : "area", activeScope === "consolidado" ? null : activeScope)
            : '<p class="bo-empty">Selecione uma área no escopo deste indicador.</p>'
        }
      </div>`;

    $$("[data-ind-tab]", appRoot).forEach((btn) =>
      btn.addEventListener("click", () => {
        activeInd = btn.dataset.indTab;
        activeScope = "consolidado";
        render();
      })
    );
    $$("[data-scope-tab]", appRoot).forEach((btn) =>
      btn.addEventListener("click", () => {
        activeScope = btn.dataset.scopeTab;
        render();
      })
    );
    $$("input[data-key]", appRoot).forEach((input) => {
      input.addEventListener("input", () => {
        const ind2 = state.ref.indicators.find((i) => i.id === input.dataset.ind);
        if (!ind2) return;
        const key = input.dataset.key;
        const idx = Number(input.dataset.idx);
        const val = input.value === "" ? 0 : Number(input.value);
        const target = seriesTarget(
          ind2,
          input.dataset.scope === "consolidado" ? "consolidado" : "area",
          input.dataset.area || null
        );
        target[key][idx] = val;
        markDirty();
      });
    });
  }

  render();
}

function renderAnalises() {
  ensureCurrentRefStructure();
  const indicators = [...(state.ref.indicators || [])].sort((a, b) => a.ordem - b.ordem);
  if (!indicators.length) {
    appRoot.innerHTML = `<div class="bo-panel"><p class="bo-empty">Cadastre indicadores primeiro.</p></div>`;
    return;
  }
  if (!(state.ref.hierarquia || []).length) {
    appRoot.innerHTML = `<div class="bo-panel"><p class="bo-empty">Cadastre a hierarquia antes de informar análises.</p></div>`;
    return;
  }

  let activeInd = indicators[0].id;
  let activeArea = "__consolidado__";

  function render() {
    const ind = state.ref.indicators.find((i) => i.id === activeInd);
    if (!ind) return;
    ensureIndicatorStructure(ind, state.ref.config.mesesSerie || [], state.ref.hierarquia);
    const scopeNodes = nodesForIndicator(ind);
    if (activeArea !== "__consolidado__" && !scopeNodes.some((n) => n.id === activeArea)) {
      activeArea = "__consolidado__";
    }

    const indTabs = indicators
      .map(
        (i) =>
          `<button type="button" class="bo-tabs__btn ${i.id === activeInd ? "is-active" : ""}" data-ind-tab="${i.id}">
            ${esc((i.id || "").toUpperCase())}
            <span class="bo-hier-badge bo-hier-badge--${(i.escopoNivel || "VP").replace("-", "")}">${esc(i.escopoNivel || "VP")}</span>
          </button>`
      )
      .join("");

    let formHtml = "";
    if (activeArea === "__consolidado__") {
      const ac = ind.analiseConsolidado || {
        tituloCurto: "",
        status: "below",
        statusLabel: "",
        paragrafos: [],
      };
      ind.analiseConsolidado = ac;
      formHtml = `
        <div class="bo-form bo-form--grid">
          <label>Título curto<input id="ac-titulo" value="${esc(ac.tituloCurto)}"></label>
          <label>Status
            <select id="ac-status">
              <option value="above" ${ac.status === "above" ? "selected" : ""}>Acima / dentro</option>
              <option value="below" ${ac.status === "below" ? "selected" : ""}>Abaixo</option>
            </select>
          </label>
          <label class="bo-form__actions--full">Rótulo do status<input id="ac-statusLabel" value="${esc(ac.statusLabel)}"></label>
          <label class="bo-form__actions--full">Parágrafos (um por linha)
            <textarea id="ac-paragrafos" rows="6">${esc((ac.paragrafos || []).join("\n"))}</textarea>
          </label>
        </div>`;
    } else {
      const node = scopeNodes.find((n) => n.id === activeArea);
      ind.analisesGerencia = ind.analisesGerencia || {};
      const an = ind.analisesGerencia[activeArea] || {
        status: "below",
        statusLabel: "",
        positivos: [],
        negativos: [],
      };
      ind.analisesGerencia[activeArea] = an;
      formHtml = `
        <div class="bo-form bo-form--grid">
          <p class="bo-form__actions--full bo-hier-hint">Análise da área <strong>${esc(node?.nome || activeArea)}</strong> (${esc(node?.nivel || "")}).</p>
          <label>Status
            <select id="ag-status">
              <option value="above" ${an.status === "above" ? "selected" : ""}>Acima / dentro</option>
              <option value="below" ${an.status === "below" ? "selected" : ""}>Abaixo</option>
            </select>
          </label>
          <label class="bo-form__actions--full">Rótulo do status<input id="ag-statusLabel" value="${esc(an.statusLabel)}"></label>
          <label class="bo-form__actions--full">Pontos positivos (um por linha)
            <textarea id="ag-positivos" rows="4">${esc((an.positivos || []).join("\n"))}</textarea>
          </label>
          <label class="bo-form__actions--full">Pontos negativos (um por linha)
            <textarea id="ag-negativos" rows="4">${esc((an.negativos || []).join("\n"))}</textarea>
          </label>
        </div>`;
    }

    appRoot.innerHTML = `
      <div class="bo-panel">
        <h2>Análises qualitativas</h2>
        <p class="bo-help">
          Mesmas regras das Valores: consolidado sempre disponível; áreas filtradas pelo escopo do indicador e pela hierarquia.
        </p>
        <div class="bo-tabs">${indTabs}</div>
        ${renderScopeAreaTabs(scopeNodes, activeArea, "__consolidado__", "Consolidado (sidebar)")}
        ${renderScopeContext(ind, activeArea, scopeNodes)}
        ${
          !scopeNodes.length
            ? `<p class="bo-empty">Nenhuma área no escopo <strong>${esc(ind.escopoNivel || "VP")}</strong>. Amplie o escopo ou complete a hierarquia.</p>`
            : ""
        }
        ${formHtml}
      </div>`;

    $$("[data-ind-tab]", appRoot).forEach((btn) =>
      btn.addEventListener("click", () => {
        activeInd = btn.dataset.indTab;
        activeArea = "__consolidado__";
        render();
      })
    );
    $$("[data-scope-tab]", appRoot).forEach((btn) =>
      btn.addEventListener("click", () => {
        activeArea = btn.dataset.scopeTab;
        render();
      })
    );

    const bind = (sel, ev, fn) => $(sel, appRoot)?.addEventListener(ev, fn);
    if (activeArea === "__consolidado__") {
      bind("#ac-titulo", "input", (e) => {
        ind.analiseConsolidado.tituloCurto = e.target.value;
        markDirty();
      });
      bind("#ac-status", "change", (e) => {
        ind.analiseConsolidado.status = e.target.value;
        markDirty();
      });
      bind("#ac-statusLabel", "input", (e) => {
        ind.analiseConsolidado.statusLabel = e.target.value;
        markDirty();
      });
      bind("#ac-paragrafos", "input", (e) => {
        ind.analiseConsolidado.paragrafos = linesToArray(e.target.value);
        markDirty();
      });
    } else {
      const an = ind.analisesGerencia[activeArea];
      bind("#ag-status", "change", (e) => {
        an.status = e.target.value;
        markDirty();
      });
      bind("#ag-statusLabel", "input", (e) => {
        an.statusLabel = e.target.value;
        markDirty();
      });
      bind("#ag-positivos", "input", (e) => {
        an.positivos = linesToArray(e.target.value);
        markDirty();
      });
      bind("#ag-negativos", "input", (e) => {
        an.negativos = linesToArray(e.target.value);
        markDirty();
      });
    }
  }

  render();
}

async function renderRevisao() {
  appRoot.innerHTML = `
    <div class="bo-panel">
      <h2>Revisão e publicação</h2>
      <p class="bo-help">Valide os dados cadastrados e gere o arquivo <code>indicators-data.js</code> da apresentação.</p>
      <div class="bo-form__actions">
        <button type="button" class="bo-btn bo-btn--primary" id="btn-validate">Validar</button>
        <button type="button" class="bo-btn bo-btn--primary" id="btn-publish">Publicar apresentação</button>
        <a class="bo-btn" id="link-preview" href="/presentations/${esc(state.ref.config.presentationSlug)}/index.html" target="_blank" rel="noopener">Abrir preview</a>
      </div>
      <div id="validation-result" class="bo-subsection"></div>
    </div>
    <div class="bo-panel bo-panel--muted">
      <h3>Resumo</h3>
      <ul>
        <li><strong>Diretoria:</strong> ${esc(state.ref.config.diretoria)}</li>
        <li><strong>Área responsável:</strong> ${esc(state.ref.config.areaResponsavel)}</li>
        <li><strong>Área hierarquia:</strong> ${esc(state.ref.config.areaHierarquia || "—")}</li>
        <li><strong>Hierarquia:</strong> ${state.ref.hierarquia.length} nós (${getChartNodes(state.ref.hierarquia).length} no VP-4 / gráficos)</li>
        <li><strong>Indicadores:</strong> ${state.ref.indicators.map((i) => `${i.id} (${i.escopoNivel || "VP"})`).join(", ")}</li>
        <li><strong>Meses:</strong> ${(state.ref.config.mesesSerie || []).join(", ")}</li>
      </ul>
    </div>`;

  $("#btn-validate", appRoot).addEventListener("click", async () => {
    if (state.dirty) await saveRef(false);
    const result = await api.validate(state.ref.id);
    const box = $("#validation-result", appRoot);
    if (result.ok) {
      box.innerHTML = `<p style="color:var(--bo-success)">✓ Validação OK — pronto para publicar.</p>`;
    } else {
      box.innerHTML = `<div class="bo-alert bo-alert--error"><strong>Corrija antes de publicar:</strong><ul>${result.errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`;
    }
  });

  $("#btn-publish", appRoot).addEventListener("click", async () => {
    try {
      if (state.dirty) await saveRef(false);
      const result = await api.publish(state.ref.id);
      showToast("Apresentação publicada");
      state.ref.status = "published";
      const box = $("#validation-result", appRoot);
      box.innerHTML = `<p style="color:var(--bo-success)">Publicado em <code>${esc(result.presentationPath)}</code>. <a href="${esc(result.previewUrl)}" target="_blank">Abrir apresentação</a></p>`;
    } catch (err) {
      showError(err.message);
    }
  });
}

function renderStep() {
  showError("");
  switch (state.step) {
    case "config":
      renderConfig();
      break;
    case "hierarquia":
      renderHierarquia();
      break;
    case "indicators":
      renderIndicators();
      break;
    case "valores":
      renderValores();
      break;
    case "analises":
      renderAnalises();
      break;
    case "revisao":
      renderRevisao();
      break;
    case "usuarios":
      renderUsuarios();
      break;
    case "auditoria":
      renderAuditoria();
      break;
    default:
      goHome();
  }
  renderTopbarActions();
}

async function renderUsuarios() {
  const users = await usersApi.list();
  appRoot.innerHTML = `
    <div class="bo-panel">
      <div class="bo-panel__header">
        <h2>Usuários do sistema</h2>
        <button type="button" class="bo-btn bo-btn--primary" id="btn-new-user">Novo usuário</button>
      </div>
      <div class="bo-table-wrap">
        <table class="bo-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Criado</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="users-tbody"></tbody>
        </table>
      </div>
    </div>
    <div class="bo-panel bo-panel--muted" id="user-form-panel" hidden>
      <h3 id="user-form-title">Novo usuário</h3>
      <form class="bo-form bo-form--grid" id="form-user">
        <input type="hidden" name="userId" value="">
        <label>Nome completo<input name="nome" required placeholder="Maria Silva"></label>
        <label>Usuário (login)<input name="username" required pattern="[a-z0-9._-]+" placeholder="maria.silva"></label>
        <label>Senha<input name="password" type="password" minlength="6" placeholder="Mínimo 6 caracteres"></label>
        <label>Perfil
          <select name="role" required>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <label class="bo-form__actions--full" id="user-ativo-wrap" hidden>
          <input type="checkbox" name="ativo" checked> Conta ativa
        </label>
        <div class="bo-form__actions bo-form__actions--full">
          <button type="submit" class="bo-btn bo-btn--primary">Salvar</button>
          <button type="button" class="bo-btn bo-btn--ghost" id="btn-cancel-user">Cancelar</button>
        </div>
      </form>
    </div>`;

  const tbody = $("#users-tbody", appRoot);
  tbody.innerHTML = users.length
    ? users
        .map(
          (u) => `
      <tr>
        <td><code>${esc(u.username)}</code></td>
        <td>${esc(u.nome)}</td>
        <td>${u.role === "admin" ? "Administrador" : "Usuário"}</td>
        <td><span class="bo-badge bo-badge--${u.ativo ? "published" : "draft"}">${u.ativo ? "Ativo" : "Inativo"}</span></td>
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleString("pt-BR") : "—"}</td>
        <td class="bo-inline-actions">
          <button type="button" class="bo-btn bo-btn--sm" data-edit-user="${esc(u.id)}">Editar</button>
          ${u.id !== state.currentUser?.id ? `<button type="button" class="bo-btn bo-btn--sm bo-btn--danger" data-del-user="${esc(u.id)}">Excluir</button>` : ""}
        </td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="6" class="bo-empty">Nenhum usuário cadastrado</td></tr>`;

  const formPanel = $("#user-form-panel", appRoot);
  const form = $("#form-user", appRoot);
  const ativoWrap = $("#user-ativo-wrap", appRoot);

  function openCreateForm() {
    form.reset();
    form.userId.value = "";
    form.username.disabled = false;
    form.password.required = true;
    ativoWrap.hidden = true;
    $("#user-form-title", appRoot).textContent = "Novo usuário";
    formPanel.hidden = false;
  }

  function openEditForm(user) {
    form.userId.value = user.id;
    form.nome.value = user.nome;
    form.username.value = user.username;
    form.username.disabled = true;
    form.password.value = "";
    form.password.required = false;
    form.role.value = user.role;
    form.ativo.checked = user.ativo !== false;
    ativoWrap.hidden = false;
    $("#user-form-title", appRoot).textContent = `Editar — ${user.username}`;
    formPanel.hidden = false;
  }

  $("#btn-new-user", appRoot).addEventListener("click", openCreateForm);
  $("#btn-cancel-user", appRoot).addEventListener("click", () => {
    formPanel.hidden = true;
  });

  $$("[data-edit-user]", appRoot).forEach((btn) => {
    btn.addEventListener("click", () => {
      const user = users.find((u) => u.id === btn.dataset.editUser);
      if (user) openEditForm(user);
    });
  });

  $$("[data-del-user]", appRoot).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const user = users.find((u) => u.id === btn.dataset.delUser);
      if (!user || !confirm(`Excluir usuário "${user.username}"?`)) return;
      try {
        await usersApi.delete(user.id);
        showToast("Usuário excluído");
        await renderUsuarios();
      } catch (err) {
        showError(err.message);
      }
    });
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const userId = fd.get("userId");
    const body = {
      nome: fd.get("nome"),
      username: fd.get("username"),
      role: fd.get("role"),
    };
    const password = fd.get("password");
    if (password) body.password = password;
    if (userId) body.ativo = fd.get("ativo") === "on";

    try {
      if (userId) {
        await usersApi.update(userId, body);
        showToast("Usuário atualizado");
      } else {
        if (!password) {
          showError("Informe uma senha para o novo usuário.");
          return;
        }
        await usersApi.create(body);
        showToast("Usuário criado");
      }
      formPanel.hidden = true;
      await renderUsuarios();
    } catch (err) {
      showError(err.message);
    }
  });
}

async function renderAuditoria() {
  const entries = await auditApi.list(200);
  appRoot.innerHTML = `
    <div class="bo-panel">
      <h2>Log de auditoria</h2>
      <p class="bo-help">Registro das últimas ações realizadas no backoffice (login, salvamentos, publicações, gestão de usuários).</p>
      <div class="bo-table-wrap">
        <table class="bo-table">
          <thead>
            <tr>
              <th>Data/hora</th>
              <th>Usuário</th>
              <th>Perfil</th>
              <th>Ação</th>
              <th>Detalhe</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            ${
              entries.length
                ? entries
                    .map(
                      (e) => `
              <tr>
                <td>${e.ts ? new Date(e.ts).toLocaleString("pt-BR") : "—"}</td>
                <td>${esc(e.username || "—")}</td>
                <td>${e.role === "admin" ? "Admin" : e.role === "user" ? "Usuário" : "—"}</td>
                <td><code>${esc(e.action)}</code></td>
                <td>${esc(formatAuditDetail(e.detail))}</td>
                <td>${esc(e.ip || "—")}</td>
              </tr>`
                    )
                    .join("")
                : `<tr><td colspan="6" class="bo-empty">Nenhum registro ainda</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>`;
}

function formatAuditDetail(detail) {
  if (!detail || !Object.keys(detail).length) return "—";
  return Object.entries(detail)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

$("#btn-home").addEventListener("click", goHome);
$$(".bo-nav__item", mainNav).forEach((btn) =>
  btn.addEventListener("click", () => {
    if (state.step !== btn.dataset.step) goStep(btn.dataset.step);
  })
);
$$(".bo-nav__item", adminNav).forEach((btn) =>
  btn.addEventListener("click", () => {
    if (state.step !== btn.dataset.step) goAdminStep(btn.dataset.step);
  })
);

async function bootstrap() {
  const user = await requireAuth();
  if (!user) return;
  state.currentUser = user;
  updateSidebarUser(user);
  setAdminNavVisible(user.role === "admin");
  await renderHome();
}

bootstrap().catch((err) => showError(err.message));
