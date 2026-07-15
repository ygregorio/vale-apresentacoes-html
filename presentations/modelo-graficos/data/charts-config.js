/** Dados fictícios — Modelo de Gráficos Vale */
window.VALE_CHARTS = {
  barrasHorizontais: {
    type: "bar",
    data: {
      labels: ["Minério de ferro", "Níquel", "Cobre", "Manganês", "Pelotas"],
      datasets: [{
        label: "Volume (Mt)",
        data: [312, 68, 42, 5.8, 48],
        backgroundColor: ["#007E7A", "#0ABB98", "#3CB5E5", "#ECB11F", "#C0305E"],
      }],
    },
    options: {
      indexAxis: "y",
      plugins: {
        title: { text: "Produção por commodity — 1S 2026 (fictício)" },
        legend: { display: false },
      },
      scales: {
        x: {
          title: { display: true, text: "Milhões de toneladas (Mt)" },
        },
      },
    },
  },

  colunas: {
    type: "bar",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [{
        label: "Produção (Mt)",
        data: [78, 82, 85, 80, 88, 91],
        backgroundColor: "#007E7A",
      }],
    },
    options: {
      plugins: {
        title: { text: "Produção mensal de minério — 2026 (fictício)" },
        legend: { display: false },
      },
      scales: {
        y: {
          title: { display: true, text: "Milhões de toneladas (Mt)" },
        },
        x: {
          title: { display: true, text: "Mês" },
        },
      },
    },
  },

  linha: {
    type: "line",
    data: {
      labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
      datasets: [
        {
          label: "Produção (Mt)",
          data: [315, 328, 336, 342, 355, 368],
          borderColor: "#007E7A",
          backgroundColor: "rgba(0, 126, 122, 0.12)",
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "#007E7A",
          pointRadius: 5,
        },
        {
          label: "Meta (Mt)",
          data: [310, 325, 340, 350, 360, 375],
          borderColor: "#3CB5E5",
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
          pointBackgroundColor: "#3CB5E5",
          pointRadius: 4,
        },
      ],
    },
    options: {
      plugins: {
        title: { text: "Evolução da produção vs. meta — 2021–2026 (fictício)" },
      },
      scales: {
        y: {
          title: { display: true, text: "Milhões de toneladas (Mt)" },
        },
        x: {
          title: { display: true, text: "Ano" },
        },
      },
    },
  },

  pizza: {
    type: "pie",
    data: {
      labels: ["América do Sul", "Ásia", "Europa", "América do Norte", "Outros"],
      datasets: [{
        label: "Participação (%)",
        data: [38, 32, 14, 11, 5],
        backgroundColor: ["#007E7A", "#0ABB98", "#3CB5E5", "#ECB11F", "#747678"],
      }],
    },
    options: {
      plugins: {
        title: { text: "Mix de vendas por região — 2026 (fictício)" },
        legend: { display: true, position: "right" },
      },
    },
  },

  cascata: {
    type: "waterfall",
    waterfall: {
      labels: [
        "Saldo inicial",
        "Ramp-up S11D",
        "Parada programada",
        "Ganho produtividade",
        "Ajuste logístico",
        "Saldo final",
      ],
      changes: [320, 28, -22, 15, -8, 0],
      unit: "Mt",
    },
    options: {
      plugins: {
        title: { text: "Ponte de produção — 2T 2026 (fictício)" },
      },
    },
  },
};
