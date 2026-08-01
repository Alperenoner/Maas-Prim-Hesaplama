---
tags: [mimari]
---

# Yönlendirme

`expo-router` kullanılıyor: **dosya sistemi = rota tablosu**.

```
app/
├── _layout.tsx              kök yığın
├── (tabs)/
│   ├── _layout.jsx          sekme çubuğu + profil bekçisi
│   ├── index.jsx            → /
│   ├── expenses.jsx         → /expenses
│   ├── explore.jsx          → /explore
│   └── history.jsx          → /history
├── kayit.jsx                → /kayit
├── profil.jsx               → /profil
└── feedback.jsx             → /feedback
```

`(tabs)` parantezli olduğu için URL'e yansımaz — yalnızca gruplama sağlar.

## Profil bekçisi

`app/(tabs)/_layout.jsx` açılışta yerel profili okur:

```js
profilOku().then((profil) => {
  if (!profil?.eposta) router.replace('/kayit');
  else setProfilKontrolEdildi(true);
});
```

Kontrol bitene kadar tam ekran yükleme göstergesi çizilir; böylece sekmeler
bir an görünüp kaybolmaz.

## Tipli rotalar

`app.json` içinde `experiments.typedRoutes: true`. Bu, `.expo/types/router.d.ts`
dosyasını üretir ve `router.push('/profil')` gibi çağrıları derleme zamanında
doğrular.

## Web çıktısı

`web.output: "single"` — tek `index.html`, yönlendirme istemcide.
Neden statik değil: [[ADR 005 Web çıktısı SPA]]

İlgili: [[Mimari Genel Bakış]] · [[Ekran Görüntüsü Üretimi]]
