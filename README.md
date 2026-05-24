# Jacksmash

Offline fixed v2.

## What changed

This version replaces the hand-written service worker with `vite-plugin-pwa`.

The production build now automatically precaches:
- HTML
- JS
- CSS
- manifest
- icon
- app shell files

This should fix the phone showing "offline" when opening the installed app without internet.

## Very important

After deploying this version:

1. Open the live Vercel link with internet.
2. Refresh once.
3. Close the app/browser.
4. Open Jacksmash again with internet one more time.
5. Then turn off Wi-Fi/data and test the home-screen app.

The first online open installs the service worker.
The second online open makes sure the installed app is controlled by it.

## If the old offline error keeps showing

Remove the old home-screen icon and install it again from the main production Vercel link.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
git add .
git commit -m "Fix offline PWA caching"
git push
```
