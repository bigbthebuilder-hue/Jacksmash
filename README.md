# Jacksmash

Medium L + open-room 3x3 boost v1

## Changes

- Added a new **Medium L** piece set.
- Medium L is **3 squares long and 2 squares wide**.
- Added all **4 rotations** of the Medium L.
- Increased **3×3 square** frequency whenever the board has lots of open room.
- The 3×3 boost is based on open space, not difficulty.
- Keeps the earlier small-L control rules.

## New Medium L pieces

- l4a
- l4b
- l4c
- l4d

## Generation update

When the board has **48+ empty cells**, the generator now strongly boosts:
- 3×3 squares
- larger clearing pieces
- the new Medium L pieces

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
git add .
git commit -m "Add medium L and boost 3x3 squares"
git push
```
