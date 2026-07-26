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
