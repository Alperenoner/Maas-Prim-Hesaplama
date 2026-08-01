---
tags: [karar, dagitim]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 002 — expo-crypto kaldırıldı

## Bağlam

Kayıt kimlikleri `Math.random().toString()` ile üretiliyordu. Çakışma hâlinde
silme yanlış kaydı siler, bulut birleştirmesi veri kaybettirirdi.

İlk çözüm `expo-crypto` + `randomUUID()` oldu. Sonra şu fark edildi:

```js
// expo-crypto/build/ExpoCrypto.js
export default requireNativeModule('ExpoCrypto');  // ← import anında
```

`expo-crypto` **yerel bir modül** ve import anında yerel tarafı çağırıyor.
Kullanıcıların telefonundaki ikili dosyada bu modül yok, dolayısıyla OTA
güncellemesi **açılışta çökerdi**. Güvenlik düzeltmeleri ancak yeni bir mağaza
derlemesiyle ulaşabilirdi.

Ayrıca React Native `globalThis.crypto` sağlamıyor, yani fallback de çalışmıyor.

## Karar

Yerel bağımlılık kaldırıldı; kimlik üç katmanlı bir üreteçle oluşturuluyor:

```
<zaman b36>-<sayaç b36>-<rastgele b36>
msa9bao5-3-f7q2wd8a
```

1. Milisaniye zaman damgası
2. Süreç içi sayaç (aynı ms içindeki üretimler)
3. 8 karakter rastgelelik ≈ 2,8×10¹² (cihazlar arası birleştirme için)

500.000 üretimde çakışma yok. Ek fayda: kimlikler kronolojik sıralanabilir.

## Gerekçe

Kimlikler yalnızca yerel liste anahtarı olarak kullanılıyor — kriptografik
öngörülemezlik gerekli değil. Buna karşılık güvenlik düzeltmelerinin
kullanıcılara **aynı gün** ulaşması değerli.

## Sonuçlar

- Güncelleme OTA ile dağıtılabiliyor
- Yeni yerel modül eklendiğinde bu ödünleşme tekrar değerlendirilmeli

İlgili: [[Dağıtım]] · [[Veri Modeli]] · [[Teknoloji Yığını]]
