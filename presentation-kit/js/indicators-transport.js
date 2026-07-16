/**
 * Gráficos combo (barras lado a lado + linha) para indicadores de transporte.
 * Rótulos por painel, posicionamento anti-sobreposição.
 */

let chartLibLoaded = false;
let pluginsLoaded = false;

async function loadChartJs() {
  if (chartLibLoaded && window.Chart) return window.Chart;

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  chartLibLoaded = true;
  return window.Chart;
}

async function loadChartPlugins() {
  const Chart = await loadChartJs();
  if (pluginsLoaded) return Chart;

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  if (window.ChartDataLabels) {
    Chart.register(window.ChartDataLabels);
  }

  pluginsLoaded = true;
  return Chart;
}

function fmtNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function fmtPercent(value, digits = 2) {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

function fmtRate(value, digits = 2) {
  const frac = String(value).split(".")[1];
  const d = frac ? frac.length : digits;
  return value.toFixed(d).replace(".", ",");
}

function fmtIndicatorLine(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Math.round(value));
}

function fmtLineTaxa(value) {
  if (value >= 100) return fmtIndicatorLine(value);
  if (Number.isInteger(value)) return fmtNumber(value);
  return fmtRate(value);
}

function getIndicatorMeta(indicatorId) {
  return window.VALE_INDICATORS?.indicators?.[indicatorId]?.meta ?? null;
}

const META_LABEL_GOOD = { bg: "#e6f4ea", color: "#034944" };
const META_LABEL_BAD = { bg: "#fde8ea", color: "#991310" };

/** Aderência à meta: acima ou igual = verde; abaixo = vermelho (PTL e OVBK). */
function lineLabelMeetsMeta(indicatorId, lineValue) {
  const meta = getIndicatorMeta(indicatorId);
  if (!meta) return true;
  const trend = meta.trend || "up";
  if (meta.format === "percent") {
    return lineValue >= meta.value;
  }
  if (trend === "up") {
    return lineValue >= meta.value;
  }
  return lineValue <= meta.value;
}

function aggregateVp2Series(indicatorId, vp2Id) {
  const indicator = window.VALE_INDICATORS?.indicators?.[indicatorId];
  const cached = indicator?.vp2Series?.[vp2Id];
  if (cached) {
    return {
      ...cached,
      labels: window.VALE_INDICATORS.meta.meses,
    };
  }

  const children = indicator?.gerencias?.filter((g) => g.parentId === vp2Id) ?? [];
  if (!children.length) return null;

  const len = children[0].series.barPrimary.length;
  const barPrimary = [];
  const barSecondary = [];
  const line = [];
  const meta = indicator.meta;

  for (let i = 0; i < len; i += 1) {
    let sumPrimary = 0;
    let sumSecondary = 0;
    for (const child of children) {
      sumPrimary += child.series.barPrimary[i] ?? 0;
      sumSecondary += child.series.barSecondary[i] ?? 0;
    }
    barPrimary.push(sumPrimary);
    barSecondary.push(sumSecondary);
    if (meta?.format === "percent") {
      line.push(sumPrimary ? (sumSecondary / sumPrimary) * 100 : 0);
    } else {
      line.push(sumSecondary ? (sumPrimary / sumSecondary) * 100 : 0);
    }
  }

  const first = children[0].series;
  return {
    barPrimaryLabel: first.barPrimaryLabel,
    barSecondaryLabel: first.barSecondaryLabel,
    lineLabel: first.lineLabel,
    barPrimary,
    barSecondary,
    line,
    labels: window.VALE_INDICATORS.meta.meses,
  };
}

function lineValueFormatter(indicatorId, compact) {
  const meta = getIndicatorMeta(indicatorId);
  if (meta?.format === "percent") {
    return (v) => fmtPercent(v, compact ? 1 : 2);
  }
  if (meta?.format === "number") {
    return (v) => fmtIndicatorLine(v);
  }
  return (v) => fmtLineTaxa(v);
}

function lineValueTooltip(indicatorId, label, value) {
  const meta = getIndicatorMeta(indicatorId);
  if (meta?.format === "percent") {
    return `${label}: ${fmtPercent(value)}`;
  }
  if (meta?.format === "number") {
    return `${label}: ${fmtIndicatorLine(value)}`;
  }
  return `${label}: ${fmtLineTaxa(value)}`;
}

function panelShowsLabels(panel) {
  return panel.dataset.showLabels !== "false";
}

const DATA_LABEL_COLOR = "#555555";
const DATA_LABEL_BG = "#E6E7E8";

function dataLabelFontSize(compact) {
  return compact ? 12 : 14;
}

function dataLabelBadgeStyle(compact) {
  return {
    color: DATA_LABEL_COLOR,
    backgroundColor: DATA_LABEL_BG,
    borderRadius: 4,
    padding: { top: 4, bottom: 4, left: 6, right: 6 },
    font: {
      size: dataLabelFontSize(compact),
      weight: "700",
      family: '"Vale Sans", sans-serif',
    },
  };
}

function labelBadgeHeight(compact) {
  return dataLabelFontSize(compact) + 12;
}

function barValuesAt(chart, dataIndex) {
  const bars = chart.data.datasets.filter((d) => d.type === "bar");
  const primary = Number(bars[0]?.data[dataIndex] ?? 0);
  const secondary = Number(bars[1]?.data[dataIndex] ?? 0);
  return { primary, secondary, max: Math.max(primary, secondary) };
}

const LINE_ABOVE_BAR_GAP = 10;
const BAR_ABOVE_MONTH_GAP = 22;
const BAR_LABEL_AXIS_CLEARANCE = 8;
const BAR_ZONE_OFFSET_RATIO = 0.2;
const PRIMARY_LABEL_RATIO_BALANCED = 0.12;
const PRIMARY_LABEL_RATIO_IMBALANCED = 0.15;
const BAR_IMBALANCE_RATIO = 0.45;

function barsAreImbalanced(chart, dataIndex) {
  const { primary, secondary, max } = barValuesAt(chart, dataIndex);
  if (max <= 0) return false;
  return Math.min(primary, secondary) / max < BAR_IMBALANCE_RATIO;
}

function barTopPixelY(chart, value) {
  return chart.scales.yCount.getPixelForValue(Number(value) || 0);
}

function tallestBarTopY(chart, dataIndex) {
  const { max } = barValuesAt(chart, dataIndex);
  return barTopPixelY(chart, max);
}

/** Menor Y na tela = faixa mais alta ocupada por rótulos de barra */
function barLabelsBandTopY(chart, dataIndex, compact) {
  const badgeH = labelBadgeHeight(compact);
  let topY = tallestBarTopY(chart, dataIndex);

  if (!barsAreImbalanced(chart, dataIndex)) {
    topY -= badgeH + 6;
    return topY;
  }

  if (compact) {
    const secondary = secondaryBarElement(chart, dataIndex);
    if (secondary && barsAreImbalanced(chart, dataIndex)) {
      topY = Math.min(topY, secondary.y - badgeH - 6);
    }
    return topY;
  }

  if (barsAreImbalanced(chart, dataIndex)) {
    topY -= badgeH + 4;
  }

  return topY;
}

function getBarElement(chart, datasetIndex, dataIndex) {
  return chart.getDatasetMeta(datasetIndex)?.data?.[dataIndex] ?? null;
}

function monthLabelBandHeight(compact) {
  const fontSize = compact ? 10 : 11;
  const tickPadding = compact ? 8 : 16;
  return fontSize + tickPadding + BAR_LABEL_AXIS_CLEARANCE;
}

/** Garante rótulo de barra acima da faixa dos meses no eixo X. */
function safeBarLabelOffset(chart, bar, compact, baseGap = BAR_ABOVE_MONTH_GAP) {
  if (!chart?.chartArea || !bar) return baseGap;
  const badgeH = labelBadgeHeight(compact);
  const safeBottomY = chart.chartArea.bottom - monthLabelBandHeight(compact);
  const needed = bar.y - safeBottomY + badgeH + 6;
  return Math.max(baseGap, needed);
}

function barTooShortForInside(bar, compact) {
  return !bar?.height || bar.height < labelBadgeHeight(compact) + 8;
}

function secondaryBarElement(chart, dataIndex) {
  const barDatasets = chart.data.datasets
    .map((dataset, index) => ({ dataset, index }))
    .filter(({ dataset }) => dataset.type === "bar");
  if (barDatasets.length < 2) return null;
  return getBarElement(chart, barDatasets[1].index, dataIndex);
}

function isPercentIndicator(indicatorId) {
  return getIndicatorMeta(indicatorId)?.format === "percent";
}

function percentLabelLayout(chart, compact) {
  const badgeH = labelBadgeHeight(compact);
  const top = (chart.chartArea?.top ?? 0) + 4;
  return {
    badgeH,
    lineTop: top,
    dimensionTop: top + badgeH + 6,
  };
}

function percentBarLabelOffset(chart, dataIndex, compact) {
  const layout = percentLabelLayout(chart, compact);
  const tallestTop = tallestBarTopY(chart, dataIndex);
  return Math.max(tallestTop - layout.dimensionTop, 4);
}

function buildPrimaryBarDataLabels(panel, compact, formatter, indicatorId) {
  const badgeH = labelBadgeHeight(compact);
  const percentMode = isPercentIndicator(indicatorId);

  return {
    clip: false,
    ...dataLabelBadgeStyle(compact),
    formatter,
    textAlign: "center",
    display(ctx) {
      if (!panelShowsLabels(panel)) return false;
      return ctx.dataset.data[ctx.dataIndex] != null;
    },
    anchor(ctx) {
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      const bar = getBarElement(chart, ctx.datasetIndex, idx);
      if (percentMode) return "end";
      if (barTooShortForInside(bar, compact)) return "end";
      if (!barsAreImbalanced(chart, idx)) return "end";
      return "center";
    },
    align(ctx) {
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      const bar = getBarElement(chart, ctx.datasetIndex, idx);
      if (percentMode) return "top";
      if (barTooShortForInside(bar, compact)) return "top";

      if (!barsAreImbalanced(chart, idx)) {
        return "top";
      }

      if (barsAreImbalanced(chart, idx)) {
        return compact ? "bottom" : "top";
      }
      return "top";
    },
    offset(ctx) {
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      const bar = getBarElement(chart, ctx.datasetIndex, idx);
      if (!bar?.height) return 4;

      if (percentMode) {
        return percentBarLabelOffset(chart, idx, compact);
      }

      if (!barsAreImbalanced(chart, idx)) {
        return safeBarLabelOffset(chart, bar, compact, BAR_ABOVE_MONTH_GAP + 2);
      }

      if (barsAreImbalanced(chart, idx)) {
        const ratio = compact ? PRIMARY_LABEL_RATIO_IMBALANCED : 0.22;
        return Math.max(bar.height * ratio, badgeH / 2 + 4);
      }

      if (barTooShortForInside(bar, compact)) {
        return safeBarLabelOffset(chart, bar, compact);
      }
      return Math.max(bar.height * PRIMARY_LABEL_RATIO_BALANCED, BAR_ABOVE_MONTH_GAP);
    },
  };
}

function buildSecondaryBarDataLabels(panel, compact, formatter, indicatorId) {
  const percentMode = isPercentIndicator(indicatorId);

  return {
    clip: false,
    ...dataLabelBadgeStyle(compact),
    formatter,
    textAlign: "center",
    display(ctx) {
      if (!panelShowsLabels(panel)) return false;
      return ctx.dataset.data[ctx.dataIndex] != null;
    },
    anchor(ctx) {
      if (percentMode) return "end";
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      if (!barsAreImbalanced(chart, idx)) {
        return "center";
      }
      return "end";
    },
    align(ctx) {
      if (percentMode) return "top";
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      if (!barsAreImbalanced(chart, idx)) {
        return "center";
      }
      return "top";
    },
    offset(ctx) {
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      const bar = getBarElement(chart, ctx.datasetIndex, idx);
      if (!bar?.height) return BAR_ABOVE_MONTH_GAP;

      if (percentMode) {
        return percentBarLabelOffset(chart, idx, compact);
      }

      if (!barsAreImbalanced(chart, idx)) {
        return 0;
      }

      return safeBarLabelOffset(chart, bar, compact);
    },
  };
}

function buildLineDataLabels(panel, panelData, compact, indicatorId) {
  const badge = dataLabelBadgeStyle(compact);
  const formatter = lineValueFormatter(indicatorId, compact);
  const percentMode = isPercentIndicator(indicatorId);
  const badgeH = labelBadgeHeight(compact);
  const lineClearance = percentMode ? badgeH + 14 : LINE_ABOVE_BAR_GAP;

  return {
    anchor: "end",
    align: "top",
    clip: false,
    ...badge,
    formatter,
    display: () => panelShowsLabels(panel),
    color(ctx) {
      const lineValue = Number(ctx.dataset.data[ctx.dataIndex]);
      const meets = lineLabelMeetsMeta(indicatorId, lineValue);
      return meets ? META_LABEL_GOOD.color : META_LABEL_BAD.color;
    },
    backgroundColor(ctx) {
      const lineValue = Number(ctx.dataset.data[ctx.dataIndex]);
      const meets = lineLabelMeetsMeta(indicatorId, lineValue);
      return meets ? META_LABEL_GOOD.bg : META_LABEL_BAD.bg;
    },
    offset(ctx) {
      const chart = ctx.chart;
      const idx = ctx.dataIndex;
      const linePointY = chart.scales.yRate.getPixelForValue(Number(ctx.dataset.data[idx]));

      if (percentMode) {
        const layout = percentLabelLayout(chart, compact);
        return linePointY - layout.lineTop - badgeH;
      }

      const bandTopY = barLabelsBandTopY(chart, idx, compact);
      const targetTopY = bandTopY - lineClearance - badgeH;
      const chartTop = chart.chartArea?.top ?? 0;
      const safeTopY = Math.max(targetTopY, chartTop + 4);
      return Math.max(linePointY - safeTopY - badgeH, 8);
    },
  };
}

function percentChartCountMax(panelData) {
  const { barPrimary, barSecondary } = panelData;
  const dataMax = Math.max(
    ...(barPrimary || []),
    ...(barSecondary || []),
    0,
  );
  return dataMax * 2.25;
}

function buildBarDatasets(panel, panelData, compact, indicatorId) {
  const {
    barPrimary,
    barSecondary,
    barPrimaryLabel,
    barSecondaryLabel,
  } = panelData;

  const barThickness = compact ? 12 : 18;

  return [
    {
      type: "bar",
      label: barPrimaryLabel,
      data: barPrimary,
      backgroundColor: "#BCBEC0",
      borderColor: "#BCBEC0",
      borderWidth: 1,
      yAxisID: "yCount",
      order: 2,
      barThickness,
      datalabels: buildPrimaryBarDataLabels(panel, compact, (v) => fmtNumber(v), indicatorId),
    },
    {
      type: "bar",
      label: barSecondaryLabel,
      data: barSecondary,
      backgroundColor: "#007E7A",
      borderColor: "#007E7A",
      borderWidth: 1,
      yAxisID: "yCount",
      order: 3,
      barThickness,
      datalabels: buildSecondaryBarDataLabels(panel, compact, (v) => fmtNumber(v), indicatorId),
    },
  ];
}

function buildComboConfig(panel, panelData, compact = false, indicatorId = "") {
  const { line, lineLabel } = panelData;
  const fontSize = compact ? 10 : 11;
  const labelsOn = panelShowsLabels(panel);
  const percentMode = isPercentIndicator(indicatorId);
  const bottomPad = labelsOn ? (compact ? 42 : 52) : compact ? 12 : 24;
  const topPad = labelsOn
    ? percentMode
      ? compact
        ? 64
        : 72
      : compact
        ? 48
        : 52
    : compact
      ? 12
      : 24;

  const lineDataset = {
    type: "line",
    label: lineLabel,
    data: line,
    borderColor: "#034944",
    backgroundColor: "#034944",
    borderWidth: 2,
    pointRadius: compact ? 3 : 4,
    pointBackgroundColor: "#034944",
    yAxisID: "yRate",
    tension: 0.15,
    order: 1,
    datalabels: buildLineDataLabels(panel, panelData, compact, indicatorId),
  };

  return {
    type: "bar",
    data: {
      labels: panelData.labels,
      datasets: [...buildBarDatasets(panel, panelData, compact, indicatorId), lineDataset],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      layout: {
        padding: { top: topPad, right: 8, bottom: bottomPad, left: 8 },
      },
      datasets: {
        bar: {
          categoryPercentage: 0.72,
          barPercentage: 0.78,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "start",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 10,
            font: { family: '"Vale Sans", sans-serif', size: fontSize },
            color: "#555555",
          },
        },
        datalabels: {
          clip: false,
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const label = ctx.dataset.label || "";
              const val = ctx.parsed.y;
              if (ctx.dataset.yAxisID === "yRate") {
                return lineValueTooltip(indicatorId, label, val);
              }
              return `${label}: ${fmtNumber(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { family: '"Vale Sans", sans-serif', size: fontSize },
            color: "#747678",
            maxRotation: 0,
            padding: compact ? 8 : 16,
          },
          grid: { display: false },
        },
        yCount: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          max: percentMode && labelsOn ? percentChartCountMax(panelData) : undefined,
          ticks: { display: false },
          grid: { display: false },
          border: { display: false },
        },
        yRate: {
          type: "linear",
          position: "right",
          beginAtZero: false,
          grace: "8%",
          ticks: { display: false },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  };
}

function renderPanel(panel, panelData, compact, indicatorId) {
  const canvas = panel.querySelector("canvas");
  panel.dataset.showLabels = "true";
  const chart = new window.Chart(canvas, buildComboConfig(panel, panelData, compact, indicatorId));
  panel._indicatorChart = chart;
  return chart;
}

function getPanelData(indicatorId, scope, gerenciaId) {
  const indicator = window.VALE_INDICATORS?.indicators?.[indicatorId];
  if (!indicator) return null;

  if (scope === "consolidado") {
    return {
      ...indicator.consolidado,
      labels: window.VALE_INDICATORS.meta.meses,
    };
  }

  if (scope === "vp2-norte" || scope === "vp2-sul") {
    return aggregateVp2Series(indicatorId, scope);
  }

  const gerencia = indicator.gerencias?.find((g) => g.id === gerenciaId);
  if (!gerencia) return null;

  return {
    ...gerencia.series,
    labels: window.VALE_INDICATORS.meta.meses,
  };
}

function getGerenciaAnalise(indicatorId, gerenciaId) {
  const indicator = window.VALE_INDICATORS?.indicators?.[indicatorId];
  const gerencia = indicator?.gerencias?.find((g) => g.id === gerenciaId);
  return gerencia?.analise || null;
}

function statusClass(status) {
  if (status === "above") return "indicators-status--above";
  if (status === "below") return "indicators-status--below";
  return "indicators-status--neutral";
}

function renderGerenciaInsights(panel, indicatorId, gerenciaId) {
  const row = panel.closest("[data-gerencia-row]");
  const slot = row?.querySelector("[data-analysis-slot]") ?? panel.querySelector("[data-analysis-slot]");
  const analise = getGerenciaAnalise(indicatorId, gerenciaId);
  if (!slot || !analise) return;

  const positivos = analise.positivos?.map((t) => `<li>${t}</li>`).join("") || "";
  const negativos = analise.negativos?.map((t) => `<li>${t}</li>`).join("") || "";

  slot.innerHTML = `
    <div class="indicator-panel__insights">
      <span class="indicators-status ${statusClass(analise.status)}">${analise.statusLabel}</span>
      <div class="indicator-panel__points">
        <div class="indicator-panel__points-col indicator-panel__points-col--pos">
          <strong>Pontos positivos</strong>
          <ul>${positivos}</ul>
        </div>
        <div class="indicator-panel__points-col indicator-panel__points-col--neg">
          <strong>Pontos de atenção</strong>
          <ul>${negativos}</ul>
        </div>
      </div>
    </div>
  `;
}

function bindPanelLabelToggles() {
  if (bindPanelLabelToggles.bound) return;
  bindPanelLabelToggles.bound = true;

  document.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.matches("[data-panel-label-toggle]")) return;

    const panel = input.closest("[data-indicator-chart]");
    if (!panel) return;

    panel.dataset.showLabels = input.checked ? "true" : "false";
    if (panel._indicatorChart) {
      panel._indicatorChart.update();
    }
  });
}

export async function initIndicatorsTransport(slide) {
  const panels = slide.querySelectorAll("[data-indicator-chart]");
  if (!panels.length) return;

  await loadChartPlugins();
  bindPanelLabelToggles();

  const compact = slide.classList.contains("slide--indicators-detail");

  for (const panel of panels) {
    const canvas = panel.querySelector("canvas");
    if (!canvas || canvas.dataset.initialized) continue;

    const { indicator, scope, gerencia } = panel.dataset;
    const panelData = getPanelData(indicator, scope, gerencia);
    if (!panelData) continue;

    renderPanel(panel, panelData, compact, indicator);
    canvas.dataset.initialized = "true";

    if (scope === "gerencia" && gerencia) {
      renderGerenciaInsights(panel, indicator, gerencia);
    }
  }
}
