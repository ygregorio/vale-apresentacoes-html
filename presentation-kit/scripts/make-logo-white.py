"""Gera vale-logo-white.png (100% branca, sem detalhe amarelo) a partir do PNG colorido."""
from pathlib import Path

from PIL import Image

KIT = Path(__file__).resolve().parent.parent
SRC = KIT / "assets" / "logo" / "vale-logo-color.png"
DST = KIT / "assets" / "logo" / "vale-logo-white.png"


def make_white_logo(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            _, _, _, a = px[x, y]
            if a < 12:
                continue
            px[x, y] = (255, 255, 255, a)
    return rgba


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Logo colorida nao encontrada: {SRC}")

    DST.parent.mkdir(parents=True, exist_ok=True)
    make_white_logo(Image.open(SRC)).save(DST, "PNG", optimize=True)
    print(f"Logo branca salva: {DST}")


if __name__ == "__main__":
    main()
