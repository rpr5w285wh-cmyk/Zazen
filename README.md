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

`breathe.html` is a companion practice: paced breathing, chosen by benefit.
The home screen is a row of benefit filters (sleep, calm, focus, resilience,
mood, settle, getting started); each technique card shows its benefit, its
pattern in phase order (for example "4 in · 7 hold · 8 out") and an evidence
badge (Studied, Clinical use, Traditional). A detail screen gives origin,
purpose, how-to and caution before Begin.

Techniques: 4-7-8, 7-11, cyclic sighing, box breathing, coherent breathing,
resonance (a 4.5 to 6.5 breaths-a-minute slider), Nadi Shodhana, triangle,
plus the adapted patterns Soothe 4·8, Balance 5·5 and Beginner 3·5, the
cardiac-coherence presets Calming 4·6 and Energizing 6·4, a training ramp,
and a custom builder with all four phases (in, hold, out, hold) in half-second
steps. Sessions run by minutes or by breaths.

While you breathe the screen shows nothing but the bubble (or an orb): no
text, no timer, no controls. It rises on the inhale, rests through a hold,
sinks on the exhale, and for alternate-nostril breathing drifts to the side in
use, with the tone sounding from that side. On platforms with a fullscreen API
the status bar goes too. iPhones have no page fullscreen in portrait; held
sideways, iOS hides the clock and battery for home-screen apps. A double-tap
brings up pause and end; they fade again on their own.

It is reachable from the sitting app's home screen ("breathing") and can also
be added to the home screen on its own, with its own icon, from `breathe.html`.

## Install

It's a PWA. Serve the files from any static host, open the page, and use
"Add to Home Screen" (iOS Safari) or the install prompt (Android/desktop
Chrome). The service worker caches everything, so it runs fully offline.
