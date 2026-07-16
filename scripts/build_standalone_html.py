#!/usr/bin/env python3
"""Gera HTML único autocontido da apresentação serv-operacionais-jun26."""

from __future__ import annotations

import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRES = ROOT / "presentations" / "serv-operacionais-jun26"
KIT = ROOT / "presentation-kit"
OUT = ROOT / "dist" / "serv-operacionais-jun26-standalone.html"

CSS_FILES = [
    KIT / "css/tokens.css",
    KIT / "css/base.css",
    KIT / "css/slides.css",
    KIT / "css/components.css",
    KIT / "css/indicators-transport.css",
    KIT / "css/mcs-slide.css",
    KIT / "css/vp1-indicator-slide.css",
]

FONT_FILES = [
    KIT / "assets/fonts/ValeSans-Regular.woff2",
    KIT / "assets/fonts/ValeSans-Bold.woff2",
]

LOGO = KIT / "assets/logo/vale-logo-white.png"
MAP_SVG = KIT / "assets/map-brazil.svg"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def inline_fonts(css: str) -> str:
    for font in FONT_FILES:
        if not font.exists():
            continue
        b64 = base64.b64encode(font.read_bytes()).decode("ascii")
        css = css.replace(
            f'url("../assets/fonts/{font.name}")',
            f'url("data:font/woff2;base64,{b64}")',
        )
        css = css.replace(
            f"url('../assets/fonts/{font.name}')",
            f'url("data:font/woff2;base64,{b64}")',
        )
    return css


def build_css() -> str:
    parts = []
    for f in CSS_FILES:
        parts.append(inline_fonts(read_text(f)))
    return "\n".join(parts)


def strip_esm_module(source: str) -> str:
    lines = []
    for line in source.splitlines():
        if line.strip().startswith("import "):
            continue
        line = re.sub(r"\bexport\s+(async\s+)?function\b", r"\1function", line)
        line = re.sub(r"\bexport\s+class\b", "class", line)
        line = re.sub(r"\bexport\s+const\b", "const", line)
        line = re.sub(r"\bexport\s+\{[^}]+\};?\s*$", "", line)
        lines.append(line)
    return "\n".join(lines)


MODULE_EXPORTS: dict[str, list[str]] = {
    "animations.js": ["initAnimations", "initCoverAnimation"],
    "charts.js": ["initCharts"],
    "interactions.js": ["initInteractions"],
    "map-brazil.js": ["initMaps"],
    "indicators-transport.js": ["initIndicatorsTransport"],
    "mcs-slide.js": [
        "renderMcsVp1Panel",
        "renderPorques",
        "injectMcsSlides",
        "initMcsSlides",
    ],
    "vp1-indicator-slide.js": ["initVp1IndicatorSlide"],
    "assets.js": [
        "paths",
        "resolveLogoVariant",
        "logoPathForSlide",
        "applyLogos",
        "iconPath",
        "brandPath",
        "illustrationPath",
        "redeGrid",
        "applyThemeAssets",
        "applyIcons",
    ],
    "deck.js": ["Deck"],
}


def patch_standalone_js(name: str, source: str) -> str:
    if name == "map-brazil.js" and MAP_SVG.exists():
        b64 = base64.b64encode(MAP_SVG.read_bytes()).decode("ascii")
        source = source.replace(
            'const MAP_SVG_URL = new URL("../assets/map-brazil.svg", import.meta.url);',
            f'const MAP_SVG_URL = "data:image/svg+xml;base64,{b64}";',
        )
    return source


def wrap_standalone_module(name: str, source: str) -> str:
    source = patch_standalone_js(name, source)
    if name == "vp1-indicator-slide.js":
        source = source.replace("renderMcsVp1Panel(", "window.renderMcsVp1Panel(")

    exports = MODULE_EXPORTS.get(name, [])
    export_lines = "\n".join(f"  window.{symbol} = {symbol};" for symbol in exports)
    return f"(function() {{\n{source}\n{export_lines}\n}})();"


def build_js_bundle() -> str:
    order = [
        KIT / "js/animations.js",
        KIT / "js/charts.js",
        KIT / "js/interactions.js",
        KIT / "js/map-brazil.js",
        KIT / "js/indicators-transport.js",
        KIT / "js/mcs-slide.js",
        KIT / "js/vp1-indicator-slide.js",
        KIT / "js/assets.js",
        KIT / "js/deck.js",
    ]
    parts = ['"use strict";']
    for path in order:
        parts.append(f"/* --- {path.name} --- */")
        source = strip_esm_module(read_text(path))
        parts.append(wrap_standalone_module(path.name, source))
    return "\n".join(parts)


def load_indicators_js() -> str:
    data_path = PRES / "data" / "indicators-data.js"
    return read_text(data_path)


def logo_data_uri() -> str:
    if not LOGO.exists():
        return ""
    b64 = base64.b64encode(LOGO.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def extract_slides_html() -> str:
    html = read_text(PRES / "index.html")
    m = re.search(r"<div class=\"deck__slides\">(.*)</div>\s*</div>\s*</div>", html, re.S)
    if not m:
        raise ValueError("Slides não encontrados")
    slides = m.group(1)
    logo_uri = logo_data_uri()
    if logo_uri:
        slides = slides.replace("../../presentation-kit/assets/logo/vale-logo-white.png", logo_uri)
    return slides.strip()


def build_html() -> None:
    css = build_css()
    indicators = load_indicators_js()
    slides = extract_slides_html()
    bundle = build_js_bundle()

    html = f"""<!DOCTYPE html>
<html lang="pt-BR" data-theme="verde-aqua">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Serviços Operacionais — Transporte Coletivo · jun/26</title>
  <style>
{css}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
</head>
<body>
  <div class="deck__progress"></div>
  <div class="deck">
    <div class="deck__viewport">
      <div class="deck__slides">
{slides}
      </div>
    </div>
  </div>
  <nav class="deck__nav" aria-label="Navegação">
    <button type="button" class="deck__nav-btn" data-action="prev" aria-label="Anterior" disabled>←</button>
    <span class="deck__counter">1 / 6</span>
    <button type="button" class="deck__nav-btn" data-action="next" aria-label="Próximo">→</button>
  </nav>
  <script>
{indicators}
  </script>
  <script>
{bundle}
  </script>
</body>
</html>
"""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"OK: {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    build_html()
