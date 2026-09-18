# Storefront smoke tests

Run against the already running, seeded demo storefront at localhost:3000:

```sh
npm run e2e
```

Set `PLAYWRIGHT_BASE_URL` to use a different test server. The suite never starts or stops the shared dev server, creates orders, or submits newsletter data. Requires `@playwright/test` as a project devDependency and its Chromium binary. Desktop 1440×1000 and mobile 390×844 run sequentially.

Screenshots and failure traces are under `e2e/test-results/` (ignored). Screenshots are review evidence, not approved visual baselines. Coverage includes homepage collection tabs and consent, mobile search, PDP gallery/variant/accordion interactions, published blog navigation, formatted static content, and missing-content not-found/noindex. Tests use seeded demo data.
