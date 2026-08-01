---
tags: [mimari]
---

# Durum Yönetimi

Global durum kütüphanesi **yok**. Üç mekanizma var:

## 1. Tema — `ThemeProvider`

`theme/index.jsx` içinde context. `system | light | dark` tercihini
AsyncStorage'da saklar, sistem temasını izler.

```js
const { color, spacing, accent, isDark, temaDegistir } = useTheme();
```

## 2. Oturum — `useOturum`

`services/auth.js` içinde `onAuthStateChanged` aboneliği:

```js
const { kullanici, hazir, yedekAcik } = useOturum();
```

Abonelik tabanlı olması önemli: [[Profil Ekranı|Profil]] ekranından hesap
açıldığında [[Maaş Ekranı|Maaş]] ekranındaki "Bulut yedeği kapalı" uyarısı
anında kaybolur.

## 3. Kayıt verisi — odaklanmada yeniden okuma

Ekranlar arası veri paylaşımı AsyncStorage üzerinden dolaylı yapılır:

```js
useFocusEffect(useCallback(() => {
  let iptal = false;
  maasKayitlariniOku().then((liste) => {
    if (!iptal) setKayitlar(liste);
  });
  return () => { iptal = true; };
}, []));
```

`iptal` bayrağı, ekran odaktan çıktıktan sonra gelen yanıtın state'i
güncellemesini engeller.

> [!note] Ödünleşme
> Bu desen bağımlılıksız ve basit, ancak her odaklanmada tam JSON çözümlemesi
> yapar. Kayıt sayısı binlere çıkarsa tek bir context'e veya SQLite'a taşımak
> gerekir.

İlgili: [[Veri Akışı]] · [[Veri Modeli]]
