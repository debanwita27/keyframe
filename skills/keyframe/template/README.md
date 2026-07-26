Remotion project skeleton: the move library (`src/moves`), shot sequencing with a
beat grid and timing audit (`src/lib/film.tsx`), and one worked launch film
(`src/compositions/product-os`) to read as an example.

    npm install
    python3 ../scripts/make_sfx.py --out public/sfx
    npx remotion studio

`beatgrid.ts` is generated — point it at a track with `scripts/set_music.py`.
Audio is not included; supply your own and check its licence.
