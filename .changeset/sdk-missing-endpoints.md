---
"@veribenim/core": minor
---

Eksik platform uçları core'a eklendi:

- `trackPageview()` — Web Analytics hit toplama (`POST /api/v/{token}/e`, sendBeacon uyumlu, yoksa keepalive fetch).
- `scanCookies(url)` — public çerez tarama (`POST /api/public/cookie-scan`).
- `verifyDomain(domain?)` — public domain doğrulama (`GET /api/public/verify/{domain}`).
- `impressionPixelUrl(opts?)` — 1x1 pixel impression `<img>` fallback URL'i (`GET /api/impressions/{token}/pixel`).

`ConsentAction` birleşimine `withdraw` eklendi (platform bu aksiyonu doğruluyordu).

Yeni tipler: `AnalyticsHitPayload`, `CookieScanResponse`, `CookieScanResultItem`, `DomainVerifyResponse`, `ImpressionPixelOptions`.

Bu metotlar `@veribenim/react`, `@veribenim/vue`, `@veribenim/nuxt`, `@veribenim/nextjs` paketlerinden `client` üzerinden otomatik erişilebilir.
