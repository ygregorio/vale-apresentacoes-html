/** Mapa interativo do Brasil — SVG @svg-maps/brazil, paleta Vale */

const MAP_SVG_URL = new URL("../assets/map-brazil.svg", import.meta.url);

const MAP_COLORS = {
  base: "#E6E7E8",
  tier1: "#9DE4D6",
  tier2: "#0ABB98",
  tier3: "#007E7A",
  tier4: "#034944",
  hover: "#3CB5E5",
  selected: "#007E7A",
  stroke: "#747678",
  textDark: "#333333",
  textLight: "#FFFFFF",
};

const TIER_COLORS = [MAP_COLORS.base, MAP_COLORS.tier1, MAP_COLORS.tier2, MAP_COLORS.tier3, MAP_COLORS.tier4];

const LABEL_FONT = {
  DF: 8.5,
  RJ: 10,
  ES: 10,
  SE: 9.5,
  AL: 9.5,
  PB: 9.5,
  RN: 9.5,
  SC: 11,
  PR: 11,
};

let statesData = null;
let selectedUf = null;

function hexToRgb(hex) {
  const value = parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function relativeLuminance(hex) {
  const channels = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastTextColor(fillHex) {
  return relativeLuminance(fillHex) > 0.52 ? MAP_COLORS.textDark : MAP_COLORS.textLight;
}

async function loadStatesData(slide) {
  const src = slide.dataset.mapData;
  if (!src) return {};
  if (statesData) return statesData;
  try {
    const res = await fetch(src);
    statesData = await res.json();
  } catch {
    statesData = window.VALE_MAP_DATA || {};
  }
  return statesData;
}

async function loadMapSvg(wrapper) {
  try {
    const res = await fetch(MAP_SVG_URL);
    return await res.text();
  } catch {
    return null;
  }
}

function getStateFill(uf, data, selected = selectedUf) {
  const info = data[uf];
  const tierColor = TIER_COLORS[info?.tier ?? 0];
  return selected === uf ? MAP_COLORS.selected : tierColor;
}

function labelFontSize(uf, bbox) {
  if (LABEL_FONT[uf]) return LABEL_FONT[uf];
  const area = bbox.width * bbox.height;
  return Math.max(10.5, Math.min(17, Math.sqrt(area) / 5.2));
}

function isInsidePath(path, svg, x, y) {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return path.isPointInFill(pt);
}

function interiorDepth(path, svg, x, y) {
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [0.707, 0.707], [-0.707, 0.707], [0.707, -0.707], [-0.707, -0.707],
  ];
  let min = Infinity;

  for (const [dx, dy] of dirs) {
    let dist = 0;
    while (dist < 240) {
      dist += 0.75;
      if (!isInsidePath(path, svg, x + dx * dist, y + dy * dist)) break;
    }
    min = Math.min(min, dist);
  }

  return min;
}

/** Ponto interior mais central do polígono (melhor que o centro do bbox). */
function getLabelPoint(path, svg) {
  const bbox = path.getBBox();
  const fallback = {
    x: bbox.x + bbox.width / 2,
    y: bbox.y + bbox.height / 2,
  };

  if (!svg || typeof path.isPointInFill !== "function") return fallback;

  const steps = Math.max(18, Math.min(44, Math.round(Math.max(bbox.width, bbox.height) / 3.5)));
  let best = { ...fallback, d: -1 };

  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const x = bbox.x + (bbox.width * i) / steps;
      const y = bbox.y + (bbox.height * j) / steps;
      if (!isInsidePath(path, svg, x, y)) continue;

      const depth = interiorDepth(path, svg, x, y);
      const cx = fallback.x;
      const cy = fallback.y;
      const score = depth - Math.hypot(x - cx, y - cy) * 0.08;

      if (score > best.d) {
        best = { x, y, d: score };
      }
    }
  }

  return { x: best.x, y: best.y };
}

function updateStateLabel(svg, uf, fillHex) {
  const label = svg.querySelector(`[data-map-label="${uf}"]`);
  if (label) label.setAttribute("fill", contrastTextColor(fillHex));
}

function paintState(path, svg, uf, data, selected) {
  const fill = getStateFill(uf, data, selected);

  path.setAttribute("fill", fill);
  path.setAttribute("stroke", MAP_COLORS.stroke);
  path.setAttribute("stroke-width", "0.8");
  path.style.cursor = "pointer";
  updateStateLabel(svg, uf, fill);
}

function buildStateLabels(svg) {
  let layer = svg.querySelector("#map-labels");
  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.setAttribute("id", "map-labels");
    layer.setAttribute("class", "map-brazil__labels");
    svg.appendChild(layer);
  }

  svg.querySelectorAll("path[id]").forEach((path) => {
    const uf = path.id.toUpperCase();
    const bbox = path.getBBox();
    const anchor = getLabelPoint(path, svg);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", String(anchor.x));
    text.setAttribute("y", String(anchor.y));
    text.setAttribute("data-map-label", uf);
    text.setAttribute("font-size", String(labelFontSize(uf, bbox)));
    text.textContent = uf;
    layer.appendChild(text);
  });
}

function applyChoropleth(svg, data, selected = selectedUf) {
  svg.querySelectorAll("path[id]").forEach((path) => {
    const uf = path.id.toUpperCase();
    paintState(path, svg, uf, data, selected);
  });
}

function selectState(svg, uf, data) {
  selectedUf = uf.toUpperCase();
  applyChoropleth(svg, data, selectedUf);
}

function updateDetailPanel(slide, uf, data) {
  const info = data[uf];
  const panel = slide.querySelector(".map-brazil__detail");
  if (!panel || !info) return;

  panel.querySelector("[data-map-field='uf']").textContent = uf;
  panel.querySelector("[data-map-field='nome']").textContent = info.nome;
  panel.querySelector("[data-map-field='regiao']").textContent = info.regiao;
  panel.querySelector("[data-map-field='operacoes']").textContent = info.operacoes;
  panel.querySelector("[data-map-field='empregados']").textContent = info.empregados.toLocaleString("pt-BR");
  panel.querySelector("[data-map-field='producao']").textContent = info.producao;
  panel.classList.add("is-visible");
}

function bindStateEvents(slide, svg, data) {
  svg.querySelectorAll("path[id]").forEach((path) => {
    const uf = path.id.toUpperCase();
    const name = path.getAttribute("name") || uf;
    path.setAttribute("role", "button");
    path.setAttribute("aria-label", `${name} (${uf})`);

    path.addEventListener("click", (event) => {
      event.currentTarget.blur?.();
      selectState(svg, uf, data);
      updateDetailPanel(slide, uf, data);
    });

    path.addEventListener("mouseenter", () => {
      if (selectedUf !== uf) {
        path.setAttribute("fill", MAP_COLORS.hover);
        updateStateLabel(svg, uf, MAP_COLORS.hover);
      }
      const hint = slide.querySelector("[data-map-field='hint']");
      if (hint) hint.textContent = `${uf} — ${name}`;
    });

    path.addEventListener("mouseleave", () => {
      paintState(path, svg, uf, data, selectedUf);
    });
  });
}

export async function initMaps(slide) {
  const wrapper = slide.querySelector(".map-brazil__canvas");
  if (!wrapper || wrapper.dataset.initialized) return;

  const svgMarkup = await loadMapSvg(wrapper);
  if (!svgMarkup) {
    console.warn("SVG do mapa não carregado.");
    return;
  }

  wrapper.innerHTML = svgMarkup;
  const svg = wrapper.querySelector("svg");
  if (!svg) return;

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.classList.add("map-brazil__svg");
  svg.setAttribute("aria-label", "Mapa interativo do Brasil por estado");

  buildStateLabels(svg);

  const data = await loadStatesData(slide);
  bindStateEvents(slide, svg, data);

  const firstUf = (slide.dataset.mapDefaultUf || "MG").toUpperCase();
  if (data[firstUf]) {
    selectState(svg, firstUf, data);
    updateDetailPanel(slide, firstUf, data);
  } else {
    applyChoropleth(svg, data);
  }

  wrapper.dataset.initialized = "true";
}
