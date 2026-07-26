#!/bin/bash
# Assemble the self-contained Claude Code skill from the repo.
#
#   ./pipeline/build_skill.sh
#
# SKILL.md is hand-written and is the source of truth for the workflow. Everything
# else in skills/keyframe/ is COPIED from pipeline/, refs/ and video/ so there is
# exactly one home for each file and the skill cannot drift from what the repo
# actually does. Re-run after changing any doc, script or spec.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
S=skills/keyframe

[ -f "$S/SKILL.md" ] || { echo "missing $S/SKILL.md — that one is hand-written" >&2; exit 1; }

rm -rf "$S/references" "$S/scripts" "$S/template"
mkdir -p "$S/references/specs" "$S/scripts" "$S/template"

# ── the law and the pattern library
for f in PRINCIPLES.md PATTERNS.md MOVE_VOCAB.md MOVE_VOCAB_ADDITIONS.md SPEC_TEMPLATE.yaml; do
  [ -f "pipeline/$f" ] && cp "pipeline/$f" "$S/references/$f"
done

# ── the specs: our own written analysis, safe to ship
cp refs/specs/*.yaml "$S/references/specs/" 2>/dev/null || true

# ── measured analysis text (no imagery — see .gitignore for why)
mkdir -p "$S/references/analysis"
for d in refs/analysis/*/; do
  [ -f "$d/profile.md" ] || continue
  n=$(basename "$d")
  mkdir -p "$S/references/analysis/$n"
  cp "$d/profile.md" "$S/references/analysis/$n/" 2>/dev/null || true
done

# ── executable pipeline
for f in analyze.py analyze_audio.py make_sfx.py set_music.py post.sh build.sh \
         fetch_refs.sh fetch_music.sh probe_account.sh ingest.sh; do
  [ -f "pipeline/$f" ] && cp "pipeline/$f" "$S/scripts/$f"
done
chmod +x "$S"/scripts/*.sh 2>/dev/null || true

# ── the Remotion project: move library + sequencing + a worked composition.
# Source, config and manifests only — no node_modules, no renders, no audio.
mkdir -p "$S/template/src"
cp -R video/src/moves "$S/template/src/moves"
cp -R video/src/lib "$S/template/src/lib"
cp -R video/src/compositions "$S/template/src/compositions"
cp video/src/Root.tsx video/src/index.ts "$S/template/src/"
cp video/package.json video/tsconfig.json video/remotion.config.ts "$S/template/"
find "$S/template" -name "*.mp3" -delete 2>/dev/null || true

cat > "$S/template/README.md" <<'EOF'
Remotion project skeleton: the move library (`src/moves`), shot sequencing with a
beat grid and timing audit (`src/lib/film.tsx`), and one worked launch film
(`src/compositions/product-os`) to read as an example.

    npm install
    python3 ../scripts/make_sfx.py --out public/sfx
    npx remotion studio

`beatgrid.ts` is generated — point it at a track with `scripts/set_music.py`.
Audio is not included; supply your own and check its licence.
EOF

cat > "$S/references/README.md" <<'EOF'
- `PRINCIPLES.md`  the numeric craft rules. Read before writing motion code.
- `PATTERNS.md`    12 pattern families aggregated across the whole corpus, ranked,
                   with the techniques multiple independent designers converge on.
- `MOVE_VOCAB.md` + `MOVE_VOCAB_ADDITIONS.md`  the named moves and their defaults.
- `SPEC_TEMPLATE.yaml`  one schema for describing a reference AND authoring new work.
- `specs/`         per-reference specs: shot lists, moves with frame counts, and a
                   `remotion_recipe` naming the mechanism for each technique.
- `analysis/`      measured `profile.md` per reference: shot table with velocity
                   classification, three motion curves, palette, frozen stretches.

The reference VIDEOS are not included — they are other designers' portfolio work.
`scripts/fetch_refs.sh --analyze` rebuilds them and their contact sheets locally.
EOF

echo "skill assembled:"
echo "  references/       $(ls "$S/references" | wc -l | tr -d ' ') items, $(ls "$S/references/specs" | wc -l | tr -d ' ') specs, $(ls "$S/references/analysis" 2>/dev/null | wc -l | tr -d ' ') profiles"
echo "  scripts/          $(ls "$S/scripts" | wc -l | tr -d ' ') files"
echo "  template/src/     $(find "$S/template/src" -type f | wc -l | tr -d ' ') files"
echo "  total size        $(du -sh "$S" | cut -f1)"
