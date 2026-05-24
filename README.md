# Jacksmash

Bright, phone-friendly drag-and-drop block puzzle game.

## Run locally

```bash
npm install
npm run dev
```

## Rebalanced in this version

- Reduced small L-piece frequency.
- Prevents more than one small L piece in the same 3-piece tray.
- Easy pool now favors lines, 2×2 squares, and brick pieces.
- Medium pool favors lines, T/Z pieces, squares, and bricks.
- Large clearing pieces show up more often when the board has room.
- 1×1 and 1×2 pieces are still removed.

## Current bonuses

- Hammer — clears 1 block. Max 2.
- Bomb — clears a 3×3 area. Max 1.
- Line Blaster — clears 1 row or 1 column. Max 1.
- Shuffle — rerolls the current 3 pieces. Max 1.

## Earning rules

- Clear 2 lines = Hammer
- Clear 3 lines = Bomb
- Clear 4+ lines = Line Blaster + Bomb
- Combo 4+ = Hammer
- Every 1500 score = Shuffle


## Vercel build note

This version uses Node to run Vite directly:

```bash
node node_modules/vite/bin/vite.js build
```

That avoids Vercel permission errors with `node_modules/.bin/vite`.
