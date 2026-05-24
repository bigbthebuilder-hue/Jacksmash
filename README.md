# Jacksmash

Offline + bonus earned animation v1.

## Added

- Bonus-earned animation when a power is awarded.
- Large bonus-earned overlay.
- Bonus-specific colors for Hammer, Bomb, Blaster, and Shuffle.
- Service worker offline caching.
- Installed app can open offline after it has loaded once online.

## Important offline note

After deploying:
1. Open the app once with internet.
2. Let it fully load.
3. Then it should open offline from the home-screen app.

When updating future versions, the phone may need:
- close/reopen the app, or
- open the app once while online

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
git add .
git commit -m "Add offline and bonus earned animation"
git push
```
