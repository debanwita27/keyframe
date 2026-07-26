- `PRINCIPLES.md`  the numeric craft rules. Read before writing motion code.
- `PATTERNS.md`    12 pattern families aggregated across the whole corpus, ranked,
                   with the techniques multiple independent designers converge on.
- `MOVE_VOCAB.md`   the canonical vocabulary. Part 1 = 49 primitives + the timing
                   law; Part 2 = 107 compositional moves by pattern family; then
                   Aliases (names folded away, still used by the specs), Conflicts
                   (look-alike pairs deliberately kept apart) and Dropped.
                   Check `status` — spec-only moves are not built yet.
- `SPEC_TEMPLATE.yaml`  one schema for describing a reference AND authoring new work.
- `specs/`         per-reference specs: shot lists, moves with frame counts, and a
                   `remotion_recipe` naming the mechanism for each technique.
- `analysis/`      measured `profile.md` per reference: shot table with velocity
                   classification, three motion curves, palette, frozen stretches.

The reference VIDEOS are not included — they are other designers' portfolio work.
`scripts/fetch_refs.sh --analyze` rebuilds them and their contact sheets locally.
