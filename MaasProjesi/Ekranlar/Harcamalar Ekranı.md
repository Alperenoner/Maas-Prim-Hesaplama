---
tags: [ekran, harcamalar]
dosya: app/(tabs)/expenses.jsx
vurgu: harcamalar
---

# Harcamalar Ekranı

Gider kalemlerini kaydeder, aya göre gruplar, her grubun toplamını rozette gösterir.

![[02-harcamalar-acik.png|320]] ![[09-harcamalar-koyu.png|320]]

## Girdi doğrulama

| Alan | Kural |
|---|---|
| Gün | 1–31 arası zorunlu |
| Tutar | Sıfırdan büyük; virgül noktaya çevrilir |
| Açıklama | Boş olamaz |

Hatalar alan altında satır içi gösterilir, `Alert` kullanılmaz.

## Bağlama duyarlı saat alanı

Açıklamada şu kelimelerden biri geçerse ek bir saat seçici belirir:

```js
const SAAT_GEREKTIREN = ['taksi', 'uber', 'servis'];
```

Saat kayda ayrı alan olarak yazılır (eskiden isim metnine gömülüyordu).

## Gruplama ve sıralama

```js
// Aylar takvim sırasına, ay içindeki kayıtlar güne göre
.sort((a, b) => (ayEtiketiSirasi(b.ay) ?? -1) - (ayEtiketiSirasi(a.ay) ?? -1))
```

> [!bug] Düzeltilen hata
> Eski sürümde gruplar `Object.keys()` sırasına göre diziliyordu, yani
> **ekleme sırası** belirleyiciydi. Ocak'tan sonra eklenen Aralık kaydı
> yanlış yerde çıkıyordu. `ayEtiketiSirasi()` bunu takvim sırasına çevirdi.
> Ayrıntı: [[Kapatılan Açıklar]]

İlgili: [[Veri Modeli]] · [[Maaş Ekranı]]
