# Just Sitting · UX audit

Audit of the live app (`index.html` v36, `sw.js`, `manifest.json`) on 6 September 2026.
Method: full source read, then the real page driven in headless Chromium with
Playwright across six viewports (iPhone 390×844, iPhone SE 375×667 and 320×568,
landscape 844×390, tablet 768×1024, desktop 1280×800), an axe-core WCAG scan on
every screen, touch-target and contrast measurement, an offline/no-fonts run,
a reduced-motion run, and an iPhone run with the Fullscreen API removed.
Every finding below names the evidence and the code location.

One caveat on the screenshots: the audit sandbox could not reach Google Fonts,
so every screenshot shows the fallback serif (Georgia). That is itself finding
no. 6, and it is exactly what an offline or flaky-network visitor sees.

## Status

Fixes landed on this branch after the audit, by finding number:

| Commit | Findings addressed |
|---|---|
| Make the sit easier to leave and its controls easier to find | 1, 2, 3, 7, 11 |
| Stop losing the practitioner's data | 4, 5, 13, 16 |
| Self-host the fonts, allow zoom, honour reduced motion | 20, 21, 22, 24, 25 |
| Tidy the copy and layout, and give screen readers a structure | 8, 9, 10, 12, 14, 15, 17, 18, 23, 26, 27 |
| Remove the dead progression and rewrite the README | 28 |
| Let the bell be checked, and felt | 6 |

Nothing remains open. Finding 19 is moot now that past sittings carry real
minutes.

## What works well

- The atmosphere is coherent and disciplined: one accent, one type family, no chrome.
- The home screen has a single job and does it. Begin is the one prominent control.
- Timing is wall-clock based and re-syncs on `visibilitychange`, so sleep and tab throttling do not drift the bell.
- Wake lock with a canvas-video fallback, fullscreen during the sit, and a network-first service worker with versioned caches are all careful engineering.
- Local-date recording, backup/restore with input validation, and the vow editor's per-line labels are thoughtful.
- Keyboard focus is visible (Chromium's focus ring shows on Begin). No screen overflows horizontally at any tested width, and the closing screen still fits at 320×568.

## Severity scale

- **Critical**: blocks the core task or silently loses the user's data.
- **High**: most users will hit it and it materially hurts the experience.
- **Medium**: noticeable friction, confusion, or an accessibility failure.
- **Low**: polish.

## Findings

### The sitting itself

**1. High · The closing sequence holds the user for about 46 seconds with nothing to tap, and the first 9 seconds are a blank screen.**
Measured: from tapping End on a 1-minute sit to the `return` link becoming visible took 46.3 s. During the first 9 s (`renderVows`, `pauseMs = 9000`) the screen shows only the background gradient. The summary line exists in the DOM at opacity 0 the whole time. Someone who tapped End by mistake, or whose phone rang, is stuck. Testing mode already surfaces `return` after 2.5 s (`startCloseGlyph`), which suggests the authors felt this themselves.
Recommendation: keep the ritual, but show a faint `return` after about 3 s, and let a tap anywhere skip to the vow stack. During the 9 s pause leave the timer display on screen, dimming, so the app does not look dead.

**2. High · Pause and End are invisible, summoned only by a double-tap that is never explained on screen.**
`.controls` is opacity 0 and `pointer-events: none` until a double-tap within 300 ms (`#practice` click handler). No cue, hint, or settings note mentions the double-tap. The only visible hint during the sit is "tap the circle to begin sitting", which is the *single*-tap action for settling. A first-time user looking for a way to pause will single-tap, which during zazen fires the kyōsaku: a loud wooden crack after a 5.6 s ceremony, with taps locked for 6.5 s.
Recommendation: show the controls for the first few seconds of each sit and let them fade; add one settle cue that says "double-tap anywhere for pause and end"; consider making the single-tap kyōsaku opt-in in settings.

**3. High · On iPhones the kyōsaku cue never appears, so single-tap is unexplained on the primary device.**
On iPhone the Fullscreen API is absent on `documentElement`, so `startPhase` inserts the "turn the phone sideways" cue, making six cues. `startSettleCues` uses `max(5000, 25000/6) = 5000 ms`, so cue six is due at 25.0 s, the instant the 25 s settle ends and `stopSettleCues` runs. Verified with the API removed: five cues rendered at 0, 6, 11, 16, 21 s; "touch the screen to receive the stick" never rendered.
Recommendation: size the interval to the cue count (`settleSec / cues`, floor 4 s), or drop the interval floor to 4 s, or lengthen the settle to 30 s when six cues are queued.

**4. High · The Back button leaves the app mid-sit.**
No `history.pushState` or `popstate` handling anywhere; `history.length` stays at 2 after visiting every screen. On Android, the hardware Back gesture from the practice screen exits the PWA and the sit is lost with nothing recorded. In a browser tab, Back navigates away the same way.
Recommendation: push a history entry per screen; on `popstate` during practice, show the controls instead of leaving; on other screens, return home.

**5. High · An in-progress sit is not persisted.**
`plan`, `phaseIdx`, `phaseEndAt` and `sessionStartAt` live only in memory. A reload, PWA eviction while backgrounded (iOS does this after a few minutes), or the Back issue above loses everything; `record()` never runs.
Recommendation: write the session start and plan to `localStorage` on Begin; on load, if a sit is still live by wall clock, resume it at the right phase; if it ended while away, record it and show the closing.

**6. Medium · The end of the sit is signalled by sound alone, with no way to test the bell first and no haptic fallback.**
If the iPhone silent switch is on, WebAudio in a standalone web app is muted, so the closing keisu is silent. The first settle cue tells people to unmute but gives them no way to check. The only non-audio cue is the screen changing to the closing pause, which is a blank screen (finding 1), and the practice asks for lowered eyes.
Recommendation: a "sound the bell" button in settings; `navigator.vibrate` on phase boundaries where supported; a visible change on the closing screen at second zero.

**7. Medium · Pause, End, and the length chips are below comfortable touch size.**
Measured: length chips 49×32 px, `the record`/`settings` 35 px tall, Pause 79×39 and End 61×39 with a 28 px gap. Apple's guideline is 44 pt; WCAG 2.5.8 minimum is 24 px, so these pass the floor but not the target. Pause and End are the ones people hit with lowered eyes.
Recommendation: `min-height: 44px` on `.controls button`, `.adjust button`, and `.ghost-link`; widen the gap between Pause and End.

### Home

**8. Medium · The plan row reads "settle 0m · sit 5m (5m)".**
`renderPlan` rounds the 25 s settle with `Math.round(sec/60)` to 0. It looks like a bug on the first screen every user sees.
Recommendation: show "settle 25s" or omit the settle segment and show "5 min, after a short settling".

**9. Medium · The length is stated three times in a row.**
"5 MINUTES", then "5 minutes. Count each exhalation…", then "settle 0m · sit 5m (5m)". The stage name, stage description and plan row were designed for the old progression; with fixed lengths they say the same thing.
Recommendation: drop the stage name or the plan row, and start the description with the method, not the number.

**10. Medium · Plural forms are wrong at 1.**
"1 sittings across 1 days." (`renderHome`) and "1 sittings · 1 days · 0 minutes" (`renderLog`).

**11. Medium · On a 320×568 phone the title is clipped; in landscape, Begin is below the fold.**
Portrait home is not scrollable (`html, body { overflow: hidden }`; only the landscape media query adds `overflow-y: auto` to `#home`), and the flex centring pushes the top 13 px off screen at 320×568, cutting "JUST SITTING". At 844×390 the home scrolls, but Begin sits just under the fold.
Recommendation: allow `#home.active` to scroll at any orientation when taller than the viewport, and use `justify-content: safe center`.

**12. Low · Six length chips wrap as 4 + 2, and the five display options as 4 + 1.**
Orphaned second rows in both places (`.adjust` at `max-width: 320px`).
Recommendation: 3 + 3 for lengths; a single row for display options, or a segmented control.

### Settings

**13. High · Unsaved vow edits are discarded silently, and three actions overwrite data with no confirmation or undo.**
- `settingsReturn` calls `renderHome(); show('home')` and never reads the textareas. Typing new vows and tapping `return` loses them.
- `restore traditional vows` saves immediately, unlike the editor which needs `save`.
- `restore from backup` replaces the whole record and vows in one tap.
- `Mark a past sitting` appends an entry on every tap, dated today, with 0 minutes, no confirm, no undo, and there is no way to delete an entry anywhere in the app.
Recommendation: autosave vows on input (or prompt on leaving with unsaved changes); a two-step confirm on the two restores; make "past sitting" ask for a date and a length and offer "undo" for a few seconds.

**14. Medium · Settings is a 1,400 px scroller inside a 724 px box, with no scroll cue and the only exit at the bottom.**
`#settings.active { max-height: calc(100dvh - 120px); overflow-y: auto }`. On the 390 phone the vow textarea is visibly cut at the bottom edge, which is the only hint that more exists. `return` is the last element, after Backup. Two thirds of the content is never seen by someone who does not scroll.
Recommendation: a `return`/`done` control at the top; let the page scroll normally instead of a nested scroller; order sections by frequency of use.

**15. Medium · Developer features lead the screen.**
"Testing mode" is the first row of Settings, and "v36 · standalone" ends it. The most likely reason a practitioner opens Settings is the vows or the timer display.
Recommendation: order as Timer display, The vows, Backup, then Testing mode at the bottom; drop "standalone" from the version mark.

**16. Medium · Emptying all four vow lines silently restores the traditional vows.**
`vowSave`: if every line is blank it saves `DEFAULT_VOWS`. The note above says "Leave a line empty to omit it." Someone who wants a silent closing gets the four traditional vows instead.
Recommendation: allow an empty set (skip the vow stack) or say what happens.

**17. Low · Choosing "incense" for a sit under five minutes silently shows the ring.**
`resolveDisplay` falls back without telling the user; the note explains auto only.

### The record

**18. Medium · The 28-day grid has no calendar orientation.**
No weekday labels, no dates, no month boundary, no per-cell label or title, and the lone "today" marker is a 1 px outline in the faintest ink. Empty cells sit at 1.07:1 against the background, so on a real phone in low light the grid is mostly invisible. "current thread" is unexplained vocabulary for the streak.
Recommendation: weekday initials across the top, a month tick, a `title`/`aria-label` per cell with date and minutes, a slightly brighter empty cell, and either "streak" or a tooltip for "thread".

**19. Low · "0 minutes" after marking a past sitting.**
Because past sittings are recorded with `m: 0`, the totals line can read "1 sittings · 1 days · 0 minutes". Tied to finding 13.

### Loading, offline, and platform

**20. High · Fonts are render-blocking and are not cached offline, so the PWA's look depends on the network.**
`@import url('https://fonts.googleapis.com/…')` inside the inline `<style>` blocks first paint until the CSS request resolves. In this audit that took 13.3 s to load the page (the request was reset), and the whole app rendered in Georgia. The two font families are also absent from the service worker's `ASSETS` list, so the "runs fully offline" promise renders in the fallback face.
Recommendation: replace the import with `<link rel="preconnect">` plus a `<link rel="stylesheet" … display=swap>`; better, self-host the four woff2 files next to `index.html` and add them to `ASSETS`.

**21. High · Pinch zoom is disabled.**
`maximum-scale=1.0, user-scalable=no` in the viewport meta. axe flags this as critical (WCAG 1.4.4). Most of the app's text is 12.8–15 px italic in low contrast, exactly where zoom matters.
Recommendation: `width=device-width, initial-scale=1, viewport-fit=cover`.

**22. Medium · Reduced motion is not honoured.**
No `prefers-reduced-motion` rule. The flame flicker, the morphing closing glyph, screen fades, and sand/ember transitions all run for users who asked the OS to reduce motion.
Recommendation: one media block that sets `animation: none` and shortens transitions, and a static glyph path in `startCloseGlyph`.

**23. Medium · Desktop: Begin forces fullscreen and there are no keyboard shortcuts.**
`enterFullscreen()` runs on every Begin, so on a laptop the browser posts its "press Esc to exit" banner over the settle screen; Esc then leaves fullscreen with no way back. Tab reaches the invisible Pause button, so keyboard users can operate a control they cannot see. Nothing maps Space to pause or Esc to end.
Recommendation: request fullscreen only on touch devices; Space toggles pause, Escape shows the controls; keep the controls out of the tab order while hidden (`visibility: hidden`).

**24. Low · No safe-area handling.**
`viewport-fit=cover` with a black-translucent status bar, but no `env(safe-area-inset-*)`. In landscape the controls are `position: fixed; bottom: 10px`, which puts them under the home indicator on notched iPhones.

**25. Low · Missing favicon.**
No `<link rel="icon">`; `/favicon.ico` 404s on every load, and desktop tabs show a blank icon. `icon.svg` already exists.

### Accessibility (screen readers)

**26. Medium · No landmarks, headings, or live regions.**
axe: no `main`, no `h1`, content outside landmarks on every screen. "Settings", "The Record", and the phase label are `div`s. Phase changes, settle cues, and the closing summary update text with no `aria-live`, so a screen-reader user hears nothing when the bell sounds. The length and display option groups are buttons with no `aria-pressed`. The kanji title has no `lang="ja"`. The SVG timers have no accessible name, so the only sense of progress is visual.
Recommendation: `<main>`, an `h1` per screen (visually styled as now), `aria-live="polite"` on `#phaseGuide`, `#phaseLabel` and `#sitSummary`, `aria-pressed` on the option chips, `lang="ja"` on `.kanji`, and an `aria-label` on `#orbWrap` that reads remaining time.

**27. Low · The faintest ink is used for the smallest text.**
`--ink-faint` is 5.4:1 on the background, which passes AA, but it carries the 12.8 px italic labels, links and notes. The skip hint at 70 % opacity is 3.2:1 and the version mark at 50 % is 2.3:1, both below AA for text that size.

### Documentation

**28. Low · README describes a product that no longer ships.**
It promises a progression ("as sits accumulate the app opens longer periods", kinhin, shikantaza) and a fixed-length option "in settings". The app now offers six fixed lengths on the home screen and no progression; `STAGES`, `nextStage`, `scaleStructure`, `PHASE_META.kinhin` and the taku/inkin signals are dead code. It also says the kyōsaku is "on longer sits" when it is on every sit.

## Measurements

| Check | Result |
|---|---|
| Page load, sandbox (fonts request reset) | 13.3 s |
| End to `return` visible, real mode | 46.3 s |
| Blank pause after the closing bell | 9.0 s |
| Settle cues shown on iPhone | 5 of 6 |
| Controls auto-hide after showing | 4.0 s |
| Length chip height | 32 px |
| Pause / End height | 39 px |
| Ghost link height | 35 px |
| Settings scroll height / visible | 1389 / 724 px |
| `--ink` on background | 17.0:1 |
| `--ink-dim` on background | 10.2:1 |
| `--ink-faint` on background | 5.4:1 |
| Skip hint (70 % faint) | 3.2:1 |
| Version mark (50 % faint) | 2.3:1 |
| Empty record cell | 1.07:1 |
| axe violations per screen | 4 (viewport, main, h1, region) |
| Horizontal overflow at any width | none |

## Suggested order of work

1. Findings 1, 2, 3, 7: the sit and its exit. Small CSS and timing changes, biggest daily effect.
2. Findings 13, 4, 5: stop losing data. Autosave, confirms, history entries, persisted session.
3. Findings 20, 21, 22: loading and platform hygiene. Fonts, zoom, reduced motion.
4. Findings 8, 9, 10, 14, 15, 18: copy and layout tidy-ups. An afternoon.
5. Finding 26: screen-reader structure.
6. Finding 28: prune the dead progression code and rewrite the README to match.
