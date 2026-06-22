---
"@veribenim/core": major
"@veribenim/react": major
"@veribenim/vue": major
"@veribenim/nextjs": major
"@veribenim/nuxt": major
---

KIRICI: Consent veri modeli platformla hizalandı.

Platformun otoritatif kategori anahtarları `strictly_necessary, functional, analytics, marketing`. SDK daha önce yanlış anahtarlar (`necessary`, `preferences`) ve yanlış alan adı (`preferences`) kullanıyordu; bu yüzden rıza yazma/okuma sessizce hatalıydı.

Değişiklikler:
- `ConsentPreferences` anahtarları: `necessary`→`strictly_necessary`, `preferences`→`functional` (artık: `strictly_necessary, functional, analytics, marketing`).
- `ConsentLogPayload.preferences` → `ConsentLogPayload.consents` (platform `consents` bekliyor).
- `savePreferences()` artık gövdede `consents` gönderiyor ve `SavePreferencesResponse` (`{status, message}`) döner (önceki `PreferencesResponse` şekli yanlıştı).
- `PreferencesResponse` gerçek `GET /api/preferences` yanıtına göre yeniden tanımlandı: `categories` + `current_consents` (nullable).
- `hasConsent()` artık `current_consents`'i okuyor.
- React `VeribenimProvider` ve Vue plugin'i yeni anahtarlara/alanlara göre güncellendi.

Geçiş: `necessary`→`strictly_necessary`, `preferences`→`functional`; `logConsent({preferences})`→`logConsent({consents})`; `savePreferences` dönüşünü `PreferencesResponse` varsayan kod `SavePreferencesResponse`'a güncellenmeli; tercih okuma `res.preferences` yerine `res.current_consents` kullanmalı.
