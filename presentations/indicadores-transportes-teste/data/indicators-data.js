/** Gerado pelo backoffice em 2026-07-13T17:38:37.672606+00:00 */
window.VALE_INDICATORS = {
  "meta": {
    "diretoria": "Transportes – SO Norte",
    "area": "Coletivo",
    "areaHierarquia": "Operações — Transporte Coletivo",
    "referencia": "mai/26",
    "meses": [
      "jan/26",
      "fev/26",
      "mar/26",
      "abr/26",
      "mai/26"
    ]
  },
  "analises": {
    "ovbk": {
      "titulo": "OVBK – Overbook",
      "status": "below",
      "statusLabel": "Indicador abaixo da referência",
      "paragrafos": [
        "Novas contratações de colaboradores representam o maior ofensor do indicador. Novos coletivos foram mobilizados em Serra no dia 04/05, o que indica a tendência de melhoria do indicador para o indicador de maio/2026."
      ]
    },
    "ptl": {
      "titulo": "PTL – Pontualidade",
      "status": "below",
      "statusLabel": "Indicador abaixo da referência",
      "paragrafos": [
        "Trânsito externo foi apontado como fator determinante da não aderência a pontualidade, motivado principalmente por obras nas vias com pare e siga em Serra Norte/Serra Leste ( e na região metropolitana de São Luis (37 atrasos)."
      ]
    }
  },
  "indicators": {
    "ovbk": {
      "id": "ovbk",
      "titulo": "OVBK – Taxa de overbook do transporte coletivo",
      "meta": {
        "value": 1577,
        "format": "number",
        "trend": "up"
      },
      "consolidado": {
        "barPrimaryLabel": "Passageiros transportados / 100",
        "barSecondaryLabel": "Passageiros overbook",
        "lineLabel": "OVBK",
        "barPrimary": [
          2564,
          2402,
          2918,
          2693,
          2538
        ],
        "barSecondary": [
          144,
          505,
          401,
          531,
          278
        ],
        "line": [
          1.781,
          476,
          1037,
          507,
          913
        ]
      },
      "gerencias": [
        {
          "id": "carajas",
          "nome": "Carajás",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Mai/26 com queda de overbook vs abr/26.",
              "Taxa OVBK abaixo de 35% em três meses."
            ],
            "negativos": [
              "Pico de overbook em abr/26 (426 passageiros).",
              "Fev/26 com pico de taxa OVBK (77%)."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              515,
              489,
              601,
              553,
              588
            ],
            "barSecondary": [
              49,
              62,
              239,
              426,
              183
            ],
            "line": [
              9.51,
              12.68,
              39.77,
              77.03,
              31.12
            ]
          }
        },
        {
          "id": "saoluis",
          "nome": "São Luis e EFC",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Mai/26 com menor overbook do semestre (68).",
              "Abr/26 com taxa OVBK controlada (8%)."
            ],
            "negativos": [
              "Pico de overbook em fev/26 (400 passageiros).",
              "Maior variabilidade entre meses."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              1373,
              1268,
              1553,
              1222,
              1216
            ],
            "barSecondary": [
              78,
              400,
              133,
              98,
              68
            ],
            "line": [
              5.68,
              31.55,
              8.56,
              8.02,
              5.59
            ]
          }
        },
        {
          "id": "serrasul",
          "nome": "Serra Sul",
          "analise": {
            "status": "above",
            "statusLabel": "Indicador dentro da referência",
            "positivos": [
              "Taxa OVBK abaixo de 7% em todo o período.",
              "Mai/26 com overbook mínimo (27 passageiros)."
            ],
            "negativos": [
              "Volume transportado atípico em mai/26 — validar dado.",
              "Capacidade mobilizada após 04/05."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              675,
              645,
              766,
              699,
              2718
            ],
            "barSecondary": [
              17,
              43,
              29,
              15,
              27
            ],
            "line": [
              2.52,
              6.67,
              3.79,
              2.15,
              0.99
            ]
          }
        }
      ]
    },
    "ptl": {
      "id": "ptl",
      "titulo": "PTL – Taxa de pontualidade do transporte coletivo",
      "meta": {
        "value": 96.6,
        "format": "percent",
        "trend": "down"
      },
      "consolidado": {
        "barPrimaryLabel": "Viagens",
        "barSecondaryLabel": "Viagens no horário",
        "lineLabel": "PTL",
        "barPrimary": [
          7942,
          7188,
          8628,
          7926,
          7520
        ],
        "barSecondary": [
          7579,
          6778,
          7929,
          7432,
          7159
        ],
        "line": [
          95.43,
          94.3,
          91.9,
          93.77,
          95.2
        ]
      },
      "gerencias": [
        {
          "id": "carajas",
          "nome": "Carajás",
          "analise": {
            "status": "above",
            "statusLabel": "Indicador acima da referência",
            "positivos": [
              "PTL acima de 98% em quatro dos cinco meses.",
              "Melhor desempenho relativo da diretoria."
            ],
            "negativos": [
              "Mai/26 com leve queda vs abr/26 (99,3% → 98,5%)."
            ]
          },
          "series": {
            "barPrimaryLabel": "Viagens",
            "barSecondaryLabel": "Viagens no horário",
            "lineLabel": "PTL",
            "barPrimary": [
              1462,
              1370,
              1629,
              1436,
              1622
            ],
            "barSecondary": [
              1440,
              1350,
              1613,
              1426,
              1598
            ],
            "line": [
              98.5,
              98.54,
              99.02,
              99.3,
              98.52
            ]
          }
        },
        {
          "id": "saoluis",
          "nome": "São Luis e EFC",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Mai/26 com recuperação para 95,08%.",
              "Abr/26 com melhora vs mar/26."
            ],
            "negativos": [
              "Mar/26 com PTL de 87,17% — pior mês.",
              "37 atrasos por trânsito na região metropolitana."
            ]
          },
          "series": {
            "barPrimaryLabel": "Viagens",
            "barSecondaryLabel": "Viagens no horário",
            "lineLabel": "PTL",
            "barPrimary": [
              4303,
              3726,
              4561,
              3876,
              3554
            ],
            "barSecondary": [
              3797,
              3403,
              3976,
              3534,
              3379
            ],
            "line": [
              92.47,
              91.33,
              87.17,
              91.18,
              95.08
            ]
          }
        },
        {
          "id": "serrasul",
          "nome": "Serra Sul",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Jan/26 e mar/26 com PTL acima de 95%.",
              "Volume de viagens estável no período."
            ],
            "negativos": [
              "Mai/26 com queda para 93,09%.",
              "Obras com pare e siga em Serra Norte/Serra Leste."
            ]
          },
          "series": {
            "barPrimaryLabel": "Viagens",
            "barSecondaryLabel": "Viagens no horário",
            "lineLabel": "PTL",
            "barPrimary": [
              2177,
              2092,
              2438,
              2244,
              2344
            ],
            "barSecondary": [
              2160,
              2052,
              2340,
              2141,
              2182
            ],
            "line": [
              99.22,
              96.8,
              95.98,
              95.41,
              93.09
            ]
          }
        }
      ]
    }
  }
};
