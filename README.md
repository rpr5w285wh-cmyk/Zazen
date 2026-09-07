# Zazen · 只管打坐 (Just Sitting)

A quiet, single-file zazen timer. No accounts, no ads, no network after the
first visit — just a candlelit screen, a bell, and the sitting.

## Practice

Choose a length on the home screen — one, three, five, ten, fifteen or twenty
minutes — and tap Begin. The han (the wooden board that calls to the hall)
sounds while you settle; a few cues pass on screen (unmute the phone, find
the posture, what to do when the bell sounds), and a tap on the circle begins
the sit at once if you are already seated. Two strikes of the keisu open the
sitting; three closing strikes end it.

Shorter sits count the breath, one through ten. Ten minutes follows the
breath without counting. Fifteen and twenty are shikantaza — just sitting.

During the sit the screen shows only the timer: a ring, an hourglass, or a
burning incense stick, following the length (or fixed in settings). Pause
and End show for a few seconds at the start, then withdraw; a touch anywhere
brings them back. Turn on the kyōsaku in settings and a single touch instead
requests the stick — a bow, then a sharp strike — while two touches find
pause and end.

The sit closes with the four bodhisattva vows, which you can personalize in
settings. The closing is a small ceremony you can sit through, or touch to
skip once the bell has faded.

## The record

Every completed sitting is marked in the record — a 28-day grid with weekday
headings, totals and the current streak. A sit ended early still counts once
a minute of zazen has passed. Sits done away from the app can be added with
a date and a length.

Data lives in `localStorage` on your device; nothing leaves it. Settings
offers a copy-paste backup code for moving to a new phone or surviving a
browser-data reset. A sit in progress is remembered too: if the app is
reloaded or put away mid-sit, it picks up where it was, and a sit that
finished while the app was closed is recorded on the day it ended.

## Install

It's a PWA. Serve the repository from any static host, open the page, and
use "Add to Home Screen" (iOS Safari) or the install prompt (Android/desktop
Chrome). The service worker caches everything, including the two typefaces
in `fonts/`, so it runs fully offline.

## Development

The app is `index.html`; `sw.js` and `manifest.json` are its companions.
There is no build step. Bump `APP_VERSION` at the top of the script on each
change — it names the service worker cache, so installed copies refresh.
`docs/UX-AUDIT.md` holds the audit that shaped the current version.
