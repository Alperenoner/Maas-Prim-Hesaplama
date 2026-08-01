---
tags: [tasarim, renk]
dosya: theme/tokens.js
---

# Renk Jetonları

## Vurgu renkleri (sekme kimlikleri)

Her vurgu dört değerden oluşur: `base` (dolu), `strong` (basılı), `tint`
(soluk zemin), `on` (üzerine yazılacak metin).

| Sekme | Açık `base` | Koyu `base` |
|---|---|---|
| Maaş | `#4F46E5` | `#8B85FF` |
| Harcamalar | `#DC2626` | `#FF7A7A` |
| Hızlı | `#15803D` | `#4ADE80` |
| Geçmiş | `#B45309` | `#FBBF24` |

> [!important] Koyu tema otomatik ters çevrilmiyor
> Koyu tema adımları ayrı ayrı **seçildi**. Açık temanın rengini
> koyulaştırmak kontrast ve doygunluk açısından yanlış sonuç veriyor.

## Yüzeyler

| Jeton | Açık | Koyu |
|---|---|---|
| `bg` | `#F5F6F8` | `#0B0D10` |
| `surface` | `#FFFFFF` | `#14171C` |
| `surfaceAlt` | `#F0F2F5` | `#1B1F26` |
| `border` | `#E3E7EC` | `#252A33` |
| `text` | `#0F172A` | `#F7F8FA` |
| `textMuted` | `#5A6474` | `#9AA4B2` |
| `textFaint` | `#8B94A3` | `#6B7684` |

## Durum renkleri

Vurgu renklerinden **ayrı** tutulur; hiçbir zaman seri rengi olarak kullanılmaz.

| Rol | Açık | Koyu |
|---|---|---|
| success | `#15803D` | `#4ADE80` |
| danger | `#DC2626` | `#FF7A7A` |
| warning | `#B45309` | `#FBBF24` |
| info | `#4F46E5` | `#8B85FF` |

## Gölgeler

```js
card:   { ...iOS gölgesi, elevation: 3 }
raised: { ...iOS gölgesi, elevation: 10 }
accent: { shadowColor: vurgu.base, elevation: 8 }
```

`accent` gölgesi toplam kartında ve dolu ikon kutularında kullanılır — gölge
de vurgu renginde olduğu için blok "ışıyor" gibi görünür.

İlgili: [[Tasarım Sistemi]] · [[Tipografi]]
