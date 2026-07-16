#!/usr/bin/env python3
"""Exporta o HTML standalone da apresentação serv-operacionais-jun26 para PDF (6 slides)."""

from __future__ import annotations

import argparse
import http.server
import io
import socket
import subprocess
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_HTML = ROOT / "dist" / "serv-operacionais-jun26-standalone.html"
DEFAULT_PDF = ROOT / "dist" / "serv-operacionais-jun26.pdf"

BROWSER_CANDIDATES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
]

SLIDE_WIDTH = 1920
SLIDE_HEIGHT = 1080
SLIDE_WAIT_MS = 2200


def find_browser() -> Path:
    for candidate in BROWSER_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "Chrome ou Edge não encontrado. Instale Google Chrome para exportar PDF."
    )


def pick_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def start_static_server(root: Path, port: int) -> http.server.ThreadingHTTPServer:
    handler = type(
        "Handler",
        (http.server.SimpleHTTPRequestHandler,),
        {"directory": str(root)},
    )

    class QuietHandler(handler):
        def log_message(self, format: str, *args) -> None:  # noqa: A003
            return

    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def merge_pdfs(chunks: list[bytes]) -> bytes:
    try:
        from pypdf import PdfReader, PdfWriter
    except ImportError as exc:
        raise RuntimeError("Instale pypdf: python -m pip install pypdf") from exc

    writer = PdfWriter()
    for chunk in chunks:
        reader = PdfReader(io.BytesIO(chunk))
        for page in reader.pages:
            writer.add_page(page)
    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()


def export_with_playwright(url: str, slide_count: int) -> list[bytes]:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise RuntimeError("Instale playwright: python -m pip install playwright") from exc

    browser_path = find_browser()
    channel = "chrome" if "Chrome" in str(browser_path) else "msedge"
    chunks: list[bytes] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel=channel, headless=True)
        page = browser.new_page(viewport={"width": SLIDE_WIDTH, "height": SLIDE_HEIGHT})
        page.goto(url, wait_until="networkidle", timeout=120_000)
        page.wait_for_function(
            "() => window.__valeDeck && window.__valeDeck.slides.length > 0",
            timeout=60_000,
        )
        page.evaluate(
            """() => {
              document.querySelector('.deck__nav')?.remove();
              document.querySelector('.deck__progress')?.remove();
            }"""
        )

        for index in range(slide_count):
            page.evaluate(f"window.__valeDeck.goTo({index})")
            page.wait_for_timeout(SLIDE_WAIT_MS)
            chunks.append(
                page.pdf(
                    width=f"{SLIDE_WIDTH}px",
                    height=f"{SLIDE_HEIGHT}px",
                    print_background=True,
                    margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                )
            )

        browser.close()

    return chunks


def main() -> int:
    parser = argparse.ArgumentParser(description="Exporta apresentação standalone para PDF.")
    parser.add_argument("--html", type=Path, default=DEFAULT_HTML, help="HTML standalone")
    parser.add_argument("--out", type=Path, default=DEFAULT_PDF, help="PDF de saída")
    args = parser.parse_args()

    html_path = args.html.resolve()
    out_path = args.out.resolve()

    if not html_path.exists():
        print(f"ERRO: HTML não encontrado: {html_path}", file=sys.stderr)
        return 1

    port = pick_free_port()
    server = start_static_server(ROOT, port)
    url = f"http://127.0.0.1:{port}/{html_path.relative_to(ROOT).as_posix()}"

    try:
        print(f"Servindo: {url}")
        slide_count = 6
        chunks = export_with_playwright(url, slide_count)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_bytes(merge_pdfs(chunks))
        size_kb = out_path.stat().st_size // 1024
        print(f"OK: {out_path} ({size_kb} KB, {slide_count} slides)")
        return 0
    except Exception as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        return 1
    finally:
        server.shutdown()


if __name__ == "__main__":
    raise SystemExit(main())
