#!/usr/bin/env python3
"""
Stitch pipeline/vocab-parts/*.md into one canonical MOVE_VOCAB.v2.md.

The reconciliation is split across four agents by pattern family, because a
single agent trying to emit ~100 moves in one file blew the 64k output limit.
Each part contributes its family tables plus Aliases / Conflicts / Dropped
sections scoped to its own families; this merges them and carries the easing
reference over from MOVE_VOCAB.md verbatim, since that part is already canonical.

  python3 pipeline/assemble_vocab.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTS = sorted((ROOT / "pipeline/vocab-parts").glob("*.md"))
OUT = ROOT / "pipeline/MOVE_VOCAB.v2.md"
SECTIONS = ("Aliases", "Conflicts", "Dropped")

HEADER = """# Move vocabulary — canonical

One name per mechanism. This file supersedes `MOVE_VOCAB.md` and
`MOVE_VOCAB_ADDITIONS.md`, which fragmented into three overlapping sources: the
original ~45 moves, ~25 later proposals, and ~169 `new_moves:` proposals written
independently across 47 reference specs by authors who could not see each other's
work. Duplicates under different names were certain, and a model reading all
three got contradictory vocabularies with no precedence.

**Precedence, in order:**

1. A name already in the original `MOVE_VOCAB.md` wins for the same mechanism.
2. Otherwise the clearest of the competing proposals wins.
3. A move already implemented in `video/src/moves/` keeps its exported name.

When a future spec proposes a name for something already here, add it to the
Aliases table rather than renaming the canonical entry — the 47 existing specs
still contain the old names and have to stay interpretable.

**`status` column:** `built: ExportName` means it exists in `video/src/moves/`
and can be imported today. `spec-only` means it is described precisely enough to
build but has not been built — expect a spec citing it not to compile.

**Two moves that look like duplicates and are not.** These recur, so they are
called out up front:

- `motionTrail` offsets echoes in **time** (2f apart). `holoEchoOutline` offsets
  them in **scale and hue**, perfectly time-synced. Same idea, different mechanism.
- `orbitRing` **rotates continuously** as ambient. `radialCluster` places items
  **statically** with per-item idle and staggers their arrival. Same geometry,
  opposite intent.

---
"""


def easing_reference() -> str:
    """Carry the easing + spring tables over from MOVE_VOCAB.md unchanged."""
    src = (ROOT / "pipeline/MOVE_VOCAB.md").read_text()
    m = re.search(r"(## Easing names used throughout.*?)(?=\n## )", src, re.S)
    if not m:
        return ""
    return m.group(1).rstrip() + "\n\n---\n"


def split_part(text: str):
    """Return (family_body, {section_name: rows}) for one part file."""
    idx = len(text)
    for name in SECTIONS:
        m = re.search(rf"^### {name}\b.*$", text, re.M)
        if m:
            idx = min(idx, m.start())
    families = text[:idx].rstrip()

    found = {}
    for name in SECTIONS:
        m = re.search(rf"^### {name}\b[^\n]*\n(.*?)(?=^### |\Z)", text, re.M | re.S)
        if m:
            rows = [
                ln for ln in m.group(1).strip().splitlines()
                # keep data rows only; headers and separators are re-emitted once
                if ln.strip().startswith("|") and not re.match(r"^\|[\s:|-]+\|$", ln.strip())
            ]
            if rows and re.search(r"\|\s*(proposed|move A|proposal)\s*\|", rows[0], re.I):
                rows = rows[1:]
            found[name] = rows
    return families, found


def family_sort_key(body: str):
    m = re.search(r"^## (\d+)\.(\d+)", body, re.M)
    return (int(m.group(1)), int(m.group(2))) if m else (99, 99)


def main():
    if not PARTS:
        sys.exit("no parts in pipeline/vocab-parts/ — run the reconciliation agents first")

    bodies, merged = [], {k: [] for k in SECTIONS}
    for p in PARTS:
        fam, secs = split_part(p.read_text())
        # one part file may carry several families; keep them together, sort later
        bodies.append(fam)
        for k, rows in secs.items():
            merged[k].extend(rows)

    bodies.sort(key=family_sort_key)

    heads = {
        "Aliases": ("Every proposed name that was folded away, and what it maps to. The 47 "
                    "specs still use these names.", "| proposed name | canonical |\n|---|---|"),
        "Conflicts": ("Pairs that look like duplicates but are genuinely different mechanisms, "
                      "deliberately kept apart.", "| move A | move B | how to tell them apart |\n|---|---|---|"),
        "Dropped": ("Proposals too vague to parameterise, and why. Recorded so they are not "
                    "re-proposed.", "| proposal | why |\n|---|---|"),
    }

    out = [HEADER, easing_reference(), "\n\n".join(bodies), "\n---\n"]
    for name in SECTIONS:
        rows = merged[name]
        if not rows:
            continue
        blurb, header = heads[name]
        out.append(f"## {name}\n\n{blurb}\n\n{header}\n" + "\n".join(rows) + "\n")

    OUT.write_text("\n".join(out))

    moves = len(re.findall(r"^\|\s*`[a-zA-Z]", OUT.read_text(), re.M))
    built = len(re.findall(r"built:\s*[A-Z]", OUT.read_text()))
    print(f"wrote {OUT.relative_to(ROOT)}")
    print(f"  parts merged     {len(PARTS)}")
    print(f"  families         {len(bodies)}")
    print(f"  canonical moves  ~{moves}  ({built} built, {moves - built} spec-only)")
    for name in SECTIONS:
        print(f"  {name.lower():<16} {len(merged[name])}")


if __name__ == "__main__":
    main()
