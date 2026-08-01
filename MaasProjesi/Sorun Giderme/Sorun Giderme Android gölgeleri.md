---
tags: [sorun-giderme, tasarim]
---

# Kartlar düz görünüyor / arayüz "sade"

## Belirti

Tarayıcıda üretilen ekran görüntülerinde kartlar zeminden net ayrışıyor, ama
gerçek Android cihazda her şey düz bir yüzeye yayılmış gibi duruyor.

## Sebep

Android, React Native'in gölge özelliklerini **yok sayar**:

| Özellik | iOS | Android | Web |
|---|---|---|---|
| `shadowColor` | ✅ | ❌ | ✅ |
| `shadowOffset` | ✅ | ❌ | ✅ |
| `shadowOpacity` | ✅ | ❌ | ✅ |
| `shadowRadius` | ✅ | ❌ | ✅ |
| `elevation` | ❌ | ✅ | ❌ |

İlk sürümde `elevation: 1` verilmişti — Android'de neredeyse görünmez.
Web ekran görüntülerinde gölgeler CSS `box-shadow`'a çevrildiği için sorun
fark edilmiyordu.

## Çözüm

`theme/tokens.js` içinde elevation değerleri yükseltildi:

```js
card:   { ...iOS gölgesi, elevation: 3 }   // 1'den
raised: { ...iOS gölgesi, elevation: 10 }  // 6'dan
accent: { shadowColor: vurgu.base, elevation: 8 }
```

Ayrıca görsel etki için:

- Toplam kartı soluk `tint` yerine **dolu vurgu rengi**
- Başlık ikon kutuları dolu vurgu rengine alındı
- Aktif sekme ikonu vurgu renginde hap zemine oturtuldu

## Ders

> [!tip]
> Web ekran görüntüsü üretimi hızlı geri bildirim sağlıyor ama **platform
> farklarını gizliyor**. Gölge, yazı tipi ve dokunma davranışı gerçek cihazda
> doğrulanmalı.

İlgili: [[Tasarım Sistemi]] · [[Renk Jetonları]]
