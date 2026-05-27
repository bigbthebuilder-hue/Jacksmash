# Jacksmash stable animation v1

## Purpose

This version is built to stop mobile screen glitches/black repaint blocks during longer play.

## Changes

- Disabled particle overlays.
- Disabled big fixed screen text overlays.
- Disabled continuous tile animations.
- Disabled blur/filter/backdrop-filter effects.
- Removed pulsing bonus animations.
- Kept simple short feedback:
  - quick line flash
  - short clear flash
  - small bonus-earned toast
  - small new-best stamp
- Gameplay is unchanged.
- Drag placement sync is preserved.

## Deploy

```bash
git add .
git commit -m "Use stable animation mode"
git push
```
