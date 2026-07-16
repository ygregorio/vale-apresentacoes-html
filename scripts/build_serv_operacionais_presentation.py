#!/usr/bin/env python3
"""Gera indicators-data.js e index.html da apresentação serv-operacionais-jun26."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "data" / "referencias" / "serv-operacionais-jun26.json"
SRC_DATA = ROOT / "presentations" / "vp1-ovbk-validacao" / "data" / "indicators-data.js"
OUT_DIR = ROOT / "presentations" / "serv-operacionais-jun26"
OUT_DATA = OUT_DIR / "data" / "indicators-data.js"
OUT_HTML = OUT_DIR / "index.html"

VP2_IDS = ("vp2-norte", "vp2-sul")
INDICATORS = ("ovbk", "ptl")

FIFTH_WHY = {
    "ovbk": {
        "vp1": "Por que a governança não existe? → Ausência de SLA integrado entre RH, áreas operacionais e Transportes para prever e dimensionar demanda antes das movimentações.",
        "vp2-norte": "Por que não há previsibilidade? → Processos de admissão, cadastro e alteração de rota não incluem Transportes no fluxo de aprovação com antecedência mínima.",
        "vp2-sul": "Por que o pico persiste no Sudeste? → Crescimento de efetivo em Mariana/Santa Bárbara sem rebalanceamento formal de frota e credenciamento por linha.",
    },
    "ptl": {
        "vp1": "Por que a operação não absorve imprevistos? → Horários e rotas planejados sem margem para obras, trânsito externo e eventos — roteirização ainda reativa.",
        "vp2-norte": "Por que rotas críticas não estabilizam? → Falta de contingência padronizada para pare e siga, trânsito metropolitano SL e acessos a Carajás.",
        "vp2-sul": "Por que atrasos se repetem? → Rotas VGR/Mariana/Brucutu dependem de vias externas sem plano transversal de antecipação e BI por linha.",
    },
}

ACAO_SALVADORA = {
    "ovbk": {
        "vp2-norte": "Integrar Transportes ao onboarding, cadastro obrigatório por linha e dimensionamento antecipado de frota nas rotas críticas do Norte.",
        "vp2-sul": "Manter reforço de frota e sinalização (Sul/TU/EFVM), ônibus extra e credenciamento por linha no Sudeste, com comunicação prévia entre gerências.",
    },
    "ptl": {
        "vp2-norte": "Contingenciamento viário, redistribuição de paradas no turno noite SL e estratificação por rota/turno com antecipação seletiva.",
        "vp2-sul": "Plano sistêmico por rota crítica (VGR, Mariana, Brucutu) com BI, antecipação de saídas e proibição de normalizar atrasos.",
    },
}


def load_js_object(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"window\.VALE_INDICATORS\s*=\s*(\{[\s\S]*\})\s*;?\s*$", text)
    if not m:
        raise ValueError(f"Não foi possível parsear {path}")
    return json.loads(m.group(1))


def ensure_five_whys(mcs: dict, indicator_id: str, scope: str) -> None:
    porques = mcs.get("porques") or []
    # Remove texto que confunde causa raiz com 4º/5º porquê
    for p in porques:
        t = p.get("texto", "")
        if re.search(r"causa raiz", t, re.I):
            p["texto"] = re.sub(
                r"^Causa raiz[^:]*:\s*",
                "Por quê isso persiste? → ",
                t,
                flags=re.I,
            )
    while len(porques) < 4:
        porques.append({"nivel": len(porques) + 1, "texto": "—"})
    if len(porques) == 4:
        fifth = FIFTH_WHY.get(indicator_id, {}).get(scope)
        if fifth:
            porques.append({"nivel": 5, "texto": fifth})
    for i, p in enumerate(porques[:5], start=1):
        p["nivel"] = i
    mcs["porques"] = porques[:5]
    if not mcs.get("categoria"):
        mcs["categoria"] = "Método"
    if not mcs.get("categorias"):
        mcs["categorias"] = ["Material", "Mão de obra", "Máquina", "Método"]
    if not mcs.get("acaoSalvadora") and mcs.get("causaRaiz"):
        key = scope if scope.startswith("vp2") else "vp1"
        salv = ACAO_SALVADORA.get(indicator_id, {}).get(key)
        if salv:
            mcs["acaoSalvadora"] = salv
        elif mcs.get("solucao"):
            mcs["acaoSalvadora"] = mcs["solucao"][0]


def compute_line(indicator_id: str, primary: float, secondary: float) -> float:
    if primary <= 0:
        return 0.0
    meta_fmt = "percent" if indicator_id == "ptl" else "number"
    if meta_fmt == "percent":
        return secondary / primary * 100
    if secondary <= 0:
        return 0.0
    return primary / secondary * 100


def aggregate_vp2_series(indicator: dict, vp2_id: str, indicator_id: str) -> dict | None:
    children = [g for g in indicator.get("gerencias", []) if g.get("parentId") == vp2_id]
    if not children:
        return None
    n = len(children[0]["series"]["barPrimary"])
    bar_primary, bar_secondary, line = [], [], []
    for i in range(n):
        sp, ss = 0.0, 0.0
        for c in children:
            s = c["series"]
            sp += s["barPrimary"][i]
            ss += s["barSecondary"][i]
        bar_primary.append(sp)
        bar_secondary.append(ss)
        line.append(compute_line(indicator_id, sp, ss))
    first = children[0]["series"]
    return {
        "barPrimaryLabel": first["barPrimaryLabel"],
        "barSecondaryLabel": first["barSecondaryLabel"],
        "lineLabel": first["lineLabel"],
        "barPrimary": bar_primary,
        "barSecondary": bar_secondary,
        "line": line,
    }


def meets_meta(indicator_id: str, value: float, meta: dict) -> bool:
    if meta.get("format") == "percent":
        return value >= meta["value"]
    trend = meta.get("trend", "up")
    if trend == "up":
        return value >= meta["value"]
    return value <= meta["value"]


def rank_children(indicator: dict, indicator_id: str) -> tuple[dict, dict]:
    meta = indicator["meta"]
    ranked = []
    for g in indicator.get("gerencias", []):
        s = g.get("series")
        if not s or not s.get("line"):
            continue
        val = s["line"][-1]
        ranked.append(
            {
                "id": g["id"],
                "nome": g["nome"],
                "valor": val,
                "above": meets_meta(indicator_id, val, meta),
            }
        )
    if not ranked:
        return {"nome": "—", "valor": 0}, {"nome": "—", "valor": 0}
    ranked.sort(key=lambda x: x["valor"], reverse=True)
    return ranked[0], ranked[-1]


def rank_vp2_children(indicator: dict, vp2_id: str, indicator_id: str) -> tuple[dict, dict]:
    children = [g for g in indicator.get("gerencias", []) if g.get("parentId") == vp2_id]
    meta = indicator["meta"]
    ranked = []
    for g in children:
        s = g.get("series")
        if not s or not s.get("line"):
            continue
        val = s["line"][-1]
        ranked.append({"id": g["id"], "nome": g["nome"], "valor": val})
    if not ranked:
        return {"nome": "—", "valor": 0}, {"nome": "—", "valor": 0}
    ranked.sort(key=lambda x: x["valor"], reverse=True)
    best, worst = ranked[0], ranked[-1]
    return best, worst


def collect_actions(indicator: dict, vp2_id: str | None = None) -> list[dict]:
    actions = []
    for g in indicator.get("gerencias", []):
        if vp2_id and g.get("parentId") != vp2_id:
            continue
        mcs = g.get("mcs") or {}
        for a in mcs.get("acoes") or []:
            actions.append(
                {
                    "gerenciaId": g["id"],
                    "gerencia": g["nome"],
                    "numero": a.get("numero"),
                    "descricao": a.get("descricao", ""),
                    "responsavel": a.get("responsavel", ""),
                    "status": a.get("status") or a.get("prazo") or "—",
                }
            )
    return actions


def build_analise_vp2(ref_analises: dict, vp2_id: str) -> dict:
    a = ref_analises.get(vp2_id, {})
    paras = list(a.get("paragrafos") or [])
    if not paras and a.get("motivo"):
        paras = [a["motivo"]]
    # VP-2: primeiro parágrafo = lead; demais gerências como bullets no texto
    if len(paras) == 1:
        lead = paras[0]
        extra = a.get("solucao") or []
        if extra:
            paras.append(f"Prioridades: {'; '.join(extra[:2])}.")
    elif len(paras) >= 2:
        lead = paras[0]
    else:
        lead = a.get("tituloCurto") or "Análise consolidada VP-2."
    return {
        "titulo": a.get("tituloCurto", ""),
        "status": a.get("status", "below"),
        "statusLabel": a.get("statusLabel", ""),
        "paragrafos": [lead, *paras[1:3]] if paras else [lead],
    }


def enrich_data(data: dict, ref: dict) -> dict:
    ref_inds = {i["id"]: i for i in ref.get("indicators", [])}

    for ind_id in INDICATORS:
        indicator = data["indicators"][ind_id]
        ref_ind = ref_inds.get(ind_id, {})
        ref_analises = ref_ind.get("analisesGerencia", {})

        # MCS consolidado VP-1
        mcs1 = indicator.get("mcsConsolidado") or ref_ind.get("mcsConsolidado") or {}
        ensure_five_whys(mcs1, ind_id, "vp1")
        indicator["mcsConsolidado"] = mcs1

        # MCS VP-2
        mcs_vp2 = {}
        ref_mcs_vp2 = ref_ind.get("mcsVp2") or {}
        for vp2_id in VP2_IDS:
            mcs = dict(ref_mcs_vp2.get(vp2_id) or {})
            ensure_five_whys(mcs, ind_id, vp2_id)
            mcs_vp2[vp2_id] = mcs
        indicator["mcsVp2"] = mcs_vp2

        # Análises por escopo
        if "analisesPorEscopo" not in data:
            data["analisesPorEscopo"] = {}
        scopes = {"vp1": dict(data["analises"].get(ind_id, {}))}
        if ind_id == "ptl":
            scopes["vp1"]["paragrafos"] = [
                "Jun/26 consolidado VP-1: PTL 96,02% (meta 96,60%, gap -0,58 p.p.). Apesar do consolidado numérico próximo da meta, as duas diretorias reportam atrasos recorrentes e processos em estabilização.",
                "**Norte** — Dependência de vias externas: pare e siga, obras BR-381/Santa Bárbara, trânsito metropolitano SL (rotas TN/TO). Carajás 95,7%, SLS EFC 94,63% — turno noite concentra 34% dos atrasos.",
                "**Sul** — VGR/MUT/CPX, Mariana/Brucutu e rotas metropolitanas com obras e congestionamento. Elida reforça abordagem sistêmica por rota, BI e proibição de normalizar atrasos.",
            ]
            data["analises"]["ptl"]["paragrafos"] = scopes["vp1"]["paragrafos"]
        for vp2_id in VP2_IDS:
            scopes[vp2_id] = build_analise_vp2(ref_analises, vp2_id)
        data["analisesPorEscopo"][ind_id] = scopes

        # Previews por escopo
        if "slidePreviews" not in data:
            data["slidePreviews"] = {}
        previews = {}

        best, worst = rank_children(indicator, ind_id)
        previews["vp1"] = {
            "melhorArea": {"id": best["id"], "nome": best["nome"], "valor": best["valor"]},
            "piorArea": {"id": worst["id"], "nome": worst["nome"], "valor": worst["valor"]},
            "acoesPrioritarias": collect_actions(indicator),
        }

        for vp2_id in VP2_IDS:
            b, w = rank_vp2_children(indicator, vp2_id, ind_id)
            previews[vp2_id] = {
                "melhorArea": {"id": b["id"], "nome": b["nome"], "valor": b["valor"]},
                "piorArea": {"id": w["id"], "nome": w["nome"], "valor": w["valor"]},
                "acoesPrioritarias": collect_actions(indicator, vp2_id),
            }
        data["slidePreviews"][ind_id] = previews

        # Séries VP-2 agregadas (cache)
        vp2_series = {}
        for vp2_id in VP2_IDS:
            series = aggregate_vp2_series(indicator, vp2_id, ind_id)
            if series:
                vp2_series[vp2_id] = series
        indicator["vp2Series"] = vp2_series

    # Compat: vp1Preview aponta OVBK vp1
    data["vp1Preview"] = data["slidePreviews"]["ovbk"]["vp1"]
    data["vp1Preview"]["indicatorId"] = "ovbk"
    data["vp1Preview"]["nivel"] = "VP-1"
    data["vp1Preview"]["referencia"] = data["meta"]["referencia"]

    # Mapa de navegação VP-1 → VP-2
    data["slideNav"] = {
        "ovbk": {"Norte": "vp2-norte-ovbk", "Sul": "vp2-sul-ovbk"},
        "ptl": {"Norte": "vp2-norte-ptl", "Sul": "vp2-sul-ptl"},
    }

    # Slides MCS legados não são injetados — deck usa slides unificados VP-1/VP-2
    data.pop("mcsSlides", None)

    return data


def write_js(data: dict, path: Path) -> None:
    ts = datetime.now(timezone.utc).isoformat()
    body = json.dumps(data, ensure_ascii=False, indent=2)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f"/** Gerado em {ts} */\nwindow.VALE_INDICATORS = {body};\n",
        encoding="utf-8",
    )


SLIDE_TEMPLATE = """        <section class="slide slide--vp1-indicator{active}" data-slide-id="{slide_id}" data-indicator="{indicator}" data-escopo="{escopo}" data-chapter-theme="{theme}">
          <header class="vp1-topbar">
            <div class="vp1-topbar__main">
              <p class="vp1-topbar__eyebrow">{eyebrow}</p>
              <h1 class="vp1-topbar__title">{title}</h1>
              <p class="vp1-topbar__subtitle">Consolidado · Referência jun/26</p>
            </div>
            <img class="vp1-topbar__logo" src="../../presentation-kit/assets/logo/vale-logo-white.png" alt="Vale">
          </header>
          <div class="vp1-body">
            <article class="vp1-chart-panel indicator-panel" data-indicator-chart data-indicator="{indicator}" data-scope="{chart_scope}">
              <div class="indicator-panel__head">
                <h2 class="indicator-panel__title">{chart_title}</h2>
                <label class="indicator-panel__label-toggle">
                  <input type="checkbox" checked data-panel-label-toggle>
                  Rótulos
                </label>
              </div>
              <div class="indicator-panel__chart-wrap">
                <div class="indicator-panel__chart">
                  <canvas role="img" aria-label="Gráfico {indicator_upper} {escopo_label}"></canvas>
                </div>
              </div>
              <p class="indicator-panel__meta">{meta_line}</p>
            </article>
            <div class="vp1-mcs-panel" data-vp1-mcs aria-label="MCS consolidado"></div>
            <aside class="vp1-exec" data-vp1-exec aria-label="Comentário executivo"></aside>
            <div class="vp1-actions-panel" data-vp1-actions aria-label="Plano de ação"></div>
          </div>
        </section>"""


def write_html(path: Path) -> None:
    slides = []
    specs = [
        ("vp1-ovbk", "ovbk", "vp1", "consolidado", "VP-1 · Dir. Serv. Operacionais e Seg. Empresarial",
         "OVBK — Taxa de overbook do transporte coletivo", "Resultado consolidado VP-1",
         'Meta: 1.577 <span class="meta-trend--up">▲</span> — quanto maior, melhor', "aqua", True),
        ("vp1-ptl", "ptl", "vp1", "consolidado", "VP-1 · Dir. Serv. Operacionais e Seg. Empresarial",
         "PTL — Taxa de pontualidade do transporte coletivo", "Resultado consolidado VP-1",
         "Meta: 96,60% — quanto maior, melhor", "aqua", False),
        ("vp2-norte-ovbk", "ovbk", "vp2-norte", "vp2-norte", "VP-2 · Serviços Operacionais Norte",
         "OVBK — Taxa de overbook do transporte coletivo", "Resultado consolidado VP-2 Norte",
         'Meta: 1.577 <span class="meta-trend--up">▲</span> — quanto maior, melhor', "verde", False),
        ("vp2-sul-ovbk", "ovbk", "vp2-sul", "vp2-sul", "VP-2 · Serviços Operacionais Sul",
         "OVBK — Taxa de overbook do transporte coletivo", "Resultado consolidado VP-2 Sul",
         'Meta: 1.577 <span class="meta-trend--up">▲</span> — quanto maior, melhor', "verde", False),
        ("vp2-norte-ptl", "ptl", "vp2-norte", "vp2-norte", "VP-2 · Serviços Operacionais Norte",
         "PTL — Taxa de pontualidade do transporte coletivo", "Resultado consolidado VP-2 Norte",
         "Meta: 96,60% — quanto maior, melhor", "azul", False),
        ("vp2-sul-ptl", "ptl", "vp2-sul", "vp2-sul", "VP-2 · Serviços Operacionais Sul",
         "PTL — Taxa de pontualidade do transporte coletivo", "Resultado consolidado VP-2 Sul",
         "Meta: 96,60% — quanto maior, melhor", "azul", False),
    ]
    for slide_id, ind, escopo, chart_scope, eyebrow, title, chart_title, meta, theme, first in specs:
        slides.append(
            SLIDE_TEMPLATE.format(
                active=" is-active" if first else "",
                slide_id=slide_id,
                indicator=ind,
                escopo=escopo,
                chart_scope=chart_scope,
                eyebrow=eyebrow,
                title=title,
                chart_title=chart_title,
                meta_line=meta,
                theme=theme,
                indicator_upper=ind.upper(),
                escopo_label=escopo,
            )
        )

    html = f"""<!DOCTYPE html>
<html lang="pt-BR" data-theme="verde-aqua">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Serviços Operacionais — Transporte Coletivo · jun/26</title>
  <link rel="stylesheet" href="../../presentation-kit/css/tokens.css">
  <link rel="stylesheet" href="../../presentation-kit/css/base.css">
  <link rel="stylesheet" href="../../presentation-kit/css/slides.css">
  <link rel="stylesheet" href="../../presentation-kit/css/components.css">
  <link rel="stylesheet" href="../../presentation-kit/css/indicators-transport.css">
  <link rel="stylesheet" href="../../presentation-kit/css/mcs-slide.css">
  <link rel="stylesheet" href="../../presentation-kit/css/vp1-indicator-slide.css">
</head>
<body>
  <div class="deck__progress"></div>
  <div class="deck">
    <div class="deck__viewport">
      <div class="deck__slides">
{chr(10).join(slides)}
      </div>
    </div>
  </div>
  <nav class="deck__nav" aria-label="Navegação">
    <button type="button" class="deck__nav-btn" data-action="prev" aria-label="Anterior" disabled>←</button>
    <span class="deck__counter">1 / {len(specs)}</span>
    <button type="button" class="deck__nav-btn" data-action="next" aria-label="Próximo">→</button>
  </nav>
  <script src="data/indicators-data.js"></script>
  <script type="module" src="../../presentation-kit/js/deck.js"></script>
</body>
</html>
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")


def main() -> None:
    ref = json.loads(REF.read_text(encoding="utf-8"))
    data = load_js_object(SRC_DATA)
    data = enrich_data(data, ref)
    write_js(data, OUT_DATA)
    write_html(OUT_HTML)
    print(f"OK: {OUT_DATA}")
    print(f"OK: {OUT_HTML}")


if __name__ == "__main__":
    main()
