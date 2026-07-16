/** Gerado em 2026-07-16T02:39:01.022516+00:00 */
window.VALE_INDICATORS = {
  "meta": {
    "diretoria": "Dir Serv. Operacionais E Seg. Empresarial",
    "area": "Transporte Coletivo",
    "areaHierarquia": "Operações — Serviços Operacionais",
    "referencia": "jun/26",
    "meses": [
      "jan/26",
      "fev/26",
      "mar/26",
      "abr/26",
      "mai/26",
      "jun/26"
    ],
    "hierarquia": [
      {
        "id": "vp",
        "nome": "Vice-Presidente",
        "nivel": "VP",
        "parentId": null,
        "ordem": 1
      },
      {
        "id": "vp1-dsose",
        "nome": "Dir Serv. Operacionais E Seg. Empresarial",
        "nivel": "VP-1",
        "parentId": "vp",
        "ordem": 1
      },
      {
        "id": "vp2-sul",
        "nome": "Serviços Operacionais Sul",
        "nivel": "VP-2",
        "parentId": "vp1-dsose",
        "ordem": 1
      },
      {
        "id": "tu-efvm",
        "nome": "TU e EFVM",
        "nivel": "VP-3",
        "parentId": "vp2-sul",
        "ordem": 1
      },
      {
        "id": "sul",
        "nome": "Sul",
        "nivel": "VP-3",
        "parentId": "vp2-sul",
        "ordem": 2
      },
      {
        "id": "sudeste",
        "nome": "Sudeste",
        "nivel": "VP-3",
        "parentId": "vp2-sul",
        "ordem": 3
      },
      {
        "id": "vp2-norte",
        "nome": "Serviços Operacionais Norte",
        "nivel": "VP-2",
        "parentId": "vp1-dsose",
        "ordem": 2
      },
      {
        "id": "carajas",
        "nome": "Carajás",
        "nivel": "VP-3",
        "parentId": "vp2-norte",
        "ordem": 1
      },
      {
        "id": "serrasul",
        "nome": "Serra Sul",
        "nivel": "VP-3",
        "parentId": "vp2-norte",
        "ordem": 2
      },
      {
        "id": "sls-efc",
        "nome": "São Luis e EFC",
        "nivel": "VP-3",
        "parentId": "vp2-norte",
        "ordem": 3
      }
    ]
  },
  "analises": {
    "ovbk": {
      "titulo": "OVBK — VP-1",
      "status": "below",
      "statusLabel": "Indicador abaixo da referência",
      "paragrafos": [
        "Jun/26: taxa 866 (meta 1.577), recuperação tímida vs. mai/26 (719→866), 45% abaixo da referência — pressionado por Serra Sul e Sudeste, com demanda não planejada acima da capacidade.",
        "**Norte** — Serra Sul puxa o desempenho: 212 excedentes, overbooking em ~20 dias e cadastro frágil (190 novos cadastros, 453 avulsas), com lotação crítica em UT01–UT03 e migração entre regimes sem aviso. Carajás, São Luis e EFC com picos por demanda não sinalizada — admissões, treinamentos e entradas fora do planejamento de frota.",
        "**Sul** — Sudeste concentra 380 excedentes (Santa Bárbara/Fazendão), com ônibus extra e acompanhamento diário. Sul/TU/EFVM na meta após novas linhas e sinalização, mas expostos a picos — cadastro por linha e aviso antecipado são prioritários."
      ]
    },
    "ptl": {
      "titulo": "PTL — VP-1",
      "status": "below",
      "statusLabel": "Indicador abaixo da referência",
      "paragrafos": [
        "Jun/26 consolidado VP-1: PTL 96,02% (meta 96,60%, gap -0,58 p.p.). Apesar do consolidado numérico próximo da meta, as duas diretorias reportam atrasos recorrentes e processos em estabilização.",
        "**Norte** — Dependência de vias externas: pare e siga, obras BR-381/Santa Bárbara, trânsito metropolitano SL (rotas TN/TO). Carajás 95,7%, SLS EFC 94,63% — turno noite concentra 34% dos atrasos.",
        "**Sul** — VGR/MUT/CPX, Mariana/Brucutu e rotas metropolitanas com obras e congestionamento. Elida reforça abordagem sistêmica por rota, BI e proibição de normalizar atrasos."
      ]
    }
  },
  "indicators": {
    "ovbk": {
      "id": "ovbk",
      "titulo": "OVBK – Taxa de overbook do transporte coletivo",
      "escopoNivel": "VP-1",
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
          6550,
          5783,
          6927,
          6243,
          6344,
          6160
        ],
        "barSecondary": [
          234,
          578,
          530,
          668,
          882,
          711
        ],
        "line": [
          2798.936,
          1000.548,
          1307.051,
          934.591,
          719.317,
          866.356
        ]
      },
      "gerencias": [
        {
          "id": "tu-efvm",
          "nome": "TU e EFVM",
          "nivel": "VP-3",
          "parentId": "vp2-sul",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Análise estruturada com 5 Porquês e plano de ação no Stratws.",
              "Mobilização de 03 recursos adicionais em curso.",
              "Iniciativas de cadastro na ambientação e fidelização por crachá."
            ],
            "negativos": [
              "Taxa OVBK 901 vs meta 1.577 (gap -676).",
              "66 passageiros excedentes em jun/26.",
              "79% dos casos por uso sem cadastro; 67 colaboradores de outros regimes no turno ADM."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              594,
              526,
              666,
              561,
              610,
              595
            ],
            "barSecondary": [
              26,
              46,
              81,
              59,
              379,
              66
            ],
            "line": [
              2283.808,
              1143.109,
              821.975,
              950.051,
              160.86,
              901.0
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pptx",
            "arquivo": "Anomalias Overbooking - Transporte Jun-26.pptx",
            "titulo": "MCS – Overbooking | TU e EFVM",
            "gerencia": "TU e EFVM",
            "gerenciaId": "tu-efvm",
            "indicador": "Overbooking",
            "referencia": "jun/26",
            "modelo": "Anomalias Transporte — DO Serv. Op. TU/EFVM",
            "atualizadoEm": "08/07/2026",
            "pilar": "Gestão",
            "kpi": "Anomalias de Transportes — Overbooking",
            "real": "901",
            "meta": "1.577",
            "gap": "-676",
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "motivo": "Superlotação nos ônibus do turno administrativo e utilização de coletivos sem cadastro. Memória de cálculo: 59.466 passageiros transportados ÷ 66 overbook = taxa 901 (meta 1.577).",
            "causasPrincipais": [
              "79% relacionado ao uso do transporte sem cadastro (recém-contratados e retorno ao site).",
              "21% relacionado ao uso do turno 12h nos ônibus administrativos ou linha diferente do cadastro (treinamento, mudança pontual de turno).",
              "Maior ofensor: utilização dos ônibus administrativos pela equipe do turno e retorno ao site sem cadastro."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "Porque está ocorrendo superlotação nos ônibus do turno administrativo."
              },
              {
                "nivel": 2,
                "texto": "Porque houve aumento no número de usuários não programados utilizando o transporte."
              },
              {
                "nivel": 3,
                "texto": "Porque aproximadamente 67 colaboradores de outros regimes e linhas passaram a utilizar o transporte do turno administrativo."
              },
              {
                "nivel": 4,
                "texto": "Porque colaboradores estão migrando de turno de trabalho."
              },
              {
                "nivel": 5,
                "texto": "Porque não existe fluxo consolidado para reserva de assentos em situações excepcionais (treinamentos, mudanças temporárias de turno)."
              }
            ],
            "porquesComplementares": [
              {
                "nivel": 1,
                "texto": "Porque está ocorrendo utilização dos coletivos sem cadastro."
              },
              {
                "nivel": 2,
                "texto": "Porque houve aumento de funcionários devido a novas contratações e retorno ao site."
              },
              {
                "nivel": 3,
                "texto": "Porque os novos usuários vieram para o site sem realizar o cadastro."
              }
            ],
            "causaRaiz": "Ausência de cadastro prévio e de fluxo formal de reserva/comunicação antecipada para mudanças de turno, treinamentos e novos colaboradores, gerando superlotação no turno administrativo.",
            "solucao": [
              "Notificar usuários e líderes sobre obrigatoriedade de comunicação antecipada.",
              "Criar fluxo padrão de reserva programada (agendamento de assento).",
              "Validar com áreas e RH cadastro no momento da ambientação.",
              "Fidelização de passageiros com identificação por crachá.",
              "Mobilização de 03 recursos adicionais."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Notificar todos os usuários e líderes da obrigatoriedade de comunicar de forma antecipada.",
                "responsavel": "Gestão Transporte TU/EFVM",
                "status": "Em andamento"
              },
              {
                "numero": 2,
                "descricao": "Criar fluxo padrão de reserva programada (agendamento de assento).",
                "responsavel": "Gestão Transporte TU/EFVM",
                "status": "Em andamento"
              },
              {
                "numero": 3,
                "descricao": "Validar com áreas e RH para novos funcionários serem cadastrados no momento da ambientação.",
                "responsavel": "RH / Áreas requisitantes",
                "status": "Em andamento"
              },
              {
                "numero": 4,
                "descricao": "Fidelização dos passageiros com identificação do crachá.",
                "responsavel": "Operação TU/EFVM",
                "status": "Em andamento"
              },
              {
                "numero": 5,
                "descricao": "Mobilização de 03 recursos para absorção de demanda.",
                "responsavel": "Planejamento TU/EFVM",
                "status": "Em andamento"
              }
            ],
            "observacoes": [
              "Planos de ação acompanhados no Stratws (Solução de Problema).",
              "66 passageiros em overbooking sobre 59.466 transportados em jun/26.",
              "Atualizado em 08/07/2026."
            ],
            "resumoOfensores": {
              "semCadastro": "79% — recém-contratados e retorno ao site",
              "turno12h": "21% — treinamento e mudança pontual de turno"
            }
          }
        },
        {
          "id": "carajas",
          "nome": "Carajás",
          "nivel": "VP-3",
          "parentId": "vp2-norte",
          "analise": {
            "status": "below",
            "statusLabel": "",
            "positivos": [],
            "negativos": []
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              1374,
              1293,
              1551,
              1441,
              1216,
              1438
            ],
            "barSecondary": [
              78,
              365,
              133,
              90,
              68,
              43
            ],
            "line": [
              1761.103,
              354.118,
              1166.263,
              1601.044,
              1788.456,
              3344.488
            ]
          }
        },
        {
          "id": "sul",
          "nome": "Sul",
          "nivel": "VP-3",
          "parentId": "vp2-sul",
          "analise": {
            "status": "above",
            "statusLabel": "Indicador acima da referência",
            "positivos": [
              "Taxa OVBK 41.468 em jun/26 — melhor resultado entre as gerências (meta 1.577).",
              "Apenas 3 passageiros excedentes no mês sobre 124.405 transportados.",
              "Projetos estruturantes em andamento: Vuse e parametrização de contratos."
            ],
            "negativos": [
              "Evento pontual na linha A02 (BH × Jangada) em 23/06 sem causa específica identificada.",
              "Comunicação prévia de acréscimo de passageiros ainda não institucionalizada."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              1792,
              1369,
              1621,
              1425,
              1552,
              1244
            ],
            "barSecondary": [
              5,
              45,
              8,
              22,
              35,
              3
            ],
            "line": [
              35839.2,
              3042.778,
              20266.25,
              6478.682,
              4435.657,
              41468.333
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pdf",
            "arquivo": "Anomalias_Transporte_Junho 2026_Overbooking Rev 01.pdf",
            "titulo": "MCS – Overbooking | Corredor Sul",
            "gerencia": "Sul",
            "gerenciaId": "sul",
            "indicador": "Overbooking",
            "referencia": "jun/26",
            "modelo": "Anomalia Transporte — Corredor Sul",
            "pilar": "Gestão",
            "kpi": "Anomalia Transporte Corredor Sul — Overbooking",
            "real": "41.468",
            "meta": "1.577",
            "gap": "+39.891",
            "status": "above",
            "statusLabel": "Indicador acima da referência",
            "motivo": "Jun/26 com excelente desempenho: apenas 3 passageiros overbook sobre 124.405 transportados (taxa 41.468). Evento pontual na linha A02 (Belo Horizonte × Jangada) em 23/06 no complexo P. Norte.",
            "causasPrincipais": [
              "Aumento eventual de passageiros sem comunicação prévia à equipe de transporte (linha A02, 23/06).",
              "Não identificada causa específica recorrente — volume geral de overbooking muito baixo no mês (3 excedentes).",
              "Complexo P. Norte (3) concentrou o único evento registrado em jun/26."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "Houve overbooking pontual porque a linha A02 (Belo Horizonte × Jangada) recebeu passageiros acima da capacidade em 23/06."
              },
              {
                "nivel": 2,
                "texto": "O aumento de demanda ocorreu sem comunicação prévia à equipe de transporte responsável pelo planejamento da rota."
              },
              {
                "nivel": 3,
                "texto": "Não há rastreabilidade imediata da origem do acréscimo de passageiros (causa específica não identificada no evento)."
              },
              {
                "nivel": 4,
                "texto": "Cadastro de passageiros e parametrização de novas contratações ainda em implementação (projeto Vuse e alinhamento com gestão de contratos)."
              }
            ],
            "causaRaiz": "Aumento eventual de passageiros sem comunicação prévia à equipe de transporte, em contexto de baixa maturidade do controle de cadastro e credenciamento de embarque.",
            "solucao": [
              "Projeto Cadastro de Passageiros em parceria com fornecedora Vuse.",
              "Alinhamento com gestão de contratos sobre divulgação de novas contratações cuja responsabilidade de transporte seja Vale.",
              "Nova parametrização de processos — planos de ação acompanhados no Stratws."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Projeto Cadastro de Passageiros em parceria com fornecedora Vuse.",
                "responsavel": "Alice Lemos",
                "status": "Em andamento"
              },
              {
                "numero": 2,
                "descricao": "Alinhamento com a gestão de contratos da operação sobre divulgação de novas contratações cuja responsabilidade do transporte seja Vale (nova parametrização).",
                "responsavel": "Gestão de Contratos Operação",
                "status": "Em andamento"
              }
            ],
            "observacoes": [
              "Cálculo jun/26: 124.405 transportados ÷ 3 overbook = taxa OVBK 41.468.",
              "Evento: complexo P. Norte (3), linha A02 (Belo Horizonte × Jangada), 23/06/2026.",
              "Stratws: https://vps.stratws.com/OportunidadesDeMelhoria/SolucoesDeProblemas/Edit/1110000162557"
            ]
          }
        },
        {
          "id": "serrasul",
          "nome": "Serra Sul",
          "nivel": "VP-3",
          "parentId": "vp2-norte",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Jun/26 com redução da taxa OVBK vs mai/26 (321 → 271).",
              "Mobilização de micro-ônibus e ônibus adicionais em andamento."
            ],
            "negativos": [
              "20 dias no mês com ocorrências de overbooking.",
              "190 novos cadastros e 453 solicitações avulsas aprovadas no período.",
              "12 rotas administrativas com lotação máxima + 9 rotas de turno críticas."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              516,
              489,
              601,
              553,
              588,
              574
            ],
            "barSecondary": [
              49,
              62,
              239,
              426,
              183,
              212
            ],
            "line": [
              1052.816,
              788.71,
              251.619,
              129.815,
              321.372,
              270.778
            ]
          },
          "mcs": {
            "layout": "anomalia",
            "fonte": "pdf",
            "arquivo": "MCS Overbooking_Jun2026.pdf",
            "titulo": "MCS – Overbooking | Transporte Coletivo",
            "gerencia": "Serra Sul",
            "gerenciaId": "serrasul",
            "indicador": "Overbooking",
            "referencia": "jun/26",
            "modelo": "Anomalia de transporte — Canaã",
            "real": "271",
            "meta": "1.577",
            "motivo": "Demanda de passageiros superou a capacidade disponível em rotas administrativas e de turno, com 20 dias de overbooking no mês e pico de 212 passageiros overbook em jun/26.",
            "causasPrincipais": [
              "Demanda de passageiros superou a capacidade disponível em determinadas rotas (12 rotas ADM lotadas e 9 do turno).",
              "Acréscimo de 190 novos cadastros e 542 alterações de rota entre ADM e turno no período.",
              "453 solicitações avulsas aprovadas e necessidade operacional do cliente (56 novos cadastros Vale + 25 contratados SOTREQ)."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "Houve overbooking recorrente porque a demanda superou a capacidade ofertada em rotas críticas (12 ADM + 9 turno), com 20 dias de ocorrência no mês."
              },
              {
                "nivel": 2,
                "texto": "A demanda cresceu com 190 novos cadastros e 542 alterações de rota entre regimes ADM e turno sem rebalanceamento prévio da frota."
              },
              {
                "nivel": 3,
                "texto": "Cadastros e alterações avulsas (453 solicitações aprovadas) entraram sem avaliação antecipada de lotação e capacidade das rotas."
              },
              {
                "nivel": 4,
                "texto": "Não há governança formal de comunicação prévia entre áreas quando há migração relevante de passageiros entre regimes de trabalho."
              }
            ],
            "causaRaiz": "Desalinhamento entre capacidade ofertada e demanda real, agravado por cadastros, alterações avulsas e migrações entre regimes sem avaliação prévia de lotação.",
            "solucao": [
              "Manter veículo de apoio em stand-by e canal de atendimento ágil para absorver picos.",
              "Analisar lotação das rotas e ajustar roteirização ou mobilizar frota adicional.",
              "Estabelecer comunicação prévia entre áreas em migrações relevantes de passageiros.",
              "Saneamento contínuo da base de cadastro para refletir demanda real por rota."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Veículo de apoio em stand-by e grupo WhatsApp para atendimento on-line às rotas críticas.",
                "responsavel": "Francisco Junior / Maidria Maia",
                "status": "Contínua"
              },
              {
                "numero": 2,
                "descricao": "Análise da lotação das rotas para identificar ajustes na roteirização e/ou novas mobilizações.",
                "responsavel": "Francisco Junior / Maidria Maia",
                "status": "Contínua"
              },
              {
                "numero": 3,
                "descricao": "Comunicação prévia entre áreas quando houver migração relevante de passageiros entre regimes.",
                "responsavel": "Francisco Junior",
                "status": "Contínua"
              },
              {
                "numero": 4,
                "descricao": "Reaproveitamento de 1 micro-ônibus para absorção de overbookings nas rotas turno UT01, UT02 e UT03.",
                "responsavel": "Francisco Junior",
                "status": "16/06/2026"
              },
              {
                "numero": 5,
                "descricao": "Mobilização de 2 ônibus para absorção de overbookings nas rotas administrativas.",
                "responsavel": "Francisco Junior",
                "status": "30/07/2026"
              },
              {
                "numero": 6,
                "descricao": "Saneamento da base de cadastro para trazer informação correta dos passageiros por rota.",
                "responsavel": "Francisco Junior",
                "status": "Contínua"
              }
            ],
            "observacoes": [
              "Período demonstrativo: 01/06 a 30/06/2026.",
              "TOP avulsos: Ger. Manut. Mina SS (74), Ger. Operação SS (67).",
              "Principais motivos de alteração de cadastro: atualização de endereço (414), atualização de rota (154), alteração de regime (131)."
            ]
          }
        },
        {
          "id": "sudeste",
          "nome": "Sudeste",
          "nivel": "VP-3",
          "parentId": "vp2-sul",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Complexos Itabira e Minas Centrais zeraram overbooking em jun/26.",
              "Levantamento de credenciamento nas linhas concluído em 10/07.",
              "Plano estruturado: card por linha, catracas e VUSE até 30/09."
            ],
            "negativos": [
              "Taxa OVBK 417 vs meta 1.577 (gap -1.160).",
              "380 passageiros excedentes no complexo Mariana — pico vs meses anteriores (44 em mai/26).",
              "Movimentação de efetivo sem comunicação prévia ao planejamento operacional."
            ]
          },
          "series": {
            "barPrimaryLabel": "Passageiros transportados / 100",
            "barSecondaryLabel": "Passageiros overbook",
            "lineLabel": "OVBK",
            "barPrimary": [
              1599,
              1461,
              1721,
              1562,
              1644,
              1585
            ],
            "barSecondary": [
              59,
              17,
              40,
              56,
              190,
              380
            ],
            "line": [
              2710.305,
              8596.235,
              4303.425,
              2789.161,
              865.347,
              417.211
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pdf",
            "arquivo": "Overbooking Jun-26.pdf",
            "titulo": "MCS – Overbooking | Corredor Sudeste",
            "gerencia": "Sudeste",
            "gerenciaId": "sudeste",
            "indicador": "Overbooking",
            "referencia": "jun/26",
            "modelo": "Anomalia Transporte — Corredor Sudeste",
            "pilar": "Gestão",
            "kpi": "Anomalia Transporte Corredor Sudeste — Overbooking",
            "real": "417",
            "meta": "1.577",
            "gap": "-1.160",
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "motivo": "Overbooking registrado em junho nas linhas Santa Bárbara → Fazendão, impactado pela movimentação de efetivo sem comunicação prévia às equipes de planejamento operacional. Minas Centrais e Itabira não registraram overbooking em jun/26.",
            "causasPrincipais": [
              "Movimentação de efetivo sem comunicação prévia ao planejamento operacional.",
              "Variação de demanda comprometeu o dimensionamento previsto para empregados ADM.",
              "Concentração do overbooking no complexo Mariana (380 passageiros excedentes em jun/26)."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "Houve overbooking em junho porque as linhas Santa Bárbara → Fazendão operaram acima da capacidade planejada em determinados períodos."
              },
              {
                "nivel": 2,
                "texto": "A demanda de embarque aumentou por movimentação de efetivo que não foi comunicada previamente às equipes responsáveis pelo planejamento."
              },
              {
                "nivel": 3,
                "texto": "Sem a informação antecipada, o dimensionamento de frota para o regime ADM permaneceu inalterado, gerando ocupações acima do previsto."
              },
              {
                "nivel": 4,
                "texto": "Não há controle de credenciamento por linha que limite embarques acima da capacidade antes da saída do veículo."
              }
            ],
            "causaRaiz": "Movimentação de efetivo sem comunicação prévia ao planejamento operacional, associada à ausência de controle de credenciamento por linha, comprometendo o dimensionamento de frota.",
            "solucao": [
              "Manter reforço de frota até normalização da ocupação (descontinuidade prevista para 09/07).",
              "Implementar card de credencial por linha para controle de embarque.",
              "Estudar implantação de catracas e sistema VUSE (replicação do teste Corredor Norte)."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Manutenção do reforço de frota até a normalização da ocupação. Descontinuidade do recurso extra em 09/07.",
                "responsavel": "Planejamento Operacional Sudeste",
                "status": "Em andamento"
              },
              {
                "numero": 2,
                "descricao": "Levantamento de credenciamento nas linhas.",
                "responsavel": "Gestão Transporte Sudeste",
                "status": "Concluído em 10/07"
              },
              {
                "numero": 3,
                "descricao": "Implementação de card de credencial por linha.",
                "responsavel": "Gestão Transporte Sudeste",
                "status": "Prazo 30/09"
              },
              {
                "numero": 4,
                "descricao": "Estudo para implantação de catracas.",
                "responsavel": "Gestão Transporte Sudeste",
                "status": "Prazo 30/09"
              },
              {
                "numero": 5,
                "descricao": "Estudo de implementação do sistema VUSE (replicação do teste do Corredor Norte).",
                "responsavel": "Gestão Transporte Sudeste",
                "status": "Prazo 30/09"
              }
            ],
            "observacoes": [
              "Cálculo jun/26: 158.540 passageiros transportados ÷ 380 overbook = taxa OVBK 417.",
              "Complexo Mariana concentrou os 380 excedentes; Itabira e Centrais zeraram overbooking em jun/26.",
              "Série mensal excedentes Mariana: jan 337, fev 153, mar 190, abr 48, mai 44, jun 380."
            ]
          }
        },
        {
          "id": "sls-efc",
          "nome": "São Luis e EFC",
          "nivel": "VP-3",
          "parentId": "vp2-norte",
          "analise": {
            "status": "above",
            "statusLabel": "Indicador acima da referência",
            "positivos": [
              "Taxa OVBK de 10.331 em jun/26, acima da meta 1.577.",
              "Apenas 1 ocorrência no mês — melhor performance recente na taxa.",
              "Demais operadores (GERTAXI, VIX, CIA) zeraram overbooking em jun/26."
            ],
            "negativos": [
              "Ocupação média 79,64% abaixo da meta de 85%.",
              "Evento isolado na rota ROF-02 com 7 passageiros excedentes (09/06).",
              "Queda de ocupação na 5ª semana (75,49%)."
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
              701,
              734,
              724
            ],
            "barSecondary": [
              17,
              43,
              29,
              15,
              27,
              7
            ],
            "line": [
              3971.412,
              1500.465,
              2642.759,
              4675.667,
              2717.852,
              10335.714
            ]
          },
          "mcs": {
            "layout": "anomalia",
            "fonte": "pdf",
            "arquivo": "Indicador Overbooking.pdf",
            "titulo": "MCS – Overbooking | São Luís & EFC",
            "gerencia": "São Luis e EFC",
            "gerenciaId": "sls-efc",
            "indicador": "Overbooking",
            "referencia": "jun/26",
            "modelo": "Dashboard Ocupação & Overbooking",
            "real": "10.331",
            "meta": "1.577",
            "status": "above",
            "statusLabel": "Indicador acima da referência",
            "motivo": "Jun/26 com taxa OVBK de 10.331 (meta 1.577), porém apenas 1 ocorrência registrada — rota ROF-02 (PARVI RCR) em 09/06 com 7 passageiros excedentes. Ocupação média do mês: 79,64% (meta 85%).",
            "causasPrincipais": [
              "Ocupação média abaixo da meta do mês (79,66% vs 85%), com queda na 5ª semana (75,49%).",
              "Concentração da única ocorrência na rota ROF-02 — operador PARVI RCR, terça-feira 09/06.",
              "Veículo comercial Bahia Estrada de Ribamar lotou; apoio 55053 acionado para transportar 7 colaboradores excedentes."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "Houve overbooking porque a rota ROF-02 recebeu 7 passageiros acima da capacidade disponível no dia 09/06."
              },
              {
                "nivel": 2,
                "texto": "O veículo comercial principal (Bahia Estrada de Ribamar) operou lotado, sem margem para absorver demanda adicional."
              },
              {
                "nivel": 3,
                "texto": "A demanda excedente só foi absorvida via veículo de apoio (55053), acionado após a lotação do veículo principal."
              },
              {
                "nivel": 4,
                "texto": "Não havia monitoramento prévio de capacidade vs. demanda prevista para a rota ROF-02 naquele turno/dia."
              }
            ],
            "causaRaiz": "Descompasso momentâneo entre capacidade do veículo comercial da rota ROF-02 e demanda real de embarque, sem ajuste preventivo antes da saída.",
            "solucao": [
              "Reforçar monitoramento de lotação da rota ROF-02 e rotas correlatas (TN-10, VAN-02, SPDI-01).",
              "Alinhar programação do veículo comercial Bahia–Ribamar com demanda prevista de colaboradores.",
              "Definir gatilho de acionamento antecipado de apoio quando ocupação projetada ultrapassar limite da rota."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Acompanhar semanalmente rotas com ocupação acima de 80% e histórico de overbooking (ex.: ROF-02).",
                "responsavel": "Gestão Transporte SLS EFC",
                "status": "Contínua"
              },
              {
                "numero": 2,
                "descricao": "Formalizar comunicação com PARVI RCR sobre evento de 09/06 e plano preventivo para rota ROF-02.",
                "responsavel": "Coord. Operacional",
                "status": "Em andamento"
              }
            ],
            "observacoes": [
              "Dashboard atualizado em 14/07/2026 — filtro jun/26.",
              "Total jun/26: 72.319 passageiros, 1 ocorrência, 7 excedentes, taxa OVBK 10.331.",
              "Empresas: PARVI RCR concentrou a ocorrência; demais operadores zeraram overbooking no mês.",
              "Detalhamento do evento: LOTOU COMERCIAL BAHIA ESTRADA DE RIBAMAR, APOIO 55053 — TROUXE 7 COLABORADORES."
            ],
            "seriesDashboard": {
              "ocupacao": {
                "meta": 85,
                "jan/26": 81.09,
                "fev/26": 81.87,
                "mar/26": 82.14,
                "abr/26": 82.26,
                "mai/26": 82.92,
                "jun/26": 79.64
              },
              "overbooking": {
                "meta": 1577,
                "jan/26": 4227,
                "fev/26": 1497,
                "mar/26": 2643,
                "abr/26": 4676,
                "mai/26": 2724,
                "jun/26": 10331
              }
            }
          }
        }
      ],
      "mcsConsolidado": {
        "layout": "kpi",
        "referencia": "jun/26",
        "tipo": "vp1",
        "titulo": "MCS – Overbooking | VP-1 Consolidado",
        "indicador": "Overbooking",
        "real": "866",
        "meta": "1.577",
        "status": "below",
        "statusLabel": "Indicador abaixo da referência",
        "motivo": "Jun/26: taxa 866 (meta 1.577), com recuperação tímida vs. mai/26; desvios ligados a demanda não planejada e picos regionais (Sudeste e Serra Sul).",
        "categoria": "Método",
        "categorias": [
          "Material",
          "Mão de obra",
          "Máquina",
          "Método"
        ],
        "porques": [
          {
            "nivel": 1,
            "texto": "Picos regionais (Sudeste 380; Serra Sul 212) superaram a capacidade planejada de frota."
          },
          {
            "nivel": 2,
            "texto": "Admissões, avulsas e migrações entraram sem sinalização prévia ao Transportes."
          },
          {
            "nivel": 3,
            "texto": "Cadastro por linha frágil, sem governança integrada entre RH, áreas e Transportes."
          },
          {
            "nivel": 4,
            "texto": "Não há fluxo formal de reserva/comunicação antecipada antes de movimentações de efetivo."
          },
          {
            "nivel": 5,
            "texto": "Por que a governança não existe? → Ausência de SLA integrado entre RH, áreas operacionais e Transportes para prever e dimensionar demanda antes das movimentações."
          }
        ],
        "causaRaiz": "Desalinhamento entre demanda (admissões, movimentações, avulsas) e capacidade planejada, com cadastro frágil e comunicação tardia entre RH, áreas e Transportes — picos em Mariana/Sudeste e Serra Sul.",
        "acaoSalvadora": "Governança integrada RH + áreas + Transportes, cadastro por linha, sinalização antecipada e reforço de frota nas rotas críticas para recuperar a taxa OVBK.",
        "solucao": [
          "Governança integrada RH + áreas + Transportes com prazo mínimo para sinalização de entradas.",
          "Cadastro/fidelização obrigatório por linha e gestão de ocupação (VUSE/catracas).",
          "Reforço de frota e linhas nas rotas críticas (Sudeste, Serra Sul, Carajás).",
          "Monitoramento diário e BI por rota — abordagem sistêmica (Elida) + leitura de processo (Mario)."
        ]
      },
      "mcsVp2": {
        "vp2-norte": {
          "layout": "kpi",
          "referencia": "jun/26",
          "gerenciaId": "vp2-norte",
          "gerencia": "Serviços Operacionais Norte",
          "indicador": "Overbooking",
          "real": "913",
          "meta": "1.577",
          "status": "below",
          "statusLabel": "Indicador abaixo da referência",
          "motivo": "Carajás (Rodolfo): demanda acima do planejado — integração RH/Transportes e contingência de rota. São Luís (Rafael): oscilação por admissões/treinamentos — onboarding integrado. Serra Sul (Vladimir): risco por cadastro frágil — 190 cadastros e 453 av",
          "causaRaiz": "Falta de previsibilidade integrada da demanda (RH + áreas operacionais + Transportes) e cadastro/fidelização frágil por linha, permitindo sobrecarga não mapeada.",
          "solucao": [
            "Integrar Transportes ao onboarding e comunicar admissões/movimentações com antecedência.",
            "Cadastro obrigatório e fidelização de passageiros por linha (Serra Sul).",
            "Dimensionamento antecipado de frota e contingência de rotas (Carajás).",
            "Gestão de ocupação e reforço preventivo nas rotas críticas."
          ],
          "porques": [
            {
              "nivel": 1,
              "texto": "Por que OVBK Norte abaixo da meta? → Demanda não prevista e cadastro frágil (Serra Sul, Carajás)."
            },
            {
              "nivel": 2,
              "texto": "Por que demanda não é capturada? → RH/áreas não acionam Transportes com antecedência suficiente."
            },
            {
              "nivel": 3,
              "texto": "Por que SLS está acima da meta? → Apenas 1 ocorrência; oscilação permanece no processo."
            },
            {
              "nivel": 4,
              "texto": "Por quê isso persiste? → previsibilidade de demanda e governança de cadastro por linha."
            },
            {
              "nivel": 5,
              "texto": "Por que não há previsibilidade? → Processos de admissão, cadastro e alteração de rota não incluem Transportes no fluxo de aprovação com antecedência mínima."
            }
          ],
          "fonteReuniao": "vp2-norte-transportes-jun26",
          "categoria": "Método",
          "categorias": [
            "Material",
            "Mão de obra",
            "Máquina",
            "Método"
          ],
          "acaoSalvadora": "Integrar Transportes ao onboarding, cadastro obrigatório por linha e dimensionamento antecipado de frota nas rotas críticas do Norte."
        },
        "vp2-sul": {
          "layout": "kpi",
          "referencia": "jun/26",
          "gerencia": "Serviços Operacionais Sul",
          "gerenciaId": "vp2-sul",
          "indicador": "Overbooking",
          "real": "763",
          "meta": "1.577",
          "status": "below",
          "statusLabel": "Atenção — Sudeste abaixo da meta",
          "motivo": "Na reunião de performance da DIR SUL, Sul (Simone) e TU/EFVM (Domingos) reportaram meta de overbooking atingida após inclusão de novas linhas, adesivos de sinalização e monitoramento diário, com casos...",
          "causaRaiz": "Desalinhamento entre demanda de passageiros e capacidade/sinalização de linhas, com pico crítico no complexo Mariana (Sudeste), mitigado parcialmente por reforço de frota nas demais gerências.",
          "solucao": [
            "Manter novas linhas, adesivos e monitoramento diário (Sul e TU/EFVM).",
            "Ônibus extra e credenciamento por linha no Sudeste (Santa Bárbara/Fazendão).",
            "Comunicação prévia entre gerências em migrações de efetivo (TU/EFVM)."
          ],
          "porques": [
            {
              "nivel": 1,
              "texto": "Por que OVBK da DIR SUL ficou pressionado? → Sudeste concentrou 380 excedentes em jun/26 (Mariana/Santa Bárbara)."
            },
            {
              "nivel": 2,
              "texto": "Por que Sul e TU/EFVM recuperaram? → Novas linhas, sinalização e monitoramento daily (relato reunião)."
            },
            {
              "nivel": 3,
              "texto": "Por que demanda superou capacidade? → Crescimento de passageiros e migração entre regimes sem comunicação prévia."
            },
            {
              "nivel": 4,
              "texto": "Por quê isso persiste? → desalinhamento demanda × capacidade, pico no Sudeste."
            },
            {
              "nivel": 5,
              "texto": "Por que o pico persiste no Sudeste? → Crescimento de efetivo em Mariana/Santa Bárbara sem rebalanceamento formal de frota e credenciamento por linha."
            }
          ],
          "fonteReuniao": "vp2-sul-transportes-jun26",
          "categoria": "Método",
          "categorias": [
            "Material",
            "Mão de obra",
            "Máquina",
            "Método"
          ],
          "acaoSalvadora": "Manter reforço de frota e sinalização (Sul/TU/EFVM), ônibus extra e credenciamento por linha no Sudeste, com comunicação prévia entre gerências."
        }
      },
      "vp2Series": {
        "vp2-norte": {
          "barPrimaryLabel": "Passageiros transportados / 100",
          "barSecondaryLabel": "Passageiros overbook",
          "lineLabel": "OVBK",
          "barPrimary": [
            2565.0,
            2427.0,
            2918.0,
            2695.0,
            2538.0,
            2736.0
          ],
          "barSecondary": [
            144.0,
            470.0,
            401.0,
            531.0,
            278.0,
            262.0
          ],
          "line": [
            1781.25,
            516.3829787234042,
            727.6807980049875,
            507.5329566854991,
            912.9496402877697,
            1044.2748091603055
          ]
        },
        "vp2-sul": {
          "barPrimaryLabel": "Passageiros transportados / 100",
          "barSecondaryLabel": "Passageiros overbook",
          "lineLabel": "OVBK",
          "barPrimary": [
            3985.0,
            3356.0,
            4008.0,
            3548.0,
            3806.0,
            3424.0
          ],
          "barSecondary": [
            90.0,
            108.0,
            129.0,
            137.0,
            604.0,
            449.0
          ],
          "line": [
            4427.777777777778,
            3107.4074074074074,
            3106.9767441860463,
            2589.78102189781,
            630.1324503311258,
            762.5835189309578
          ]
        }
      }
    },
    "ptl": {
      "id": "ptl",
      "titulo": "PTL – Taxa de pontualidade do transporte coletivo",
      "escopoNivel": "VP-1",
      "meta": {
        "value": 96.6,
        "format": "percent",
        "trend": "down"
      },
      "consolidado": {
        "barPrimaryLabel": "Total de viagens",
        "barSecondaryLabel": "Viagens pontuais",
        "lineLabel": "PTL",
        "barPrimary": [
          24146,
          20821,
          24743,
          22913,
          23161,
          22488
        ],
        "barSecondary": [
          23292,
          19796,
          23462,
          21880,
          22277,
          21592
        ],
        "line": [
          96.46,
          95.08,
          94.82,
          95.49,
          96.18,
          96.02
        ]
      },
      "gerencias": [
        {
          "id": "tu-efvm",
          "nome": "TU e EFVM",
          "nivel": "VP-3",
          "parentId": "vp2-sul",
          "analise": {
            "status": "below",
            "statusLabel": "",
            "positivos": [],
            "negativos": []
          },
          "series": {
            "barPrimaryLabel": "Total de viagens",
            "barSecondaryLabel": "Viagens pontuais",
            "lineLabel": "PTL",
            "barPrimary": [
              2180,
              1936,
              2322,
              2087,
              2227,
              2243
            ],
            "barSecondary": [
              2150,
              1839,
              2243,
              2019,
              2161,
              2169
            ],
            "line": [
              98.62,
              94.99,
              96.6,
              96.74,
              97.04,
              96.7
            ]
          }
        },
        {
          "id": "carajas",
          "nome": "Carajás",
          "nivel": "VP-3",
          "parentId": "vp2-norte",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Recuperação em jun/26 (95,7%) vs mai/26 (92,2%) — melhor mês do semestre.",
              "Alinhamento pare e siga concluído em 12/06.",
              "Liberação da estrada Raimundo Mascarenhas em 12/06/2026."
            ],
            "negativos": [
              "PTL 95,70% vs meta 96,60% (-0,90 p.p.).",
              "Alertas vermelhos em 10/06 e 20/06 (pare e siga + quebras em 5 rotas).",
              "TSL02(MH) com 9 dias de baixa pontualidade no mês."
            ]
          },
          "series": {
            "barPrimaryLabel": "Total de viagens",
            "barSecondaryLabel": "Viagens pontuais",
            "lineLabel": "PTL",
            "barPrimary": [
              4303,
              3763,
              4561,
              4246,
              3554,
              4240
            ],
            "barSecondary": [
              3979,
              3428,
              3976,
              3865,
              3379,
              4057
            ],
            "line": [
              92.47,
              91.1,
              87.17,
              91.03,
              95.08,
              95.68
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pptx",
            "arquivo": "Transporte Coletivo_Pontualidade Jun26.pptx",
            "titulo": "MCS – Pontualidade | Carajás",
            "gerencia": "Carajás",
            "gerenciaId": "carajas",
            "indicador": "Pontualidade",
            "referencia": "jun/26",
            "modelo": "Indicador de Transporte Coletivo — Coord. SN SL MN",
            "pilar": "Gestão",
            "kpi": "Taxa de Pontualidade",
            "real": "95,70%",
            "meta": "96,60%",
            "gap": "-0,90 p.p.",
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "motivo": "PTL de 95,70% em jun/26, com melhora vs mai/26 (92,2%), porém ainda abaixo da meta 96,60%. Ofensores: infraestrutura externa (pare e siga, congestionamento, alerta vermelho) e atrasos por quebras de veículos.",
            "causasPrincipais": [
              "Condições viárias externas desfavoráveis: obras, pare e siga km 11, congestionamento na portaria de Parauapebas e alertas vermelhos (10/06 e 20/06).",
              "Atrasos por quebras: falha no acompanhamento de manutenção preventiva/corretiva — 4 rotas impactadas em 20/06 e 1 rota em 10/06.",
              "Rotas Serra Norte (ADM e turno) com baixa pontualidade recorrente: ASN13, ASN29, TSL02(MH), ASN21, TC14/18/30/31, ASN43/45."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "A pontualidade ficou abaixo da meta porque houve atrasos recorrentes nas rotas da Serra Norte (ADM e turno) em jun/26."
              },
              {
                "nivel": 2,
                "texto": "Os atrasos foram causados por pare e siga, congestionamento na portaria de Parauapebas e condições climáticas (alerta vermelho)."
              },
              {
                "nivel": 3,
                "texto": "Quebras de veículos em 5 rotas (4 em 20/06 + 1 em 10/06) reduziram a disponibilidade da frota e exigiram substituição de motorista."
              },
              {
                "nivel": 4,
                "texto": "Manutenção preventiva/corretiva e monitoramento das condições de tráfego das rotas não anteciparam os riscos de quebra e retenção viária."
              },
              {
                "nivel": 5,
                "texto": "Dependência de vias públicas com infraestrutura precária e gestão de terceiros (pare e siga, prefeitura) sem margem operacional nos horários."
              }
            ],
            "causaRaiz": "Dependência de vias externas com pare e siga e congestionamento (Parauapebas), somada a quebras por manutenção reativa, sem ajuste preventivo de horários e rotas na Serra Norte.",
            "solucao": [
              "Alinhar gestão do pare e siga para priorização das rotas Vale no fluxo.",
              "Ajustar início de rotas ADM e turno com maior índice de atrasos (trajetos e horários).",
              "Blitz periódicas de orientação e segurança com DMTT.",
              "Interface institucional com prefeitura para intervenção no fluxo de acesso a Parauapebas."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Alinhamento com a gestão do pare e siga para priorização na passagem das rotas no fluxo.",
                "responsavel": "Ricardo / Hugo",
                "status": "Concluído — 12/06/26"
              },
              {
                "numero": 2,
                "descricao": "Alteração de início das rotas administrativas e turno com maior índice de atrasos (ajustes de trajetos e horários).",
                "responsavel": "Wagner Silva / Roney Silva",
                "status": "Em andamento — 10/07/26"
              },
              {
                "numero": 3,
                "descricao": "Blitz periódicas de orientação e segurança, em parceria com DMTT, para prevenir desvios comportamentais.",
                "responsavel": "Hugo Quaresma",
                "status": "Em andamento — 20/07/26"
              },
              {
                "numero": 4,
                "descricao": "Ofício ao departamento da prefeitura para intervenção no fluxo da via de acesso de Parauapebas (interface relações institucionais Vale).",
                "responsavel": "Genildo Passos (Parvi) / Roney Silva (VIX)",
                "status": "Em andamento — 21/07/26"
              }
            ],
            "rotasCriticas": [
              {
                "rota": "TSL02 (MH)",
                "diasBaixaPontualidade": 9
              },
              {
                "rota": "TC14 (NT)",
                "diasBaixaPontualidade": 5
              },
              {
                "rota": "ASN13",
                "diasBaixaPontualidade": 4
              },
              {
                "rota": "ASN29",
                "diasBaixaPontualidade": 4
              },
              {
                "rota": "ASN21",
                "diasBaixaPontualidade": 4
              },
              {
                "rota": "TC18 (NT)",
                "diasBaixaPontualidade": 4
              },
              {
                "rota": "TC30 (NT)",
                "diasBaixaPontualidade": 4
              },
              {
                "rota": "TC31 (NT)",
                "diasBaixaPontualidade": 4
              }
            ],
            "observacoes": [
              "Série jan–jun/26: 92,5% · 91,1% · 87,2% · 91,0% · 92,2% · 95,7%.",
              "Liberação da estrada Raimundo Mascarenhas em 12/06/2026.",
              "Eventos: alerta vermelho 10/06 (pare e siga km11 + portaria Parauapebas) e 20/06 (quebra 4 rotas)."
            ]
          }
        },
        {
          "id": "sul",
          "nome": "Sul",
          "nivel": "VP-3",
          "parentId": "vp2-sul",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Complexos Portos (98,46%) e FAB/VIG (98,44%) acima da meta.",
              "Fator Vale zerado — sem atrasos atribuídos à operação Vale.",
              "Estudos de rotas críticas em andamento (VGR e MUT/CPX)."
            ],
            "negativos": [
              "PTL consolidado 95,95% vs meta 96,60% (-0,65 p.p.).",
              "VGR com 89,54% — principal detrator do corredor.",
              "6 dias críticos no mês por trânsito externo e 8 anomalias contratadas."
            ]
          },
          "series": {
            "barPrimaryLabel": "Total de viagens",
            "barSecondaryLabel": "Viagens pontuais",
            "lineLabel": "PTL",
            "barPrimary": [
              7711,
              5997,
              7194,
              6717,
              6992,
              5755
            ],
            "barSecondary": [
              7553,
              5771,
              6923,
              6466,
              6751,
              5522
            ],
            "line": [
              97.95,
              96.23,
              96.23,
              96.26,
              96.55,
              95.95
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pdf",
            "arquivo": "Anomalias_Transporte_Junho 2026_Pontualidade rev 02.pdf",
            "titulo": "MCS – Pontualidade | Corredor Sul",
            "gerencia": "Sul",
            "gerenciaId": "sul",
            "indicador": "Pontualidade",
            "referencia": "jun/26",
            "modelo": "Anomalia Transporte — Corredor Sul",
            "pilar": "Gestão",
            "kpi": "Anomalia Transporte Corredor Sul — Pontualidade",
            "real": "95,95%",
            "meta": "96,60%",
            "gap": "-0,65 p.p.",
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "motivo": "Pontualidade de 95,95% em jun/26, abaixo da meta 96,60%. Impacto concentrado em 6 dias (01, 10, 12, 16, 24 e 30) por fatores externos no turno da tarde, especialmente nos complexos Vargem Grande e MUT/CPX.",
            "causasPrincipais": [
              "Fator externo predominante: fluxo intenso BH Shopping, Anel Rodoviário, BR-040, BR-381 e Av. Nossa Senhora do Carmo.",
              "8 anomalias contratadas (quebras mecânicas, falha operacional manutenção, motorista perdeu hora).",
              "Complexos VGR (5 externos + 3 contratadas) e MUT/CPX (4 externos + 1 contratada) concentraram os atrasos."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "A pontualidade ficou abaixo da meta porque houve atrasos recorrentes na chegada dos ônibus à Vale em jun/26."
              },
              {
                "nivel": 2,
                "texto": "Os atrasos concentraram-se em 6 dias específicos, principalmente no turno da tarde, por interferência de trânsito e obras nas vias de acesso."
              },
              {
                "nivel": 3,
                "texto": "Os complexos Vargem Grande e Paraopeba (MUT/CPX) foram os mais impactados por fluxo intenso e interdições viárias."
              },
              {
                "nivel": 4,
                "texto": "Anomalias contratadas (quebras mecânicas e falhas operacionais) somaram 8 eventos, agravando o desvio nos dias críticos."
              },
              {
                "nivel": 5,
                "texto": "Não há margem operacional ou rotas alternativas padronizadas para absorver picos de trânsito externo nos horários de pico."
              }
            ],
            "causaRaiz": "Dependência de vias externas congestionadas (BH Shopping, Anel Rodoviário, BR-040/381) somada a anomalias contratadas pontuais, sem margem operacional para compensar atrasos no turno da tarde.",
            "solucao": [
              "Estudos de rotas com maior recorrência de atraso em Vargem Grande e Paraopeba Norte.",
              "Atuação com CCO de Itabirito para garantir início da rota Rio Negro no horário previsto.",
              "Monitoramento reforçado dos complexos VGR e MUT/CPX nos dias de pico de trânsito."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Rio Negro: atuar com o CCO de Itabirito para garantir o início da rota no horário previsto.",
                "responsavel": "Portos Sul / Rio Negro",
                "status": "Em andamento"
              },
              {
                "numero": 2,
                "descricao": "Estudos das rotas com maior recorrência de atraso em Vargem Grande (ADM: CONT-02, BET-01, BH-A01; TURNO: RAC-T14, CONT-T09).",
                "responsavel": "Clarice Lima",
                "status": "Em andamento"
              },
              {
                "numero": 3,
                "descricao": "Estudos das rotas com maior recorrência de atraso em Paraopeba Norte (TURNO: CONT-T04 CPX letra D).",
                "responsavel": "Davidson Storck",
                "status": "Em andamento"
              }
            ],
            "observacoes": [
              "Fator Vale: 0 atrasos em jun/26.",
              "Dias críticos: 01 (carreta quebrada BH Shopping), 10 (trânsito BH/Jardim Vitória), 12 (acidentes Alphaville/BR-040), 16 (obras recapeamento, 33 atrasos), 24 (trânsito BH/BR-040/N. Sra. Carmo), 30 (obras Posto Tubarão + Anel Rodoviário).",
              "Análise de rotas dos últimos 3 meses para priorizar melhorias em linhas ADM e turno.",
              "Desempenho por complexo jun/26: Portos 98,46%, Sul 96,17%, VGR 89,54%, FAB/VIG 98,44%, MUT/CPX 92,71%."
            ],
            "fatoresAtraso": {
              "externo": "Principal ofensor — trânsito e obras",
              "contratada": 8,
              "vale": 0
            }
          }
        },
        {
          "id": "serrasul",
          "nome": "Serra Sul",
          "nivel": "VP-3",
          "parentId": "vp2-norte",
          "analise": {
            "status": "below",
            "statusLabel": "",
            "positivos": [],
            "negativos": []
          },
          "series": {
            "barPrimaryLabel": "Total de viagens",
            "barSecondaryLabel": "Viagens pontuais",
            "lineLabel": "PTL",
            "barPrimary": [
              1462,
              1370,
              1629,
              1436,
              1622,
              1569
            ],
            "barSecondary": [
              1440,
              1350,
              1613,
              1426,
              1598,
              1559
            ],
            "line": [
              98.5,
              98.54,
              99.02,
              99.3,
              98.52,
              99.36
            ]
          }
        },
        {
          "id": "sudeste",
          "nome": "Sudeste",
          "nivel": "VP-3",
          "parentId": "vp2-sul",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Roteiro convencional pós-São João em Barão de Cocais retomado (ação concluída).",
              "Planos definidos: antecipação de saídas (17/07) e reunião Minas Centrais (16/07)."
            ],
            "negativos": [
              "PTL 95,73% vs meta 96,60% (-0,87 p.p.).",
              "Complexo Minas Centrais impactado por BR-381, Santa Bárbara e festividades (11–27/jun).",
              "273 viagens não pontuais no mês (6.391 total)."
            ]
          },
          "series": {
            "barPrimaryLabel": "Total de viagens",
            "barSecondaryLabel": "Viagens pontuais",
            "lineLabel": "PTL",
            "barPrimary": [
              6313,
              5663,
              6599,
              6183,
              6422,
              6391
            ],
            "barSecondary": [
              6010,
              5383,
              6367,
              5963,
              6206,
              6118
            ],
            "line": [
              95.2,
              95.06,
              96.48,
              96.44,
              96.64,
              95.73
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pdf",
            "arquivo": "MCS - Pontualidade Junho.pdf",
            "titulo": "MCS – Pontualidade | Corredor Sudeste",
            "gerencia": "Sudeste",
            "gerenciaId": "sudeste",
            "indicador": "Pontualidade",
            "referencia": "jun/26",
            "modelo": "IC Transporte — Pontualidade Sede-Residência",
            "pilar": "Gestão",
            "kpi": "IC Transporte — Pontualidade x Sede-Residência (%)",
            "real": "95,73%",
            "meta": "96,60%",
            "gap": "-0,87 p.p.",
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "motivo": "Pontualidade de 95,73% em jun/26 (6.118 viagens pontuais de 6.391 totais), abaixo da meta 96,60%. Impacto concentrado no complexo Minas Centrais (Brucutu) por obras na BR-381, obras em Santa Bárbara e festividades em Barão de Cocais.",
            "causasPrincipais": [
              "Pequenas obras na BR-381 afetando deslocamento e chegada no site de Brucutu (Minas Centrais).",
              "Obras de infraestrutura urbana em Santa Bárbara — bairro Tenente Carlos — atrasando turno, ADM operacional e administrativo.",
              "Festividades em Barão de Cocais (11 a 27/jun) com lentidão, desvios e alterações no tráfego local."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "A pontualidade ficou abaixo da meta porque colaboradores dos complexos — especialmente Minas Centrais — chegaram com atraso à Vale em jun/26."
              },
              {
                "nivel": 2,
                "texto": "Os atrasos ocorreram por interferências externas nas vias de acesso (BR-381, Santa Bárbara e Barão de Cocais)."
              },
              {
                "nivel": 3,
                "texto": "Obras viárias e festividades locais alteraram fluxo e tempo de percurso sem margem de compensação nos horários de embarque."
              },
              {
                "nivel": 4,
                "texto": "Linhas tiveram roteiros ajustados temporariamente (São João em Barão de Cocais) sem retorno imediato ao roteiro convencional."
              },
              {
                "nivel": 5,
                "texto": "Não há protocolo de antecipação sistemática de saídas quando há obras programadas nas rotas do complexo."
              }
            ],
            "causaRaiz": "Interferências externas recorrentes (obras BR-381/Santa Bárbara e eventos em Barão de Cocais) sem ajuste preventivo de horários e roteiros no complexo Minas Centrais.",
            "solucao": [
              "Retomar roteiro convencional das linhas ajustadas por São João em Barão de Cocais.",
              "Negociar com RT antecipação da saída das linhas afetadas pelas obras de Santa Bárbara.",
              "Resgatar ações de produtividade do trabalho realizado durante COVID-19 com equipe Minas Centrais."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Retomar o roteiro convencional das linhas que sofreram ajustes em função das atividades de São João em Barão de Cocais.",
                "responsavel": "Gestão Transporte Sudeste",
                "status": "Concluída"
              },
              {
                "numero": 2,
                "descricao": "Negociar com RT antecipação da saída das linhas afetadas pelas obras de Santa Bárbara.",
                "responsavel": "Gestão Transporte Sudeste / RT",
                "status": "Prazo 17/07/26"
              },
              {
                "numero": 3,
                "descricao": "Reunião com equipe de Minas Centrais para resgatar ações do trabalho de produtividade realizado durante o COVID-19.",
                "responsavel": "Gestão Transporte Sudeste",
                "status": "Prazo 16/07/26"
              }
            ],
            "observacoes": [
              "Total jun/26: 6.391 viagens, 6.118 pontuais (95,73%).",
              "Análise macro por complexo: Itabira, Mariana, Minas Centrais.",
              "Minas Centrais (Brucutu) concentrou os principais fatores de atraso do mês."
            ]
          }
        },
        {
          "id": "sls-efc",
          "nome": "São Luis e EFC",
          "nivel": "VP-3",
          "parentId": "vp2-norte",
          "analise": {
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "positivos": [
              "Acumulado jan–jun 96,05% — próximo da meta.",
              "GERTAXI REG II e VIX REG III com 100% de pontualidade em jun/26.",
              "Plano estruturado com 3 ações da Coord. Transporte (Letícia)."
            ],
            "negativos": [
              "PTL jun/26 94,63% vs meta 96,60% (-1,97 p.p.).",
              "39 atrasos (34%) nas rotas TN-02, TN-13, TO-02 e TO-10.",
              "PARVI RCR 94,15% e CIA Transportes 89,23% puxaram o indicador para baixo."
            ]
          },
          "series": {
            "barPrimaryLabel": "Total de viagens",
            "barSecondaryLabel": "Viagens pontuais",
            "lineLabel": "PTL",
            "barPrimary": [
              2177,
              2092,
              2438,
              2244,
              2344,
              2290
            ],
            "barSecondary": [
              2160,
              2025,
              2340,
              2141,
              2182,
              2167
            ],
            "line": [
              99.22,
              96.8,
              95.98,
              95.41,
              93.09,
              94.63
            ]
          },
          "mcs": {
            "layout": "kpi",
            "fonte": "pdf",
            "arquivo": "MCS modelo EO (Pontualidade) Junho.pdf",
            "titulo": "MCS – Taxa de Pontualidade | São Luís & EFC",
            "gerencia": "São Luis e EFC",
            "gerenciaId": "sls-efc",
            "indicador": "Pontualidade",
            "referencia": "jun/26",
            "modelo": "Indicador de gestão — Taxa de Pontualidade",
            "atualizadoEm": "13/07/2026",
            "pilar": "Gestão",
            "kpi": "Taxa de Pontualidade",
            "real": "94,63%",
            "meta": "96,60%",
            "gap": "-1,97 p.p.",
            "acumulado": "96,05%",
            "status": "below",
            "statusLabel": "Indicador abaixo da referência",
            "motivo": "PTL de 94,63% em jun/26 (2.167 viagens pontuais de 2.290). Rotas do turno noite da região metropolitana (TN-02, TN-13, TO-02, TO-10) concentraram 39 atrasos (34% do total), impactados por trânsito externo e obras com pare e siga.",
            "causasPrincipais": [
              "Rotas metropolitanas TN-02, TN-13, TO-02 e TO-10 — 39 atrasos (34,21%) por engarrafamentos externos.",
              "Obras viárias com pare e siga na descida de Carajás e vias externas — retenção imprevisível.",
              "Rotas intermunicipais longas com excesso de paradas e início tardio das viagens (ex.: TN-13)."
            ],
            "porques": [
              {
                "nivel": 1,
                "texto": "Rotas do turno noite ficaram retidas nas vias externas da Vale, causando 149 atrasos — veículo do lote 04 recorrentemente em pare e siga na descida de Carajás."
              },
              {
                "nivel": 2,
                "texto": "Obras viárias estavam sendo executadas no local; rotas TN-02, TN-13, TO-02 e TO-10 (região metropolitana) somaram 39 atrasos no mês."
              },
              {
                "nivel": 3,
                "texto": "Tempo de retenção variável e não previsível, aumentando o percurso além do planejado em rotas intermunicipais com muitas paradas."
              },
              {
                "nivel": 4,
                "texto": "Evento externo temporário, gestão de terceiros, sem controle direto da operação e sem janela fixa de liberação viária."
              }
            ],
            "causaRaiz": "Interferência externa na malha viária (obras com pare e siga), somada à má distribuição de pontos de embarque e excesso de paradas em rotas longas do turno noite, comprometendo o cumprimento dos horários.",
            "solucao": [
              "Implantar medidas preventivas e mitigatórias de gestão do risco rodoviário.",
              "Revisar e otimizar horários com margem para absorção de imprevistos.",
              "Monitorar horário real de início das rotas no ponto de embarque inicial.",
              "Estudar mobilidade alternativa para usuários dos pontos iniciais das rotas críticas."
            ],
            "acoes": [
              {
                "numero": 1,
                "descricao": "Implementar nova distribuição de pontos de parada para rotas críticas (TO-02, TO-10, TN-13, TN-02).",
                "responsavel": "Letícia — Coord. Transporte",
                "status": "Em aberto — 20/07/2026"
              },
              {
                "numero": 2,
                "descricao": "Monitorar o horário real de início das rotas no ponto de embarque inicial.",
                "responsavel": "Letícia — Coord. Transporte",
                "status": "Contínuo — Em aberto"
              },
              {
                "numero": 3,
                "descricao": "Identificar usuários dos pontos iniciais das rotas críticas e estudar meios alternativos de mobilidade.",
                "responsavel": "Letícia — Coord. Transporte",
                "status": "Em aberto — 22/08/2026"
              }
            ],
            "rotasCriticas": [
              {
                "rota": "TN-02",
                "atrasos": 15,
                "percentual": "13,16%",
                "pontos": 43
              },
              {
                "rota": "TN-13",
                "atrasos": 11,
                "percentual": "9,65%",
                "pontos": 44
              },
              {
                "rota": "TO-02",
                "atrasos": 8,
                "percentual": "7,02%",
                "pontos": 46
              },
              {
                "rota": "TO-10",
                "atrasos": 5,
                "percentual": "4,39%",
                "pontos": 53
              }
            ],
            "observacoes": [
              "Total jun/26: 2.290 viagens, 2.167 pontuais, 123 atrasos.",
              "PARVI RCR: 94,15% · CIA Transportes: 89,23% · GERTAXI/VIX: 96–100%.",
              "Acumulado jan–jun/26: 96,05% (gap -0,55 p.p. vs meta)."
            ]
          }
        }
      ],
      "mcsConsolidado": {
        "layout": "kpi",
        "referencia": "jun/26",
        "tipo": "vp1",
        "titulo": "MCS – Pontualidade | VP-1 Consolidado",
        "indicador": "Pontualidade",
        "real": "96,18%",
        "meta": "96,60%",
        "status": "below",
        "statusLabel": "Indicador abaixo da referência",
        "motivo": "Jun/26 consolidado VP-1: PTL 96,18% (meta 96,60%, gap -0,42 p.p.). Apesar do consolidado numérico próximo da meta, as duas diretorias reportam atrasos recorrentes e processos em estabilização.",
        "porques": [
          {
            "nivel": 1,
            "texto": "Por que PTL VP-1 abaixo da meta? → Atrasos recorrentes Norte (SL/Carajás) e Sul (VGR/Mariana)."
          },
          {
            "nivel": 2,
            "texto": "Por que externo domina? → Obras, pare e siga, congestionamento metropolitano."
          },
          {
            "nivel": 3,
            "texto": "Por que ações não estabilizaram? → Roteirização reativa; normalização de atrasos (alerta Elida)."
          },
          {
            "nivel": 4,
            "texto": "Por quê isso persiste? → malha externa instável + gestão por rota ainda imatura."
          },
          {
            "nivel": 5,
            "texto": "Por que a operação não absorve imprevistos? → Horários e rotas planejados sem margem para obras, trânsito externo e eventos — roteirização ainda reativa."
          }
        ],
        "causaRaiz": "Operação dependente de malha viária externa instável (obras, congestionamento, eventos) combinada com roteirização reativa e falta de margem nos horários — exigindo gestão por rota crítica e integração preventiva entre gerências.",
        "solucao": [
          "Plano transversal de rotas críticas com antecipação seletiva e contingenciamento (Norte + Sul).",
          "BI e estratificação por linha/turno/complexo — não normalizar atrasos (Elida).",
          "Leitura processo → causa → ação em fórum executivo (Mario).",
          "Integração RH/Transportes para admissões e treinamentos que impactam pontualidade."
        ],
        "categoria": "Método",
        "categorias": [
          "Material",
          "Mão de obra",
          "Máquina",
          "Método"
        ],
        "acaoSalvadora": "Plano transversal de rotas críticas com antecipação seletiva e contingenciamento (Norte + Sul)."
      },
      "mcsVp2": {
        "vp2-norte": {
          "layout": "kpi",
          "referencia": "jun/26",
          "gerenciaId": "vp2-norte",
          "gerencia": "Serviços Operacionais Norte",
          "indicador": "Pontualidade",
          "real": "95,20%",
          "meta": "96,60%",
          "status": "below",
          "statusLabel": "Indicador abaixo da referência",
          "motivo": "Carajás: 95,7% — pare e siga Parauapebas, rotas ASN/TC críticas. SLS EFC: 94,63% — turno noite metropolitano (TN-02, TN-13, TO-02, TO-10). Serra Sul: estabilização pendente — estratificar por linha/turno.",
          "causaRaiz": "Dependência de vias externas (obras, pare e siga, trânsito metropolitano) sem margem operacional e roteirização ainda reativa, necessitando antecipação seletiva por rota crítica.",
          "solucao": [
            "Contingenciamento e revisão dinâmica de horários (Carajás).",
            "Redistribuição de paradas e monitoramento turno noite (SLS EFC).",
            "Estratificação e otimização de rotas por linha/turno (Serra Sul).",
            "Antecipação seletiva de viagens críticas e integração com RH."
          ],
          "porques": [
            {
              "nivel": 1,
              "texto": "Por que PTL Norte abaixo? → Trânsito externo + rotas metropolitanas SL + acesso Carajás."
            },
            {
              "nivel": 2,
              "texto": "Por que obras impactam tanto? → Pare e siga, BR-381, portaria Parauapebas sem contingência padronizada."
            },
            {
              "nivel": 3,
              "texto": "Por que Serra Sul sem MCS? → Estratificação por rota/turno ainda em maturação (Vladimir)."
            },
            {
              "nivel": 4,
              "texto": "Por quê isso persiste? → vias externas + roteirização reativa."
            },
            {
              "nivel": 5,
              "texto": "Por que rotas críticas não estabilizam? → Falta de contingência padronizada para pare e siga, trânsito metropolitano SL e acessos a Carajás."
            }
          ],
          "fonteReuniao": "vp2-norte-transportes-jun26",
          "categoria": "Método",
          "categorias": [
            "Material",
            "Mão de obra",
            "Máquina",
            "Método"
          ],
          "acaoSalvadora": "Contingenciamento viário, redistribuição de paradas no turno noite SL e estratificação por rota/turno com antecipação seletiva."
        },
        "vp2-sul": {
          "layout": "kpi",
          "referencia": "jun/26",
          "gerencia": "Serviços Operacionais Sul",
          "gerenciaId": "vp2-sul",
          "indicador": "Pontualidade",
          "real": "96,66%",
          "meta": "96,60%",
          "status": "above",
          "statusLabel": "Meta atingida no consolidado numérico",
          "motivo": "Consolidado VP-2 Sul 96,66% (soma viagens), porém reunião reporta meta não atingida nas gerências individualmente — foco em atrasos recorrentes.",
          "causaRaiz": "Fatores externos recorrentes (obras, congestionamento, acidentes) sem margem operacional e ações preventivas padronizadas por rota, conforme direcionamento da diretoria.",
          "solucao": [
            "Análise e ajuste de horários/trajetos nas rotas críticas (VGR, MUT/CPX, Mariana/Brucutu).",
            "Antecipação de saídas e uso de BI para identificar pontos críticos.",
            "Estudos de rotas em andamento (Sul) e retomada de roteiros pós-eventos (Sudeste)."
          ],
          "porques": [
            {
              "nivel": 1,
              "texto": "Por que pontualidade é tema central na DIR SUL? → Atrasos recorrentes em VGR, Mariana e rotas metropolitanas."
            },
            {
              "nivel": 2,
              "texto": "Por que obras externas impactam? → BH Shopping, BR-381, Santa Bárbara, Anel Rodoviário."
            },
            {
              "nivel": 3,
              "texto": "Por que ações não fecharam gap? → Falta de abordagem sistêmica por rota e normalização de atrasos (direcionamento Elida)."
            },
            {
              "nivel": 4,
              "texto": "Por quê isso persiste? → dependência de vias externas + ações corretivas ainda em curso por gerência."
            },
            {
              "nivel": 5,
              "texto": "Por que atrasos se repetem? → Rotas VGR/Mariana/Brucutu dependem de vias externas sem plano transversal de antecipação e BI por linha."
            }
          ],
          "fonteReuniao": "vp2-sul-transportes-jun26",
          "categoria": "Método",
          "categorias": [
            "Material",
            "Mão de obra",
            "Máquina",
            "Método"
          ],
          "acaoSalvadora": "Plano sistêmico por rota crítica (VGR, Mariana, Brucutu) com BI, antecipação de saídas e proibição de normalizar atrasos."
        }
      },
      "vp2Series": {
        "vp2-norte": {
          "barPrimaryLabel": "Total de viagens",
          "barSecondaryLabel": "Viagens pontuais",
          "lineLabel": "PTL",
          "barPrimary": [
            7942.0,
            7225.0,
            8628.0,
            7926.0,
            7520.0,
            8099.0
          ],
          "barSecondary": [
            7579.0,
            6803.0,
            7929.0,
            7432.0,
            7159.0,
            7783.0
          ],
          "line": [
            95.42936288088643,
            94.159169550173,
            91.89847009735745,
            93.76734796871057,
            95.19946808510639,
            96.09828373873319
          ]
        },
        "vp2-sul": {
          "barPrimaryLabel": "Total de viagens",
          "barSecondaryLabel": "Viagens pontuais",
          "lineLabel": "PTL",
          "barPrimary": [
            16204.0,
            13596.0,
            16115.0,
            14987.0,
            15641.0,
            14389.0
          ],
          "barSecondary": [
            15713.0,
            12993.0,
            15533.0,
            14448.0,
            15118.0,
            13809.0
          ],
          "line": [
            96.96988397926438,
            95.5648720211827,
            96.38845795842383,
            96.40354974311069,
            96.65622402659676,
            95.96914309542012
          ]
        }
      }
    }
  },
  "vp1Preview": {
    "melhorArea": {
      "id": "sul",
      "nome": "Sul",
      "valor": 41468.333
    },
    "piorArea": {
      "id": "serrasul",
      "nome": "Serra Sul",
      "valor": 270.778
    },
    "acoesPrioritarias": [
      {
        "gerenciaId": "tu-efvm",
        "gerencia": "TU e EFVM",
        "numero": 1,
        "descricao": "Notificar todos os usuários e líderes da obrigatoriedade de comunicar de forma antecipada.",
        "responsavel": "Gestão Transporte TU/EFVM",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "tu-efvm",
        "gerencia": "TU e EFVM",
        "numero": 2,
        "descricao": "Criar fluxo padrão de reserva programada (agendamento de assento).",
        "responsavel": "Gestão Transporte TU/EFVM",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "tu-efvm",
        "gerencia": "TU e EFVM",
        "numero": 3,
        "descricao": "Validar com áreas e RH para novos funcionários serem cadastrados no momento da ambientação.",
        "responsavel": "RH / Áreas requisitantes",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "tu-efvm",
        "gerencia": "TU e EFVM",
        "numero": 4,
        "descricao": "Fidelização dos passageiros com identificação do crachá.",
        "responsavel": "Operação TU/EFVM",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "tu-efvm",
        "gerencia": "TU e EFVM",
        "numero": 5,
        "descricao": "Mobilização de 03 recursos para absorção de demanda.",
        "responsavel": "Planejamento TU/EFVM",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "sul",
        "gerencia": "Sul",
        "numero": 1,
        "descricao": "Projeto Cadastro de Passageiros em parceria com fornecedora Vuse.",
        "responsavel": "Alice Lemos",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "sul",
        "gerencia": "Sul",
        "numero": 2,
        "descricao": "Alinhamento com a gestão de contratos da operação sobre divulgação de novas contratações cuja responsabilidade do transporte seja Vale (nova parametrização).",
        "responsavel": "Gestão de Contratos Operação",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "serrasul",
        "gerencia": "Serra Sul",
        "numero": 1,
        "descricao": "Veículo de apoio em stand-by e grupo WhatsApp para atendimento on-line às rotas críticas.",
        "responsavel": "Francisco Junior / Maidria Maia",
        "status": "Contínua"
      },
      {
        "gerenciaId": "serrasul",
        "gerencia": "Serra Sul",
        "numero": 2,
        "descricao": "Análise da lotação das rotas para identificar ajustes na roteirização e/ou novas mobilizações.",
        "responsavel": "Francisco Junior / Maidria Maia",
        "status": "Contínua"
      },
      {
        "gerenciaId": "serrasul",
        "gerencia": "Serra Sul",
        "numero": 3,
        "descricao": "Comunicação prévia entre áreas quando houver migração relevante de passageiros entre regimes.",
        "responsavel": "Francisco Junior",
        "status": "Contínua"
      },
      {
        "gerenciaId": "serrasul",
        "gerencia": "Serra Sul",
        "numero": 4,
        "descricao": "Reaproveitamento de 1 micro-ônibus para absorção de overbookings nas rotas turno UT01, UT02 e UT03.",
        "responsavel": "Francisco Junior",
        "status": "16/06/2026"
      },
      {
        "gerenciaId": "serrasul",
        "gerencia": "Serra Sul",
        "numero": 5,
        "descricao": "Mobilização de 2 ônibus para absorção de overbookings nas rotas administrativas.",
        "responsavel": "Francisco Junior",
        "status": "30/07/2026"
      },
      {
        "gerenciaId": "serrasul",
        "gerencia": "Serra Sul",
        "numero": 6,
        "descricao": "Saneamento da base de cadastro para trazer informação correta dos passageiros por rota.",
        "responsavel": "Francisco Junior",
        "status": "Contínua"
      },
      {
        "gerenciaId": "sudeste",
        "gerencia": "Sudeste",
        "numero": 1,
        "descricao": "Manutenção do reforço de frota até a normalização da ocupação. Descontinuidade do recurso extra em 09/07.",
        "responsavel": "Planejamento Operacional Sudeste",
        "status": "Em andamento"
      },
      {
        "gerenciaId": "sudeste",
        "gerencia": "Sudeste",
        "numero": 2,
        "descricao": "Levantamento de credenciamento nas linhas.",
        "responsavel": "Gestão Transporte Sudeste",
        "status": "Concluído em 10/07"
      },
      {
        "gerenciaId": "sudeste",
        "gerencia": "Sudeste",
        "numero": 3,
        "descricao": "Implementação de card de credencial por linha.",
        "responsavel": "Gestão Transporte Sudeste",
        "status": "Prazo 30/09"
      },
      {
        "gerenciaId": "sudeste",
        "gerencia": "Sudeste",
        "numero": 4,
        "descricao": "Estudo para implantação de catracas.",
        "responsavel": "Gestão Transporte Sudeste",
        "status": "Prazo 30/09"
      },
      {
        "gerenciaId": "sudeste",
        "gerencia": "Sudeste",
        "numero": 5,
        "descricao": "Estudo de implementação do sistema VUSE (replicação do teste do Corredor Norte).",
        "responsavel": "Gestão Transporte Sudeste",
        "status": "Prazo 30/09"
      },
      {
        "gerenciaId": "sls-efc",
        "gerencia": "São Luis e EFC",
        "numero": 1,
        "descricao": "Acompanhar semanalmente rotas com ocupação acima de 80% e histórico de overbooking (ex.: ROF-02).",
        "responsavel": "Gestão Transporte SLS EFC",
        "status": "Contínua"
      },
      {
        "gerenciaId": "sls-efc",
        "gerencia": "São Luis e EFC",
        "numero": 2,
        "descricao": "Formalizar comunicação com PARVI RCR sobre evento de 09/06 e plano preventivo para rota ROF-02.",
        "responsavel": "Coord. Operacional",
        "status": "Em andamento"
      }
    ],
    "indicatorId": "ovbk",
    "nivel": "VP-1",
    "referencia": "jun/26"
  },
  "analisesPorEscopo": {
    "ovbk": {
      "vp1": {
        "titulo": "OVBK — VP-1",
        "status": "below",
        "statusLabel": "Indicador abaixo da referência",
        "paragrafos": [
          "Jun/26: taxa 866 (meta 1.577), recuperação tímida vs. mai/26 (719→866), 45% abaixo da referência — pressionado por Serra Sul e Sudeste, com demanda não planejada acima da capacidade.",
          "**Norte** — Serra Sul puxa o desempenho: 212 excedentes, overbooking em ~20 dias e cadastro frágil (190 novos cadastros, 453 avulsas), com lotação crítica em UT01–UT03 e migração entre regimes sem aviso. Carajás, São Luis e EFC com picos por demanda não sinalizada — admissões, treinamentos e entradas fora do planejamento de frota.",
          "**Sul** — Sudeste concentra 380 excedentes (Santa Bárbara/Fazendão), com ônibus extra e acompanhamento diário. Sul/TU/EFVM na meta após novas linhas e sinalização, mas expostos a picos — cadastro por linha e aviso antecipado são prioritários."
        ]
      },
      "vp2-norte": {
        "titulo": "OVBK — VP-2 Norte",
        "status": "below",
        "statusLabel": "Indicador abaixo da referência",
        "paragrafos": [
          "Mario Jofre (DIR Norte) direcionou leitura por processo: OVBK reflete previsibilidade de demanda, não apenas resultado numérico. Narrativa: resultado → processo → causa raiz → ação.",
          "Carajás (Rodolfo): demanda acima do planejado — integração RH/Transportes e contingência de rota. São Luís (Rafael): oscilação por admissões/treinamentos — onboarding integrado. Serra Sul (Vladimir): risco por cadastro frágil — 190 cadastros e 453 avulsas em jun/26.",
          "Consolidado numérico jun/26 VP-2 Norte: taxa ~913 (meta 1.577). SLS EFC destaque positivo (10.331); pressão em Serra Sul (271) e pico histórico Carajás em meses anteriores."
        ]
      },
      "vp2-sul": {
        "titulo": "OVBK — VP-2 Sul",
        "status": "below",
        "statusLabel": "Atenção — Sudeste abaixo da meta",
        "paragrafos": [
          "Na reunião de performance da DIR SUL, Sul (Simone) e TU/EFVM (Domingos) reportaram meta de overbooking atingida após inclusão de novas linhas, adesivos de sinalização e monitoramento diário, com casos pontuais controlados.",
          "Sudeste (Livia) permaneceu como principal ponto de atenção: lotação acima do previsto na rota Santa Bárbara → Fazendão (380 excedentes em jun/26, taxa 417), com ônibus extra implementado e acompanhamento da demanda.",
          "Causas recorrentes na diretoria: aumento de demanda, lotação insuficiente e gaps de sinalização. Diretoria (Elida) reforçou abordagem sistêmica, ações por rota e uso de BI — sem normalizar desvios."
        ]
      }
    },
    "ptl": {
      "vp1": {
        "titulo": "PTL — VP-1",
        "status": "below",
        "statusLabel": "Indicador abaixo da referência",
        "paragrafos": [
          "Jun/26 consolidado VP-1: PTL 96,02% (meta 96,60%, gap -0,58 p.p.). Apesar do consolidado numérico próximo da meta, as duas diretorias reportam atrasos recorrentes e processos em estabilização.",
          "**Norte** — Dependência de vias externas: pare e siga, obras BR-381/Santa Bárbara, trânsito metropolitano SL (rotas TN/TO). Carajás 95,7%, SLS EFC 94,63% — turno noite concentra 34% dos atrasos.",
          "**Sul** — VGR/MUT/CPX, Mariana/Brucutu e rotas metropolitanas com obras e congestionamento. Elida reforça abordagem sistêmica por rota, BI e proibição de normalizar atrasos."
        ]
      },
      "vp2-norte": {
        "titulo": "PTL — VP-2 Norte",
        "status": "below",
        "statusLabel": "Indicador abaixo da referência",
        "paragrafos": [
          "DIR Norte: PTL deve ser lido por rota e fator externo vs operacional — obras, pare e siga, trânsito metropolitano exigem roteirização dinâmica.",
          "Carajás: 95,7% — pare e siga Parauapebas, rotas ASN/TC críticas. SLS EFC: 94,63% — turno noite metropolitano (TN-02, TN-13, TO-02, TO-10). Serra Sul: estabilização pendente — estratificar por linha/turno.",
          "Consolidado numérico jun/26 VP-2 Norte: 95,20% (meta 96,60%). Principal gap: região metropolitana SL + vias de acesso Carajás."
        ]
      },
      "vp2-sul": {
        "titulo": "PTL — VP-2 Sul",
        "status": "below",
        "statusLabel": "Meta não atingida na diretoria",
        "paragrafos": [
          "Nenhuma gerência da DIR SUL reportou meta de pontualidade atingida em jun/26. Sul (Simone): atrasos recorrentes em Vargem Grande, Mutuca e Capão Xavier por obras externas, congestionamentos, acidentes e baldeio.",
          "Sudeste (Livia): atrasos em linhas de mina por obras (BR-381, Santa Bárbara) e festividades em Barão de Cocais. TU/EFVM (Domingos): atrasos recorrentes por fatores externos e internos, sem arquivo MCS detalhado.",
          "Elida (DIR SUL) direcionou abordagem sistêmica: análise detalhada por rota, ações específicas, BI para pontos críticos, antecipação de saídas e proibição de normalizar atrasos."
        ]
      }
    }
  },
  "slidePreviews": {
    "ovbk": {
      "vp1": {
        "melhorArea": {
          "id": "sul",
          "nome": "Sul",
          "valor": 41468.333
        },
        "piorArea": {
          "id": "serrasul",
          "nome": "Serra Sul",
          "valor": 270.778
        },
        "acoesPrioritarias": [
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 1,
            "descricao": "Notificar todos os usuários e líderes da obrigatoriedade de comunicar de forma antecipada.",
            "responsavel": "Gestão Transporte TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 2,
            "descricao": "Criar fluxo padrão de reserva programada (agendamento de assento).",
            "responsavel": "Gestão Transporte TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 3,
            "descricao": "Validar com áreas e RH para novos funcionários serem cadastrados no momento da ambientação.",
            "responsavel": "RH / Áreas requisitantes",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 4,
            "descricao": "Fidelização dos passageiros com identificação do crachá.",
            "responsavel": "Operação TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 5,
            "descricao": "Mobilização de 03 recursos para absorção de demanda.",
            "responsavel": "Planejamento TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 1,
            "descricao": "Projeto Cadastro de Passageiros em parceria com fornecedora Vuse.",
            "responsavel": "Alice Lemos",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 2,
            "descricao": "Alinhamento com a gestão de contratos da operação sobre divulgação de novas contratações cuja responsabilidade do transporte seja Vale (nova parametrização).",
            "responsavel": "Gestão de Contratos Operação",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 1,
            "descricao": "Veículo de apoio em stand-by e grupo WhatsApp para atendimento on-line às rotas críticas.",
            "responsavel": "Francisco Junior / Maidria Maia",
            "status": "Contínua"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 2,
            "descricao": "Análise da lotação das rotas para identificar ajustes na roteirização e/ou novas mobilizações.",
            "responsavel": "Francisco Junior / Maidria Maia",
            "status": "Contínua"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 3,
            "descricao": "Comunicação prévia entre áreas quando houver migração relevante de passageiros entre regimes.",
            "responsavel": "Francisco Junior",
            "status": "Contínua"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 4,
            "descricao": "Reaproveitamento de 1 micro-ônibus para absorção de overbookings nas rotas turno UT01, UT02 e UT03.",
            "responsavel": "Francisco Junior",
            "status": "16/06/2026"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 5,
            "descricao": "Mobilização de 2 ônibus para absorção de overbookings nas rotas administrativas.",
            "responsavel": "Francisco Junior",
            "status": "30/07/2026"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 6,
            "descricao": "Saneamento da base de cadastro para trazer informação correta dos passageiros por rota.",
            "responsavel": "Francisco Junior",
            "status": "Contínua"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 1,
            "descricao": "Manutenção do reforço de frota até a normalização da ocupação. Descontinuidade do recurso extra em 09/07.",
            "responsavel": "Planejamento Operacional Sudeste",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 2,
            "descricao": "Levantamento de credenciamento nas linhas.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Concluído em 10/07"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 3,
            "descricao": "Implementação de card de credencial por linha.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 30/09"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 4,
            "descricao": "Estudo para implantação de catracas.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 30/09"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 5,
            "descricao": "Estudo de implementação do sistema VUSE (replicação do teste do Corredor Norte).",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 30/09"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 1,
            "descricao": "Acompanhar semanalmente rotas com ocupação acima de 80% e histórico de overbooking (ex.: ROF-02).",
            "responsavel": "Gestão Transporte SLS EFC",
            "status": "Contínua"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 2,
            "descricao": "Formalizar comunicação com PARVI RCR sobre evento de 09/06 e plano preventivo para rota ROF-02.",
            "responsavel": "Coord. Operacional",
            "status": "Em andamento"
          }
        ],
        "indicatorId": "ovbk",
        "nivel": "VP-1",
        "referencia": "jun/26"
      },
      "vp2-norte": {
        "melhorArea": {
          "id": "sls-efc",
          "nome": "São Luis e EFC",
          "valor": 10335.714
        },
        "piorArea": {
          "id": "serrasul",
          "nome": "Serra Sul",
          "valor": 270.778
        },
        "acoesPrioritarias": [
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 1,
            "descricao": "Veículo de apoio em stand-by e grupo WhatsApp para atendimento on-line às rotas críticas.",
            "responsavel": "Francisco Junior / Maidria Maia",
            "status": "Contínua"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 2,
            "descricao": "Análise da lotação das rotas para identificar ajustes na roteirização e/ou novas mobilizações.",
            "responsavel": "Francisco Junior / Maidria Maia",
            "status": "Contínua"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 3,
            "descricao": "Comunicação prévia entre áreas quando houver migração relevante de passageiros entre regimes.",
            "responsavel": "Francisco Junior",
            "status": "Contínua"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 4,
            "descricao": "Reaproveitamento de 1 micro-ônibus para absorção de overbookings nas rotas turno UT01, UT02 e UT03.",
            "responsavel": "Francisco Junior",
            "status": "16/06/2026"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 5,
            "descricao": "Mobilização de 2 ônibus para absorção de overbookings nas rotas administrativas.",
            "responsavel": "Francisco Junior",
            "status": "30/07/2026"
          },
          {
            "gerenciaId": "serrasul",
            "gerencia": "Serra Sul",
            "numero": 6,
            "descricao": "Saneamento da base de cadastro para trazer informação correta dos passageiros por rota.",
            "responsavel": "Francisco Junior",
            "status": "Contínua"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 1,
            "descricao": "Acompanhar semanalmente rotas com ocupação acima de 80% e histórico de overbooking (ex.: ROF-02).",
            "responsavel": "Gestão Transporte SLS EFC",
            "status": "Contínua"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 2,
            "descricao": "Formalizar comunicação com PARVI RCR sobre evento de 09/06 e plano preventivo para rota ROF-02.",
            "responsavel": "Coord. Operacional",
            "status": "Em andamento"
          }
        ]
      },
      "vp2-sul": {
        "melhorArea": {
          "id": "sul",
          "nome": "Sul",
          "valor": 41468.333
        },
        "piorArea": {
          "id": "sudeste",
          "nome": "Sudeste",
          "valor": 417.211
        },
        "acoesPrioritarias": [
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 1,
            "descricao": "Notificar todos os usuários e líderes da obrigatoriedade de comunicar de forma antecipada.",
            "responsavel": "Gestão Transporte TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 2,
            "descricao": "Criar fluxo padrão de reserva programada (agendamento de assento).",
            "responsavel": "Gestão Transporte TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 3,
            "descricao": "Validar com áreas e RH para novos funcionários serem cadastrados no momento da ambientação.",
            "responsavel": "RH / Áreas requisitantes",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 4,
            "descricao": "Fidelização dos passageiros com identificação do crachá.",
            "responsavel": "Operação TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "tu-efvm",
            "gerencia": "TU e EFVM",
            "numero": 5,
            "descricao": "Mobilização de 03 recursos para absorção de demanda.",
            "responsavel": "Planejamento TU/EFVM",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 1,
            "descricao": "Projeto Cadastro de Passageiros em parceria com fornecedora Vuse.",
            "responsavel": "Alice Lemos",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 2,
            "descricao": "Alinhamento com a gestão de contratos da operação sobre divulgação de novas contratações cuja responsabilidade do transporte seja Vale (nova parametrização).",
            "responsavel": "Gestão de Contratos Operação",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 1,
            "descricao": "Manutenção do reforço de frota até a normalização da ocupação. Descontinuidade do recurso extra em 09/07.",
            "responsavel": "Planejamento Operacional Sudeste",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 2,
            "descricao": "Levantamento de credenciamento nas linhas.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Concluído em 10/07"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 3,
            "descricao": "Implementação de card de credencial por linha.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 30/09"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 4,
            "descricao": "Estudo para implantação de catracas.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 30/09"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 5,
            "descricao": "Estudo de implementação do sistema VUSE (replicação do teste do Corredor Norte).",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 30/09"
          }
        ]
      }
    },
    "ptl": {
      "vp1": {
        "melhorArea": {
          "id": "serrasul",
          "nome": "Serra Sul",
          "valor": 99.36
        },
        "piorArea": {
          "id": "sls-efc",
          "nome": "São Luis e EFC",
          "valor": 94.63
        },
        "acoesPrioritarias": [
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 1,
            "descricao": "Alinhamento com a gestão do pare e siga para priorização na passagem das rotas no fluxo.",
            "responsavel": "Ricardo / Hugo",
            "status": "Concluído — 12/06/26"
          },
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 2,
            "descricao": "Alteração de início das rotas administrativas e turno com maior índice de atrasos (ajustes de trajetos e horários).",
            "responsavel": "Wagner Silva / Roney Silva",
            "status": "Em andamento — 10/07/26"
          },
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 3,
            "descricao": "Blitz periódicas de orientação e segurança, em parceria com DMTT, para prevenir desvios comportamentais.",
            "responsavel": "Hugo Quaresma",
            "status": "Em andamento — 20/07/26"
          },
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 4,
            "descricao": "Ofício ao departamento da prefeitura para intervenção no fluxo da via de acesso de Parauapebas (interface relações institucionais Vale).",
            "responsavel": "Genildo Passos (Parvi) / Roney Silva (VIX)",
            "status": "Em andamento — 21/07/26"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 1,
            "descricao": "Rio Negro: atuar com o CCO de Itabirito para garantir o início da rota no horário previsto.",
            "responsavel": "Portos Sul / Rio Negro",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 2,
            "descricao": "Estudos das rotas com maior recorrência de atraso em Vargem Grande (ADM: CONT-02, BET-01, BH-A01; TURNO: RAC-T14, CONT-T09).",
            "responsavel": "Clarice Lima",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 3,
            "descricao": "Estudos das rotas com maior recorrência de atraso em Paraopeba Norte (TURNO: CONT-T04 CPX letra D).",
            "responsavel": "Davidson Storck",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 1,
            "descricao": "Retomar o roteiro convencional das linhas que sofreram ajustes em função das atividades de São João em Barão de Cocais.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Concluída"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 2,
            "descricao": "Negociar com RT antecipação da saída das linhas afetadas pelas obras de Santa Bárbara.",
            "responsavel": "Gestão Transporte Sudeste / RT",
            "status": "Prazo 17/07/26"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 3,
            "descricao": "Reunião com equipe de Minas Centrais para resgatar ações do trabalho de produtividade realizado durante o COVID-19.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 16/07/26"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 1,
            "descricao": "Implementar nova distribuição de pontos de parada para rotas críticas (TO-02, TO-10, TN-13, TN-02).",
            "responsavel": "Letícia — Coord. Transporte",
            "status": "Em aberto — 20/07/2026"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 2,
            "descricao": "Monitorar o horário real de início das rotas no ponto de embarque inicial.",
            "responsavel": "Letícia — Coord. Transporte",
            "status": "Contínuo — Em aberto"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 3,
            "descricao": "Identificar usuários dos pontos iniciais das rotas críticas e estudar meios alternativos de mobilidade.",
            "responsavel": "Letícia — Coord. Transporte",
            "status": "Em aberto — 22/08/2026"
          }
        ]
      },
      "vp2-norte": {
        "melhorArea": {
          "id": "serrasul",
          "nome": "Serra Sul",
          "valor": 99.36
        },
        "piorArea": {
          "id": "sls-efc",
          "nome": "São Luis e EFC",
          "valor": 94.63
        },
        "acoesPrioritarias": [
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 1,
            "descricao": "Alinhamento com a gestão do pare e siga para priorização na passagem das rotas no fluxo.",
            "responsavel": "Ricardo / Hugo",
            "status": "Concluído — 12/06/26"
          },
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 2,
            "descricao": "Alteração de início das rotas administrativas e turno com maior índice de atrasos (ajustes de trajetos e horários).",
            "responsavel": "Wagner Silva / Roney Silva",
            "status": "Em andamento — 10/07/26"
          },
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 3,
            "descricao": "Blitz periódicas de orientação e segurança, em parceria com DMTT, para prevenir desvios comportamentais.",
            "responsavel": "Hugo Quaresma",
            "status": "Em andamento — 20/07/26"
          },
          {
            "gerenciaId": "carajas",
            "gerencia": "Carajás",
            "numero": 4,
            "descricao": "Ofício ao departamento da prefeitura para intervenção no fluxo da via de acesso de Parauapebas (interface relações institucionais Vale).",
            "responsavel": "Genildo Passos (Parvi) / Roney Silva (VIX)",
            "status": "Em andamento — 21/07/26"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 1,
            "descricao": "Implementar nova distribuição de pontos de parada para rotas críticas (TO-02, TO-10, TN-13, TN-02).",
            "responsavel": "Letícia — Coord. Transporte",
            "status": "Em aberto — 20/07/2026"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 2,
            "descricao": "Monitorar o horário real de início das rotas no ponto de embarque inicial.",
            "responsavel": "Letícia — Coord. Transporte",
            "status": "Contínuo — Em aberto"
          },
          {
            "gerenciaId": "sls-efc",
            "gerencia": "São Luis e EFC",
            "numero": 3,
            "descricao": "Identificar usuários dos pontos iniciais das rotas críticas e estudar meios alternativos de mobilidade.",
            "responsavel": "Letícia — Coord. Transporte",
            "status": "Em aberto — 22/08/2026"
          }
        ]
      },
      "vp2-sul": {
        "melhorArea": {
          "id": "tu-efvm",
          "nome": "TU e EFVM",
          "valor": 96.7
        },
        "piorArea": {
          "id": "sudeste",
          "nome": "Sudeste",
          "valor": 95.73
        },
        "acoesPrioritarias": [
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 1,
            "descricao": "Rio Negro: atuar com o CCO de Itabirito para garantir o início da rota no horário previsto.",
            "responsavel": "Portos Sul / Rio Negro",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 2,
            "descricao": "Estudos das rotas com maior recorrência de atraso em Vargem Grande (ADM: CONT-02, BET-01, BH-A01; TURNO: RAC-T14, CONT-T09).",
            "responsavel": "Clarice Lima",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sul",
            "gerencia": "Sul",
            "numero": 3,
            "descricao": "Estudos das rotas com maior recorrência de atraso em Paraopeba Norte (TURNO: CONT-T04 CPX letra D).",
            "responsavel": "Davidson Storck",
            "status": "Em andamento"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 1,
            "descricao": "Retomar o roteiro convencional das linhas que sofreram ajustes em função das atividades de São João em Barão de Cocais.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Concluída"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 2,
            "descricao": "Negociar com RT antecipação da saída das linhas afetadas pelas obras de Santa Bárbara.",
            "responsavel": "Gestão Transporte Sudeste / RT",
            "status": "Prazo 17/07/26"
          },
          {
            "gerenciaId": "sudeste",
            "gerencia": "Sudeste",
            "numero": 3,
            "descricao": "Reunião com equipe de Minas Centrais para resgatar ações do trabalho de produtividade realizado durante o COVID-19.",
            "responsavel": "Gestão Transporte Sudeste",
            "status": "Prazo 16/07/26"
          }
        ]
      }
    }
  },
  "slideNav": {
    "ovbk": {
      "Norte": "vp2-norte-ovbk",
      "Sul": "vp2-sul-ovbk"
    },
    "ptl": {
      "Norte": "vp2-norte-ptl",
      "Sul": "vp2-sul-ptl"
    }
  }
};
