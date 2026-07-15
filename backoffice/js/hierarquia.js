/** Níveis hierárquicos Vale — "abaixo do vice-presidente". */

export const NIVEIS = ["VP", "VP-1", "VP-2", "VP-3", "VP-4"];

export const NIVEL_LABELS = {
  VP: "VP — Vice-Presidente",
  "VP-1": "VP-1 — ligado diretamente ao VP",
  "VP-2": "VP-2 — abaixo do VP-1",
  "VP-3": "VP-3 — abaixo do VP-2",
  "VP-4": "VP-4 — abaixo do VP-3 (operacional / gráficos)",
};

/** Rótulos do campo "aplicar até o nível" nos indicadores. */
export const ESCOPO_LABELS = {
  VP: "VP — preenchimento do VP até VP-4 (todos os níveis)",
  "VP-1": "VP-1 — VP-1, VP-2, VP-3 e VP-4",
  "VP-2": "VP-2 — VP-2, VP-3 e VP-4",
  "VP-3": "VP-3 — VP-3 e VP-4",
  "VP-4": "VP-4 — somente unidades operacionais",
};

export function parentNivelFor(nivel) {
  const idx = NIVEIS.indexOf(nivel);
  if (idx <= 0) return null;
  return NIVEIS[idx - 1];
}

export function migrateGerenciasToHierarquia(ref) {
  if (Array.isArray(ref.hierarquia) && ref.hierarquia.length) {
    delete ref.gerencias;
    return ref;
  }

  const c = ref.config || {};
  const gerencias = ref.gerencias || [];

  if (!gerencias.length) {
    ref.hierarquia = [];
    delete ref.gerencias;
    return ref;
  }

  ref.hierarquia = [
    { id: "vp", nome: "Vice-Presidente", nivel: "VP", parentId: null, ordem: 1 },
    {
      id: "vp1-diretoria",
      nome: "Diretoria (VP-1)",
      nivel: "VP-1",
      parentId: "vp",
      ordem: 1,
    },
    {
      id: "vp2-area",
      nome: c.diretoria || "Diretoria",
      nivel: "VP-2",
      parentId: "vp1-diretoria",
      ordem: 1,
    },
    {
      id: "vp3-unidade",
      nome: c.areaResponsavel || "Área responsável",
      nivel: "VP-3",
      parentId: "vp2-area",
      ordem: 1,
    },
    ...gerencias.map((g, i) => ({
      id: g.id,
      nome: g.nome,
      nivel: "VP-4",
      parentId: "vp3-unidade",
      ordem: g.ordem ?? i + 1,
    })),
  ];
  delete ref.gerencias;
  return ref;
}

/** Nós em que o indicador exige valores/análises (nível do escopo + todos abaixo). */
export function getNodesForEscopo(hierarquia, escopoNivel) {
  const escopo = escopoNivel || "VP";
  const escopoIdx = NIVEIS.indexOf(escopo);
  if (escopoIdx < 0) return [];
  return sortHierarquiaForDisplay(hierarquia).filter((h) => {
    const idx = NIVEIS.indexOf(h.nivel);
    return idx >= 0 && idx >= escopoIdx;
  });
}

export function describeEscopoResumo(hierarquia, escopoNivel) {
  const nodes = getNodesForEscopo(hierarquia, escopoNivel);
  if (!nodes.length) return "Nenhuma área no escopo";
  const niveis = [...new Set(nodes.map((n) => n.nivel))];
  return `${nodes.length} área(s): ${niveis.join(", ")}`;
}

/** Nós exibidos nos gráficos por unidade (VP-4; senão folhas da árvore). */
export function getChartNodes(hierarquia) {
  const list = hierarquia || [];
  const vp4 = list.filter((h) => h.nivel === "VP-4");
  if (vp4.length) {
    return [...vp4].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }
  const parentIds = new Set(list.map((h) => h.parentId).filter(Boolean));
  return list
    .filter((h) => !parentIds.has(h.id))
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

export function getNodeMap(hierarquia) {
  return Object.fromEntries((hierarquia || []).map((h) => [h.id, h]));
}

export function getParentOptions(hierarquia, nivel, excludeId = null) {
  const parentNivel = parentNivelFor(nivel);
  if (!parentNivel) return [];
  return (hierarquia || [])
    .filter((h) => h.nivel === parentNivel && h.id !== excludeId)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

/** Mantém o pai se ainda for válido; senão exige nova seleção. */
export function resolveParentForNivel(hierarquia, nivel, currentParentId, excludeId = null) {
  if (nivel === "VP") return null;
  const opts = getParentOptions(hierarquia, nivel, excludeId);
  if (currentParentId && opts.some((o) => o.id === currentParentId)) return currentParentId;
  return opts.length === 1 ? opts[0].id : null;
}

export function parentNivelLabel(nivel) {
  const p = parentNivelFor(nivel);
  return p ? NIVEL_LABELS[p] || p : null;
}

export function getHierarchyPath(nodeId, map) {
  const parts = [];
  let cur = map[nodeId];
  const guard = new Set();
  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    parts.unshift(cur.nome);
    cur = cur.parentId ? map[cur.parentId] : null;
  }
  return parts.join(" → ");
}

export function getDescendantIds(nodeId, hierarquia) {
  const out = new Set();
  const walk = (id) => {
    for (const h of hierarquia) {
      if (h.parentId === id && !out.has(h.id)) {
        out.add(h.id);
        walk(h.id);
      }
    }
  };
  walk(nodeId);
  return out;
}

export function validateHierarquia(hierarquia) {
  const errors = [];
  const list = hierarquia || [];
  if (!list.length) {
    errors.push("Cadastre ao menos um nó na hierarquia.");
    return errors;
  }

  const map = getNodeMap(list);
  const vpNodes = list.filter((h) => h.nivel === "VP");
  if (!vpNodes.length) {
    errors.push("Cadastre ao menos um nó VP (vice-presidente) — pode haver vários.");
  }

  for (const h of list) {
    if (!str(h.nome)) errors.push(`Hierarquia "${h.id || "?"}": informe o nome.`);
    if (!NIVEIS.includes(h.nivel)) {
      errors.push(`Hierarquia "${h.nome || h.id}": nível inválido.`);
      continue;
    }
    const expectedParent = parentNivelFor(h.nivel);
    if (!expectedParent) {
      if (h.parentId) errors.push(`"${h.nome}": VP não deve ter hierarquia acima.`);
      continue;
    }
    if (!h.parentId) {
      errors.push(`"${h.nome}" (${h.nivel}): selecione a hierarquia acima.`);
      continue;
    }
    const parent = map[h.parentId];
    if (!parent) {
      errors.push(`"${h.nome}": hierarquia acima não encontrada.`);
      continue;
    }
    if (parent.nivel !== expectedParent) {
      errors.push(
        `"${h.nome}" (${h.nivel}): deve estar ligado a um ${expectedParent}, não a ${parent.nivel} ("${parent.nome}").`
      );
    }
  }

  if (!getChartNodes(list).length) {
    errors.push("Cadastre ao menos um nó VP-4 (ou folha operacional) para os gráficos por unidade.");
  }

  return errors;
}

function str(v) {
  return String(v ?? "").trim();
}

export function sortHierarquiaForDisplay(hierarquia) {
  const map = getNodeMap(hierarquia);
  const depth = (id) => {
    let d = 0;
    let cur = map[id];
    const guard = new Set();
    while (cur?.parentId && !guard.has(cur.id)) {
      guard.add(cur.id);
      d += 1;
      cur = map[cur.parentId];
    }
    return d;
  };
  return [...(hierarquia || [])].sort((a, b) => {
    const da = depth(a.id);
    const db = depth(b.id);
    if (da !== db) return da - db;
    if (a.nivel !== b.nivel) return NIVEIS.indexOf(a.nivel) - NIVEIS.indexOf(b.nivel);
    return (a.ordem ?? 0) - (b.ordem ?? 0);
  });
}
