import re
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "presentation-kit" / "assets" / "map-brazil.svg"
URL = "https://unpkg.com/@svg-maps/brazil@1.0.0/brazil.svg"

req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
data = urllib.request.urlopen(req, context=ssl.create_default_context(), timeout=15).read().decode("utf-8")
OUT.write_text(data, encoding="utf-8")

paths = re.findall(r'id="([^"]+)"', data)
print("ids", len(paths))
for pid in paths:
    if "df" in pid.lower() or "distrito" in pid.lower():
        print("DF id:", pid)

for line in data.splitlines():
    low = line.lower()
    if "df" in low or "distrito" in low:
        print(line.strip()[:200])
