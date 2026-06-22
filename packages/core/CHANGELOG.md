# @veribenim/core

## 6.0.0

### Major Changes

- 26e17fd: KIRICI: Consent veri modeli platformla hizalandı.

  Platformun otoritatif kategori anahtarları `strictly_necessary, functional, analytics, marketing`. SDK daha önce yanlış anahtarlar (`necessary`, `preferences`) ve yanlış alan adı (`preferences`) kullanıyordu; bu yüzden rıza yazma/okuma sessizce hatalıydı.

  Değişiklikler:

  - `ConsentPreferences` anahtarları: `necessary`→`strictly_necessary`, `preferences`→`functional` (artık: `strictly_necessary, functional, analytics, marketing`).
  - `ConsentLogPayload.preferences` → `ConsentLogPayload.consents` (platform `consents` bekliyor).
  - `savePreferences()` artık gövdede `consents` gönderiyor ve `SavePreferencesResponse` (`{status, message}`) döner (önceki `PreferencesResponse` şekli yanlıştı).
  - `PreferencesResponse` gerçek `GET /api/preferences` yanıtına göre yeniden tanımlandı: `categories` + `current_consents` (nullable).
  - `hasConsent()` artık `current_consents`'i okuyor.
  - React `VeribenimProvider` ve Vue plugin'i yeni anahtarlara/alanlara göre güncellendi.

  Geçiş: `necessary`→`strictly_necessary`, `preferences`→`functional`; `logConsent({preferences})`→`logConsent({consents})`; `savePreferences` dönüşünü `PreferencesResponse` varsayan kod `SavePreferencesResponse`'a güncellenmeli; tercih okuma `res.preferences` yerine `res.current_consents` kullanmalı.

### Minor Changes

- 26e17fd: Eksik platform uçları core'a eklendi:

  - `trackPageview()` — Web Analytics hit toplama (`POST /api/v/{token}/e`, sendBeacon uyumlu, yoksa keepalive fetch).
  - `scanCookies(url)` — public çerez tarama (`POST /api/public/cookie-scan`).
  - `verifyDomain(domain?)` — public domain doğrulama (`GET /api/public/verify/{domain}`).
  - `impressionPixelUrl(opts?)` — 1x1 pixel impression `<img>` fallback URL'i (`GET /api/impressions/{token}/pixel`).

  `ConsentAction` birleşimine `withdraw` eklendi (platform bu aksiyonu doğruluyordu).

  Yeni tipler: `AnalyticsHitPayload`, `CookieScanResponse`, `CookieScanResultItem`, `DomainVerifyResponse`, `ImpressionPixelOptions`.

  Bu metotlar `@veribenim/react`, `@veribenim/vue`, `@veribenim/nuxt`, `@veribenim/nextjs` paketlerinden `client` üzerinden otomatik erişilebilir.

## 5.1.1

### Patch Changes

- 5a24f21: VeribenimProvider artık bundle script'i otomatik yüklüyor (domain config'den). Ayrı Script tag'i eklemeye gerek yok. Veribenim class'ına loadScript() metodu eklendi.

## 5.1.0

### Minor Changes

- 5a24f21: Bundle URL artık domain-based (cleanDomainForFilename), eski bundle.js?token=XXX kaldırıldı. Config'e domain parametresi eklendi. FieldType'a consent eklendi.

## 5.0.0

### Major Changes

- url fix

## 4.0.0

### Major Changes

- readme

## 3.0.0

### Major Changes

- readme

## 2.0.0

### Major Changes

- readme eklendi

## 1.0.0

### Major Changes

- özet gelecek
