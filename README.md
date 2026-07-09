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

## Install

It's a PWA. Serve the four files from any static host, open the page, and use
"Add to Home Screen" (iOS Safari) or the install prompt (Android/desktop
Chrome). The service worker caches everything, so it runs fully offline.
