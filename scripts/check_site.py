"""Check site/index.html: every #anchor has a target and every local file exists.

Run from the repo root: python scripts/check_site.py
"""
import re
import sys
from pathlib import Path

site = Path(__file__).resolve().parent.parent / "site"
html = (site / "index.html").read_text(encoding="utf-8")
html = re.sub(r"<!--.*?-->", "", html, flags=re.S)

ids = set(re.findall(r'\bid="([^"]+)"', html))
problems = []

for ref in re.findall(r'\b(?:href|src)="([^"]+)"', html):
    if ref.startswith("#"):
        if ref[1:] not in ids:
            problems.append(f"no element with id for {ref}")
    elif ref.startswith("/"):
        # The site is served from a sub-path until launch, so root paths break.
        problems.append(f"root-relative path {ref}")
    elif not re.match(r"[a-z]+:", ref):
        if not (site / ref.split("#")[0].split("?")[0]).is_file():
            problems.append(f"missing file {ref}")

for problem in problems:
    print("FAIL:", problem)
if not ids or problems:
    sys.exit(1)
print("site/index.html: links and files OK")
