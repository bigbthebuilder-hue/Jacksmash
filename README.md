# Jacksmash drag placement sync v1

## Fixed

The dragged block was visually moved up above your finger, but the board preview/drop targeting was still using your actual finger point.

This version syncs them.

## Change

Both now use the same offset:

```js
const DRAG_VISUAL_Y_OFFSET = 70;
```

That means:
- visual piece sits above your finger
- board preview matches the visual piece
- drop placement matches the visual piece
- side-to-side alignment stays unchanged

## Deploy

```bash
git add .
git commit -m "Sync drag visual and board placement"
git push
```
