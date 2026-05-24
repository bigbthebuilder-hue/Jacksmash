# Jacksmash performance-safe animations v1

## Why

The previous animation pass was too heavy for phone GPUs after longer play sessions.
It could cause black repaint blocks and glitchy areas after repeated bonus/clear animations.

## Changes

- Removed heavy blur/filter use from overlays.
- Removed the large flying bonus card movement.
- Replaced it with a lightweight top toast.
- Bonus buttons still pulse when ready/active.
- Reduced particle count.
- Reduced overlay duration.
- Simplified line strike, bomb, shuffle, and new-best animations.
- Kept gameplay, stats, offline setup, medium L rules, and drag placement sync.

## Deploy

```bash
git add .
git commit -m "Use performance safe animations"
git push
```
