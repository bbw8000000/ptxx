"""Generate the per-pack CJK webfont files described by config/font-pack-jobs.json.

`scripts/build-font-packs.mjs` decides which packs exist and which (pack, weight)
files are still missing; this script only does the font surgery.

Why the .woff source instead of the .woff2 one: the woff2 build of
noto-serif-sc-chinese-simplified-400-normal is compressed, and fontTools has to
decompress the whole 1.4 MB CFF font before it can subset anything — measured at
~12 s per subset. The TrueType-flavoured .woff of the same font subsets in ~0.1 s.
The output is emitted as woff2 in both cases, so the extra bytes never ship.

Usage:
    python scripts/subset_font_packs.py            # uses config/font-pack-jobs.json
    python scripts/subset_font_packs.py --jobs X --force

Exits 0 without touching anything when fontTools is unavailable, so a machine
without it can still build the site (Chinese text then falls back to the system
serif, and `npm run fonts:check` reports the gap).
"""

from __future__ import annotations

import argparse
import io
import json
import shutil
import sys
import tempfile
import time
from pathlib import Path

JOB_FILE = Path("config/font-pack-jobs.json")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--jobs", default=str(JOB_FILE), help="job file to read")
    parser.add_argument("--force", action="store_true", help="regenerate even if the file exists")
    return parser.parse_args()


def build_one(source: Path, text: str, destination: Path) -> int:
    """Subset `source` down to `text` and write woff2 to `destination`. Returns bytes written."""
    from fontTools import subset

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.hinting = False
    options.recalc_bounds = False
    options.recalc_timestamp = False

    font = subset.load_font(str(source), options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)

    buffer = io.BytesIO()
    font.flavor = "woff2"
    font.save(buffer)
    payload = buffer.getvalue()

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(payload)
    return len(payload)


def main() -> int:
    args = parse_args()
    jobs_path = Path(args.jobs)
    if not jobs_path.exists():
        print(f"subset_font_packs: no job file at {jobs_path} — nothing to do")
        return 0

    payload = json.loads(jobs_path.read_text(encoding="utf-8"))
    jobs = payload.get("jobs") or []
    if not jobs:
        print("subset_font_packs: 0 jobs")
        return 0

    if shutil.which("pyftsubset") is None:
        try:
            import fontTools  # noqa: F401
        except ImportError:
            print(
                "subset_font_packs: fontTools is not installed — skipping CJK font generation "
                "(pip install fonttools brotli)"
            )
            return 0

    generated = Path(payload["generatedDirectory"])
    source_pattern = payload["source"]
    weights = payload["weights"]

    started = time.perf_counter()
    written = 0
    total_bytes = 0
    for job in jobs:
        weight = int(job["weight"])
        if weight not in weights:
            print(f"subset_font_packs: weight {weight} is not declared in the pack config", file=sys.stderr)
            return 1
        source = Path(source_pattern.format(weight=weight))
        if not source.exists():
            print(f"subset_font_packs: missing source font {source}", file=sys.stderr)
            return 1

        name = f"{job['pack']}-{weight}-{job['fingerprint']}.woff2"
        destination = generated / name
        if destination.exists() and not args.force:
            continue

        total_bytes += build_one(source, job["characters"], destination)
        written += 1
        print(f"  {name}: {job['pack']} w{weight} ({len(job['characters'])} chars)")

    elapsed = time.perf_counter() - started
    print(
        f"subset_font_packs: wrote {written} file(s), {round(total_bytes / 1024)}KB, {elapsed:.1f}s"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
