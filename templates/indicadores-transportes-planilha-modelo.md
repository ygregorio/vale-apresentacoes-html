# Modelo de planilha — Indicadores Transportes

Use **Excel** ou **Google Sheets** com **5 abas** (ou um CSV por aba). A estrutura abaixo espelha o layout do PPT e alimentará a geração HTML.

---

## Aba 1 — `metadados`

| campo | exemplo | obrigatório |
|-------|---------|-------------|
| diretoria | Transportes – SO Norte | sim |
| area | Coletivo | sim |
| mes_referencia | mai/26 | sim |
| meses_serie | jan/26,fev/26,mar/26,abr/26,mai/26 | sim (5 meses) |
| gerencias | Carajás;São Luis e EFC;Serra Sul | sim (separar por `;`) |

---

## Aba 2 — `indicadores`

Defina cada indicador uma vez (linha = indicador).

| id | titulo | meta_valor | meta_formato | meta_tendencia |
|----|--------|------------|--------------|----------------|
| ptl | PTL – Taxa de pontualidade do transporte coletivo | 96,60 | percent | down |
| ovbk | OVBK – Taxa de overbook do transporte coletivo | 1577 | number | up |

**meta_formato:** `percent` ou `number`  
**meta_tendencia:** `up`, `down` ou `neutral` (seta ▲/▼ no rodapé)

---

## Aba 3 — `valores`

Uma linha por combinação **indicador × escopo × gerência × mês**.

| indicador_id | escopo | gerencia_id | gerencia_nome | mes | bar_primary | bar_secondary | line_rate |
|--------------|--------|-------------|---------------|-----|-------------|---------------|-----------|
| ptl | consolidado | | | jan/26 | 7942 | 7579 | 95,43 |
| ptl | consolidado | | | fev/26 | 7188 | 6778 | 94,30 |
| ptl | gerencia | carajas | Carajás | jan/26 | 1462 | 1440 | 98,50 |
| ovbk | gerencia | saoluis | São Luis e EFC | mar/26 | 1553 | 133 | 8,56 |

**Colunas:**
- `bar_primary` — Viagens / Passageiros transportados (barra cinza)
- `bar_secondary` — Viagens no horário / Passageiros overbook (barra verde)
- `line_rate` — PTL (%) ou taxa OVBK (%), conforme indicador
- `escopo` — `consolidado` ou `gerencia` (deixe gerência vazia no consolidado)

**Gerencia_id sugeridos:** `carajas`, `saoluis`, `serrasul` (sem acento, minúsculas)

---

## Aba 4 — `analises_consolidado`

Somente para o slide consolidado (diretoria).

| indicador_id | titulo_curto | status | status_label | texto_analise |
| ptl | PTL – Pontualidade | below | Indicador abaixo da referência | Trânsito externo foi apontado como... |

**status:** `below`, `above` ou `neutral`

---

## Aba 5 — `analises_gerencia`

Uma linha por indicador × gerência (slides de detalhe).

| indicador_id | gerencia_id | status | status_label | positivos | negativos |
| ptl | saoluis | below | Indicador abaixo da referência | Mai/26 com recuperação... | Mar/26 com PTL de 87,17%... |

**positivos** e **negativos:** separar itens por `|` ou quebra de linha na célula.

---

## Mapeamento → slides HTML

| Slide | Origem na planilha |
|-------|-------------------|
| Capa | `metadados` |
| Consolidado (2 gráficos + análises) | `valores` escopo=consolidado + `analises_consolidado` |
| Detalhe PTL por gerência | `valores` indicador=ptl + `analises_gerencia` |
| Detalhe OVBK por gerência | `valores` indicador=ovbk + `analises_gerencia` |

---

## Arquivo CSV de exemplo

Veja também `indicadores-transportes-valores-exemplo.csv` nesta pasta (amostra mínima para importação).

## Validações antes de gerar

- [ ] 5 meses preenchidos para cada série
- [ ] Todas as gerências presentes em PTL e OVBK
- [ ] Consolidado bate com soma/ média esperada (conferência manual)
- [ ] Análises preenchidas para cada indicador do consolidado
- [ ] Meta com formato correto (vírgula decimal no padrão BR)
