"""Stamp assets/site.css and assets/site.js with a content hash in every page.

GitHub Pages serves assets with Cache-Control: max-age=600, so for ten minutes
after a push a reviewer's browser keeps showing the OLD stylesheet. During a
review cycle that reads as "you didn't change it", and it cost us a round trip
more than once.

The hash is of the file's own contents, so the URL changes only when the asset
actually changes - browsers refetch exactly when they should and keep caching
the rest of the time.

Run before committing:  python stamp.py
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
ASSETS = ("site.css", "site.js")


def short_hash(path: pathlib.Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:8]


def main() -> None:
    versions = {}
    for name in ASSETS:
        f = ROOT / "assets" / name
        if f.exists():
            versions[name] = short_hash(f)

    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        src = page.read_text(encoding="utf-8")
        out = src
        for name, ver in versions.items():
            # matches assets/site.css and assets/site.css?v=abc123
            out = re.sub(
                rf'(assets/{re.escape(name)})(\?v=[0-9a-f]+)?',
                rf'\1?v={ver}',
                out,
            )
        if out != src:
            page.write_text(out, encoding="utf-8")
            changed += 1

    print("versions:", ", ".join(f"{k}={v}" for k, v in versions.items()))
    print(f"stamped {changed} page(s)")


if __name__ == "__main__":
    main()
