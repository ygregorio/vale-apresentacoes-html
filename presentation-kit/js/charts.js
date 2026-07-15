const CHART_COLORS = [
  "#007E7A",
  "#0ABB98",
  "#3CB5E5",
  "#ECB11F",
  "#C0305E",
  "#9DE4D6",
  "#2626D1",
  "#747678",
];

let chartLibLoaded = false;

async function loadChartJs() {
  if (chartLibLoaded || window.Chart) {
    chartLibLoaded = true;
    return window.Chart;
  }

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

function resolveConfig(canvas) {
  const ref = canvas.dataset.chartRef;
  if (ref && window.VALE_CHARTS?.[ref]) {
    return structuredClone(window.VALE_CHARTS[ref]);
  }

  if (canvas.dataset.chartInline) {
    return JSON.parse(canvas.dataset.chartInline);
  }

  return null;
}

function buildWaterfallConfig(config) {
  const { labels, changes, unit = "" } = config.waterfall;
  let running = 0;
  const floats = [];
  const bgColors = [];

  changes.forEach((change, i) => {
    const isFirst = i === 0;
    const isLast = i === changes.length - 1;

    if (isFirst) {
      running = change;
      floats.push([0, change]);
      bgColors.push("#007E7A");
      return;
    }

    if (isLast) {
      floats.push([0, running]);
      bgColors.push("#555555");
      return;
    }

    const start = running;
    running += change;
    floats.push([Math.min(start, running), Math.max(start, running)]);
    bgColors.push(change >= 0 ? "#0ABB98" : "#C0305E");
  });

  return {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: unit,
        data: floats,
        backgroundColor: bgColors,
        borderColor: bgColors,
        borderWidth: 1,
        borderSkipped: false,
      }],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: config.options?.plugins?.title,
        tooltip: {
          callbacks: {
            label(ctx) {
              const idx = ctx.dataIndex;
              const ch = changes[idx];
              if (idx === 0 || idx === changes.length - 1) {
                return `${ctx.label}: ${ch ?? running} ${unit}`.trim();
              }
              return `${ctx.label}: ${ch > 0 ? "+" : ""}${ch} ${unit}`.trim();
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { font: { family: '"Vale Sans", sans-serif' }, color: "#747678" },
        },
        y: {
          beginAtZero: true,
          ticks: { font: { family: '"Vale Sans", sans-serif' }, color: "#747678" },
          title: {
            display: !!unit,
            text: unit,
            font: { family: '"Vale Sans", sans-serif' },
            color: "#555555",
          },
        },
      },
    },
  };
}

function buildChartOptions(config) {
  const isCircular = config.type === "pie" || config.type === "doughnut";

  const base = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: config.options?.indexAxis,
    plugins: {
      legend: {
        display: config.options?.plugins?.legend?.display ?? !isCircular,
        position: config.options?.plugins?.legend?.position ?? "top",
        labels: {
          font: { family: '"Vale Sans", "Segoe UI", sans-serif' },
          color: "#555555",
        },
      },
      title: {
        display: !!config.options?.plugins?.title?.text,
        font: { family: '"Vale Sans", "Segoe UI", sans-serif', size: 16 },
        color: "#555555",
        ...config.options?.plugins?.title,
      },
      tooltip: config.options?.plugins?.tooltip,
    },
  };

  if (isCircular) {
    return { ...base, ...config.options, plugins: { ...base.plugins, ...config.options?.plugins } };
  }

  return {
    ...base,
    ...config.options,
    plugins: { ...base.plugins, ...config.options?.plugins },
    scales: {
      x: {
        ticks: { font: { family: '"Vale Sans", sans-serif' }, color: "#747678" },
        title: {
          display: !!config.options?.scales?.x?.title?.text,
          font: { family: '"Vale Sans", sans-serif' },
          color: "#555555",
          ...config.options?.scales?.x?.title,
        },
        ...config.options?.scales?.x,
      },
      y: {
        beginAtZero: config.options?.scales?.y?.beginAtZero ?? true,
        ticks: { font: { family: '"Vale Sans", sans-serif' }, color: "#747678" },
        title: {
          display: !!config.options?.scales?.y?.title?.text,
          font: { family: '"Vale Sans", sans-serif' },
          color: "#555555",
          ...config.options?.scales?.y?.title,
        },
        ...config.options?.scales?.y,
      },
    },
  };
}

export async function initCharts(slide) {
  const canvases = slide.querySelectorAll("canvas[data-chart], canvas[data-chart-ref]");
  if (!canvases.length) return;

  const Chart = await loadChartJs();

  for (const canvas of canvases) {
    if (canvas.dataset.initialized) continue;

    let config = resolveConfig(canvas);

    if (!config && canvas.dataset.chart) {
      try {
        const res = await fetch(canvas.dataset.chart);
        config = await res.json();
      } catch {
        config = null;
      }
    }

    if (!config) continue;

    if (config.type === "waterfall") {
      config = buildWaterfallConfig(config);
    }

    const colors = config.data?.datasets?.[0]?.backgroundColor || CHART_COLORS;

    new Chart(canvas, {
      type: config.type,
      data: {
        ...config.data,
        datasets: config.data?.datasets?.map((ds) => {
          const next = { ...ds };
          if (!next.backgroundColor && config.type !== "line") {
            next.backgroundColor = colors;
          }
          if (!next.borderColor && config.type === "bar") {
            next.borderColor = next.backgroundColor || colors;
          }
          return next;
        }),
      },
      options: buildChartOptions(config),
    });

    canvas.dataset.initialized = "true";
  }
}
