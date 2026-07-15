"""Converte JSON do backoffice para window.VALE_INDICATORS e publica apresentação."""

from __future__ import annotations

import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path


def _js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def _js_value(value) -> str:
    return json.dumps(value, ensure_ascii=False)


NIVEIS = ["VP", "VP-1", "VP-2", "VP-3", "VP-4"]


def _parent_nivel(nivel: str) -> str | None:
    try:
        idx = NIVEIS.index(nivel)
    except ValueError:
        return None
    if idx <= 0:
        return None
    return NIVEIS[idx - 1]


def _migrate_gerencias(data: dict) -> list[dict]:
    gerencias = data.get("gerencias") or []
    if not gerencias:
        return []
    config = data.get("config") or {}
    hierarquia = [
        {"id": "vp", "nome": "Vice-Presidente", "nivel": "VP", "parentId": None, "ordem": 1},
        {
            "id": "vp1-diretoria",
            "nome": "Diretoria (VP-1)",
            "nivel": "VP-1",
            "parentId": "vp",
            "ordem": 1,
        },
        {
            "id": "vp2-area",
            "nome": config.get("diretoria") or "Diretoria",
            "nivel": "VP-2",
            "parentId": "vp1-diretoria",
            "ordem": 1,
        },
        {
            "id": "vp3-unidade",
            "nome": config.get("areaResponsavel") or "Área responsável",
            "nivel": "VP-3",
            "parentId": "vp2-area",
            "ordem": 1,
        },
    ]
    for i, g in enumerate(gerencias):
        hierarquia.append(
            {
                "id": g["id"],
                "nome": g.get("nome", g["id"]),
                "nivel": "VP-4",
                "parentId": "vp3-unidade",
                "ordem": g.get("ordem", i + 1),
            }
        )
    return hierarquia


def _get_hierarquia(data: dict) -> list[dict]:
    hierarquia = data.get("hierarquia") or []
    if not hierarquia and data.get("gerencias"):
        hierarquia = _migrate_gerencias(data)
    return hierarquia


def _get_chart_nodes(hierarquia: list[dict]) -> list[dict]:
    vp4 = [h for h in hierarquia if h.get("nivel") == "VP-4"]
    if vp4:
        return sorted(vp4, key=lambda h: h.get("ordem", 0))
    parent_ids = {h.get("parentId") for h in hierarquia if h.get("parentId")}
    leaves = [h for h in hierarquia if h.get("id") not in parent_ids]
    return sorted(leaves, key=lambda h: h.get("ordem", 0))


def _validate_hierarquia(hierarquia: list[dict]) -> list[str]:
    errors: list[str] = []
    if not hierarquia:
        errors.append("Cadastre ao menos um nó na hierarquia.")
        return errors
    by_id = {h["id"]: h for h in hierarquia if h.get("id")}
    if not any(h.get("nivel") == "VP" for h in hierarquia):
        errors.append("Cadastre ao menos um nó VP (vice-presidente) — pode haver vários.")
    for h in hierarquia:
        nome = h.get("nome") or h.get("id") or "?"
        nivel = h.get("nivel")
        if nivel not in NIVEIS:
            errors.append(f'Hierarquia "{nome}": nível inválido.')
            continue
        expected_parent = _parent_nivel(nivel)
        if not expected_parent:
            if h.get("parentId"):
                errors.append(f'"{nome}": VP não deve ter hierarquia acima.')
            continue
        parent_id = h.get("parentId")
        if not parent_id:
            errors.append(f'"{nome}" ({nivel}): selecione a hierarquia acima.')
            continue
        parent = by_id.get(parent_id)
        if not parent:
            errors.append(f'"{nome}": hierarquia acima não encontrada.')
            continue
        if parent.get("nivel") != expected_parent:
            errors.append(
                f'"{nome}" ({nivel}): deve estar ligado a um {expected_parent}, '
                f'não a {parent.get("nivel")} ("{parent.get("nome")}").'
            )
    if not _get_chart_nodes(hierarquia):
        errors.append(
            "Cadastre ao menos um nó VP-4 (ou folha operacional) para os gráficos por unidade."
        )
    return errors


def _get_nodes_for_escopo(hierarquia: list[dict], escopo_nivel: str | None) -> list[dict]:
    escopo = escopo_nivel or "VP"
    try:
        escopo_idx = NIVEIS.index(escopo)
    except ValueError:
        return []
    out: list[dict] = []
    for h in hierarquia:
        nivel = h.get("nivel")
        if nivel not in NIVEIS:
            continue
        idx = NIVEIS.index(nivel)
        if idx >= escopo_idx:
            out.append(h)
    return sorted(
        out,
        key=lambda x: (NIVEIS.index(x.get("nivel", "VP-4")), x.get("ordem", 0)),
    )


def validate_referencia(data: dict) -> list[str]:
    errors: list[str] = []
    config = data.get("config") or {}
    for field in ("diretoria", "areaResponsavel", "mesReferencia"):
        if not str(config.get(field) or "").strip():
            errors.append(f"Configuração: preencha '{field}'.")
    meses = config.get("mesesSerie") or []
    if len(meses) < 1:
        errors.append("Configuração: informe ao menos um mês na série.")
    hierarquia = _get_hierarquia(data)
    errors.extend(_validate_hierarquia(hierarquia))
    indicators = data.get("indicators") or []
    if not indicators:
        errors.append("Cadastre ao menos um indicador.")
    for ind in indicators:
        ind_id = ind.get("id") or "(sem id)"
        if not str(ind.get("titulo") or "").strip():
            errors.append(f"Indicador {ind_id}: informe o título.")
        meta = ind.get("meta") or {}
        if meta.get("value") in (None, ""):
            errors.append(f"Indicador {ind_id}: informe a meta.")
        valores = ind.get("valores") or {}
        cons = valores.get("consolidado") or {}
        for key in ("barPrimary", "barSecondary", "line"):
            arr = cons.get(key) or []
            if len(arr) != len(meses):
                errors.append(
                    f"Indicador {ind_id} (consolidado): '{key}' deve ter {len(meses)} valores."
                )
        ger_vals = valores.get("gerencias") or {}
        escopo_nodes = _get_nodes_for_escopo(hierarquia, ind.get("escopoNivel"))
        if not escopo_nodes:
            errors.append(
                f"Indicador {ind_id}: escopo '{ind.get('escopoNivel', 'VP')}' não possui áreas na hierarquia."
            )
        for g in escopo_nodes:
            gid = g.get("id")
            if not gid:
                continue
            gdata = ger_vals.get(gid) or {}
            for key in ("barPrimary", "barSecondary", "line"):
                arr = gdata.get(key) or []
                if len(arr) != len(meses):
                    errors.append(
                        f"Indicador {ind_id} / {g.get('nome', gid)}: '{key}' deve ter {len(meses)} valores."
                    )
    slug = str(config.get("presentationSlug") or "").strip()
    if not slug or not re.fullmatch(r"[a-z0-9-]+", slug):
        errors.append("Configuração: slug da apresentação inválido (use letras minúsculas, números e hífen).")
    return errors


def _get_publish_nodes(hierarquia: list[dict], escopo_nivel: str | None) -> list[dict]:
    """Nós operacionais publicados nos slides: preferem VP-4 dentro do escopo."""
    nodes = _get_nodes_for_escopo(hierarquia, escopo_nivel)
    vp4 = [n for n in nodes if n.get("nivel") == "VP-4"]
    if vp4:
        return sorted(vp4, key=lambda h: h.get("ordem", 0))
    if not nodes:
        return []
    deepest = max(
        (NIVEIS.index(n["nivel"]) for n in nodes if n.get("nivel") in NIVEIS),
        default=-1,
    )
    if deepest < 0:
        return []
    return sorted(
        [n for n in nodes if n.get("nivel") == NIVEIS[deepest]],
        key=lambda h: h.get("ordem", 0),
    )


def to_vale_indicators(data: dict) -> dict:
    config = data.get("config") or {}
    meses = config.get("mesesSerie") or []
    hierarquia = _get_hierarquia(data)
    indicators_out = {}
    analises_out = {}

    for ind in sorted(data.get("indicators") or [], key=lambda i: i.get("ordem", 0)):
        ind_id = ind["id"]
        labels = ind.get("labels") or {}
        valores = ind.get("valores") or {}
        cons = valores.get("consolidado") or {}
        ger_vals = valores.get("gerencias") or {}
        gerencias = _get_publish_nodes(hierarquia, ind.get("escopoNivel"))

        consolidado = {
            "barPrimaryLabel": labels.get("barPrimary", ""),
            "barSecondaryLabel": labels.get("barSecondary", ""),
            "lineLabel": labels.get("line", ""),
            "barPrimary": cons.get("barPrimary") or [],
            "barSecondary": cons.get("barSecondary") or [],
            "line": cons.get("line") or [],
        }

        gerencias_ind = []
        analises_ger = ind.get("analisesGerencia") or {}
        for g in gerencias:
            gid = g["id"]
            gdata = ger_vals.get(gid) or {}
            gerencias_ind.append(
                {
                    "id": gid,
                    "nome": g.get("nome", gid),
                    "nivel": g.get("nivel"),
                    "parentId": g.get("parentId"),
                    "analise": analises_ger.get(gid)
                    or {
                        "status": "below",
                        "statusLabel": "",
                        "positivos": [],
                        "negativos": [],
                    },
                    "series": {
                        "barPrimaryLabel": labels.get("barPrimary", ""),
                        "barSecondaryLabel": labels.get("barSecondary", ""),
                        "lineLabel": labels.get("line", ""),
                        "barPrimary": gdata.get("barPrimary") or [],
                        "barSecondary": gdata.get("barSecondary") or [],
                        "line": gdata.get("line") or [],
                    },
                }
            )

        indicators_out[ind_id] = {
            "id": ind_id,
            "titulo": ind.get("titulo", ""),
            "escopoNivel": ind.get("escopoNivel") or "VP",
            "meta": ind.get("meta") or {},
            "consolidado": consolidado,
            "gerencias": gerencias_ind,
        }

        ac = ind.get("analiseConsolidado") or {}
        analises_out[ind_id] = {
            "titulo": ac.get("tituloCurto") or ind.get("titulo", ""),
            "status": ac.get("status") or "below",
            "statusLabel": ac.get("statusLabel") or "",
            "paragrafos": ac.get("paragrafos") or [],
        }

    return {
        "meta": {
            "diretoria": config.get("diretoria", ""),
            "area": config.get("areaResponsavel", ""),
            "areaHierarquia": config.get("areaHierarquia", ""),
            "referencia": config.get("mesReferencia", ""),
            "meses": meses,
            "hierarquia": hierarquia,
        },
        "analises": analises_out,
        "indicators": indicators_out,
    }


def render_indicators_js(payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    return f"/** Gerado pelo backoffice em {datetime.now(timezone.utc).isoformat()} */\nwindow.VALE_INDICATORS = {body};\n"


def publish(
    data: dict,
    project_root: Path,
    template_presentation: str = "indicadores-transportes-teste",
) -> dict:
    errors = validate_referencia(data)
    if errors:
        return {"ok": False, "errors": errors}

    config = data.get("config") or {}
    slug = config["presentationSlug"]
    payload = to_vale_indicators(data)
    pres_dir = project_root / "presentations" / slug
    data_dir = pres_dir / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    js_path = data_dir / "indicators-data.js"
    js_path.write_text(render_indicators_js(payload), encoding="utf-8")

    index_path = pres_dir / "index.html"
    if not index_path.exists():
        template_dir = project_root / "presentations" / template_presentation
        if template_dir.exists():
            shutil.copytree(template_dir, pres_dir, dirs_exist_ok=True)
            js_path.write_text(render_indicators_js(payload), encoding="utf-8")

    _patch_index_html(index_path, config, payload)

    return {
        "ok": True,
        "presentationPath": str(pres_dir.relative_to(project_root)).replace("\\", "/"),
        "dataFile": str(js_path.relative_to(project_root)).replace("\\", "/"),
        "previewUrl": f"/presentations/{slug}/index.html",
    }


def _patch_index_html(index_path: Path, config: dict, payload: dict) -> None:
    if not index_path.exists():
        return
    text = index_path.read_text(encoding="utf-8")
    titulo = config.get("tituloApresentacao") or "Indicadores de Transportes"
    diretoria = config.get("diretoria") or payload["meta"]["diretoria"]
    ref = config.get("mesReferencia") or payload["meta"]["referencia"]
    subtitulo = config.get("subtituloApresentacao") or f"{diretoria} · Referência {ref}"

    text = re.sub(
        r"(<title>)(.*?)(</title>)",
        lambda m: f"{m.group(1)}{_escape_html(titulo)} — Backoffice{m.group(3)}",
        text,
        count=1,
    )
    text = re.sub(
        r'(<h1 class="slide__title">)(.*?)(</h1>)',
        lambda m: f"{m.group(1)}{_escape_html(titulo)}{m.group(3)}",
        text,
        count=1,
    )
    text = re.sub(
        r'(<p class="slide__subtitle">)(.*?)(</p>)',
        lambda m: f"{m.group(1)}{_escape_html(subtitulo)}{m.group(3)}",
        text,
        count=1,
    )
    text = re.sub(
        r'(<h1 class="indicators-topbar__title">)(.*?)(</h1>)',
        lambda m: f"{m.group(1)}{_escape_html(diretoria)}{m.group(3)}",
        text,
        count=1,
    )
    text = re.sub(
        r'(<p class="indicators-topbar__subtitle">Consolidado · )(.*?)(</p>)',
        lambda m: f"{m.group(1)}{_escape_html(ref)}{m.group(3)}",
        text,
        count=1,
    )
    index_path.write_text(text, encoding="utf-8")


def _escape_html(value: str) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
