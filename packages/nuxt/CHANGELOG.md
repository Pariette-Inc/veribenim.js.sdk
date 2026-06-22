# @veribenim/nuxt

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

- 26e17fd: Vue/Nuxt için hazır UI bileşenleri eklendi (React/Next paritesi):

  - `ConsentBanner` — headless-dostu çerez onay banner'ı (varsayılan minimal görünüm + scoped slot ile özelleştirme).
  - `VeribenimForm` — form şemasını çekip çekirdek FormRenderer ile basan bileşen.

  Nuxt'ta her ikisi de otomatik bileşen olarak kaydedilir (`<ConsentBanner />`, `<VeribenimForm />`); ayrıca `@veribenim/vue`'dan doğrudan import edilebilir.

### Patch Changes

- Updated dependencies [26e17fd]
- Updated dependencies [26e17fd]
- Updated dependencies [26e17fd]
  - @veribenim/core@6.0.0
  - @veribenim/vue@6.0.0

## 5.1.1

### Patch Changes

- 5a24f21: VeribenimProvider artık bundle script'i otomatik yüklüyor (domain config'den). Ayrı Script tag'i eklemeye gerek yok. Veribenim class'ına loadScript() metodu eklendi.
- Updated dependencies [5a24f21]
  - @veribenim/core@5.1.1
  - @veribenim/vue@5.1.1

## 5.1.0

### Minor Changes

- 5a24f21: Bundle URL artık domain-based (cleanDomainForFilename), eski bundle.js?token=XXX kaldırıldı. Config'e domain parametresi eklendi. FieldType'a consent eklendi.

### Patch Changes

- Updated dependencies [5a24f21]
  - @veribenim/core@5.1.0
  - @veribenim/vue@5.1.0

## 5.0.0

### Major Changes

- url fix

### Patch Changes

- Updated dependencies
  - @veribenim/core@5.0.0
  - @veribenim/vue@5.0.0

## 4.0.0

### Major Changes

- readme

### Patch Changes

- Updated dependencies
  - @veribenim/core@4.0.0
  - @veribenim/vue@4.0.0

## 3.0.0

### Major Changes

- readme

### Patch Changes

- Updated dependencies
  - @veribenim/core@3.0.0
  - @veribenim/vue@3.0.0

## 2.0.0

### Major Changes

- readme eklendi

### Patch Changes

- Updated dependencies
  - @veribenim/core@2.0.0
  - @veribenim/vue@2.0.0

## 1.0.0

### Major Changes

- özet gelecek

### Patch Changes

- Updated dependencies
  - @veribenim/core@1.0.0
  - @veribenim/vue@1.0.0
