---
"@veribenim/vue": minor
"@veribenim/nuxt": minor
---

Vue/Nuxt için hazır UI bileşenleri eklendi (React/Next paritesi):

- `ConsentBanner` — headless-dostu çerez onay banner'ı (varsayılan minimal görünüm + scoped slot ile özelleştirme).
- `VeribenimForm` — form şemasını çekip çekirdek FormRenderer ile basan bileşen.

Nuxt'ta her ikisi de otomatik bileşen olarak kaydedilir (`<ConsentBanner />`, `<VeribenimForm />`); ayrıca `@veribenim/vue`'dan doğrudan import edilebilir.
