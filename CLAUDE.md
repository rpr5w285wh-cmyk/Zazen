# Zazen

Static PWA, no build step. Pushes to `main` deploy to GitHub Pages via
`.github/workflows/deploy-pages.yml`.

Live site:
- https://rpr5w285wh-cmyk.github.io/Zazen/ (Just Sitting)
- https://rpr5w285wh-cmyk.github.io/Zazen/breathe.html (Breathing)

After every merge to `main`, show the user the live links above.

When changing `index.html` or `breathe.html`, bump `APP_VERSION` (kept in
step in both files) so installed copies refresh their service-worker cache.
