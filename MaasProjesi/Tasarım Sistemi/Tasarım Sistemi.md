---
tags: [tasarim]
---

# Tasarım Sistemi

## Neden gerekti

İlk sürümde her ekran kendi renklerini satır içi üretiyordu:

```js
const bg = isDark ? '#121212' : '#f2f4f8';
const text = isDark ? '#ffffff' : '#1f2430';
const cardBg = isDark ? '#1e1e1e' : '#ffffff';
// ...sekiz dosyada tekrar
```

Sonuçları: aynı gri sekiz yerde tanımlıydı, bir ekran ([[Geri Bildirim Ekranı]])
koyu temayı hiç desteklemiyordu ve bir rengi değiştirmek sekiz dosya dokunmayı
gerektiriyordu.

## Şimdi

```js
const { color, spacing, accent, radius, type } = useTheme();
```

Ekranlarda **ham hex kalmadı**. Tüm değerler [[Renk Jetonları]] ve
[[Tipografi]] notlarındaki jetonlardan geliyor.

## Görsel dil

| İlke | Uygulama |
|---|---|
| Tek doygun blok | Ekranda yalnızca toplam kartı dolu vurgu renginde — göz oraya gidiyor |
| Kimlik rengi | Her sekmenin rengi ikon kutusunda ve vurgu detaylarında |
| Yüzey ayrımı | Kartlar gölge + ince kenarlıkla zeminden ayrılıyor |
| Hareket | Basma geri bildirimi, sayan rakamlar, sıralı sütun animasyonu |

> [!warning] Android gölge tuzağı
> Android `shadowColor` / `shadowOffset` / `shadowOpacity` / `shadowRadius`
> değerlerini **tamamen yok sayar**, yalnızca `elevation` çalışır.
> İlk sürümde `elevation: 1` verilmişti ve kartlar cihazda zeminden
> ayrışmıyordu — kullanıcı arayüzü "çok sade" buldu.
> Web ekran görüntülerinde gölgeler CSS'e çevrildiği için sorun görünmüyordu.
> Ayrıntı: [[Sorun Giderme Android gölgeleri]]

İlgili: [[Renk Jetonları]] · [[Tipografi]] · [[UI Bileşenleri]]
