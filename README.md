# Jacksmash

Bright, phone-friendly drag-and-drop block puzzle game.

## Phone layout pass v1

This version fixes the mobile height issue seen on the S24 Ultra.

Changes:
- More compact header.
- Smaller stat cards.
- Bonus buttons now fit in one compact row on phones.
- Smaller board padding and cell gaps.
- Board uses flexible remaining height.
- Piece tray stays visible at the bottom.
- Extra compact mode for shorter browser viewports.
- Includes Vercel build permission fix.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
git add .
git commit -m "Fix phone layout"
git push
```

Vercel should redeploy automatically.
