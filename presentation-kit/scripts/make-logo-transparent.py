"""Gera vale-logo-color.png com fundo transparente a partir do JPG oficial."""
from pathlib import Path

from PIL import Image

KIT = Path(__file__).resolve().parent.parent
SRC = KIT / "assets" / "logo" / "vale-logo-color.jpg"
DST = KIT / "assets" / "logo" / "vale-logo-color.png"
TOLERANCE = 28


def remove_white_background(img: Image.Image, tolerance: int = TOLERANCE) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    cutoff = 255 - tolerance
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if r >= cutoff and g >= cutoff and b >= cutoff:
                px[x, y] = (r, g, b, 0)
    return rgba


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Logo JPG nao encontrada: {SRC}")

    DST.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(SRC)
    remove_white_background(img).save(DST, "PNG", optimize=True)
    print(f"Logo PNG salva: {DST}")


if __name__ == "__main__":
    main()
