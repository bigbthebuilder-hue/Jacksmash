# Jacksmash safe animation system v1

## New animation baseline

This replaces the risky animation style with a mobile-safe system.

## Removed / disabled

- particles
- big screen overlays
- bonus-earned overlay
- animated tile effects
- blur/filter/backdrop-filter effects
- pulsing bonus animations
- glow-heavy moving shadows
- long animations

## Kept

- quick placement pop
- quick line flash
- quick clear flash
- quick bonus-use cell flash
- static bonus-ready highlight
- simple new-best stamp

## Why

The previous glitch was likely caused by mobile GPU/compositing pressure after long play.
This version avoids the CSS properties most likely to trigger those black repaint blocks.

## Deploy

```bash
git add .
git commit -m "Use safe animation system"
git push
```
