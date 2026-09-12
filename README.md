# Zazen · 只管打坐 (Just Sitting)

A quiet, single-file zazen timer. No accounts, no ads, no network after the
first visit — just a candlelit screen, a bell, and the sitting.

## Practice

Sittings unfold in stages: you begin with one minute of counted breaths, and
as sits accumulate the app opens longer periods — following the breath, two
periods bridged by kinhin (walking meditation), and finally shikantaza, just
sitting. Prefer one length every day? Set a fixed sitting length in settings
and the progression rests.

Each sitting opens with the han (the wooden board that calls to the hall),
begins and ends with the keisu bell, and closes with the four bodhisattva
vows — which you can personalize in settings. On longer sits, a tap requests
the kyōsaku.

Time is shown as a ring, an hourglass, or a burning incense stick.

## The record

Every completed sitting is marked in the record — a 28-day grid with totals
and the current streak. Data lives in `localStorage` on your device; nothing
leaves it. Settings offers a copy-paste backup code for moving to a new phone
or surviving a browser-data reset.

## Breathing

`breathe.html` is a companion practice: paced breathing for cardiac
coherence, in the manner of RespiRelax+. Choose a rhythm — calming (4 in, 6
out), balanced (5·5), energizing (6·4), a training ramp that eases down to
5·5, or a custom count of 3–8 seconds each way — and a length of 3 to 20
minutes. A bubble rises as you breathe in and sinks as you breathe out (or an
orb swells and shrinks); a soft tone marks each turn and a bell opens and
closes the session.

While you breathe the screen shows nothing else: no text, no timer, no
controls. On platforms with a fullscreen API the status bar goes too. iPhones
have no page fullscreen in portrait; held sideways, iOS hides the clock and
battery for home-screen apps, and the page says so. A double-tap brings up
pause and end; they fade again on their own.

It is reachable from the sitting app's home screen ("breathing") and can also
be added to the home screen on its own, with its own icon, from `breathe.html`.

## Install

It's a PWA. Serve the files from any static host, open the page, and use
"Add to Home Screen" (iOS Safari) or the install prompt (Android/desktop
Chrome). The service worker caches everything, so it runs fully offline.
