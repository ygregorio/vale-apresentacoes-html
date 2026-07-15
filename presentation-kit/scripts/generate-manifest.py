"""Regenera presentation-kit/assets/manifest.json a partir de brand-assets."""
import json
import re
from pathlib import Path

KIT = Path(__file__).resolve().parent.parent
BASE = KIT / "brand-assets"
OUT = KIT / "assets" / "manifest.json"

COLOR_MAP = {
    "verde": ["green", "verde"],
    "aqua": ["aqua"],
    "azul": ["blue", "azul"],
    "amarelo": ["yellow", "amarelo", "amarela"],
    "cereja": ["cherry", "cereja"],
}


def match_color(name: str) -> str | None:
    n = name.lower()
    for color, keys in COLOR_MAP.items():
        if any(k in n for k in keys):
            return color
    return None


def rel(p: Path) -> str:
    return str(p.relative_to(BASE)).replace("\\", "/")


def main() -> None:
    if not BASE.exists():
        raise SystemExit(f"brand-assets nao encontrado: {BASE}")

    icons = sorted((BASE / "icones/PNG").glob("Icones-Vale*.png"))
    slugs = []
    for f in icons:
        m = re.search(r"YELLOW[-_](.+)\.png$", f.name, re.I)
        if m:
            slugs.append(m.group(1))

    manifest = {
        "sourceRoot": str(BASE),
        "relativeRoot": "../brand-assets",
        "fonts": {
            "regular": "../assets/fonts/ValeSans-Regular.woff2",
            "bold": "../assets/fonts/ValeSans-Bold.woff2",
        },
        "logo": {
            "color": "../assets/logo/vale-logo-color.png",
            "white": "../assets/logo/vale-logo-white.png",
        },
        "icons": {
            "basePath": "icones/PNG",
            "pattern": "Icones-Vale_VERDE AMARELO_GREEN YELLOW-{slug}.png",
            "count": len(icons),
            "slugs": slugs[:50],
            "totalSlugs": len(slugs),
        },
        "grafismos": {
            "rede": {
                "basePath": "Grafismos_Graphics/rede_grid",
                "files": [f.name for f in sorted((BASE / "Grafismos_Graphics/rede_grid").glob("*.png"))],
                "referencePdf": "Grafismos_Graphics/rede_grid/REDE_GRID Vale RPB.pdf",
            },
            "redeOutline": {},
            "faixaLateral": {},
        },
        "illustrations": {},
    }

    for f in sorted((BASE / "Grafismos_Graphics/Outline").rglob("*.png")):
        c = match_color(f.name)
        if c and c not in manifest["grafismos"]["redeOutline"]:
            manifest["grafismos"]["redeOutline"][c] = rel(f)

    for f in sorted((BASE / "Grafismos_Graphics/Box_flutuando").rglob("*.png")):
        n = f.name.lower()
        if "sem faixa" in n:
            continue
        c = match_color(f.name)
        if c and c not in manifest["grafismos"]["faixaLateral"]:
            manifest["grafismos"]["faixaLateral"][c] = rel(f)

    for d in sorted((BASE / "Ilustracoes").iterdir()):
        if d.is_dir():
            pdfs = list(d.rglob("*.pdf"))
            manifest["illustrations"][d.name] = {
                "count": len(pdfs),
                "sample": rel(pdfs[0]) if pdfs else None,
            }

    OUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"manifest.json gerado ({len(slugs)} icones)")


if __name__ == "__main__":
    main()
