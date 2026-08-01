---
tags: [tasarim, tipografi]
dosya: theme/tokens.js
---

# Tipografi

Dokuz basamaklı ölçek. Boyut, ağırlık, harf aralığı ve satır yüksekliği
**birlikte** tanımlı — böylece bir varyant seçmek tutarlı sonuç veriyor.

| Varyant | Boyut | Ağırlık | Satır | Kullanım |
|---|---|---|---|---|
| `display` | 32 | 700 | 38 | Toplam tutarı |
| `title` | 24 | 700 | 30 | Ekran başlığı |
| `heading` | 18 | 700 | 24 | Kart başlığı |
| `subheading` | 15 | 600 | 20 | Bölüm başlığı |
| `body` | 15 | 400 | 21 | Gövde |
| `bodyStrong` | 15 | 600 | 21 | Vurgulu gövde |
| `label` | 13 | 600 | 18 | Form etiketi |
| `caption` | 12 | 500 | 17 | Açıklama |
| `overline` | 11 | 700 | 16 | Büyük harf etiket |

## Türkçe karakter tuzağı

> [!bug] "Maaş" → "Maas"
> Küçük puntolarda satır yüksekliği oranı 1.27'ydi (`overline` 11/14).
> Bu oranda **ş, ç, ğ** harflerinin alt çengelleri kırpılıyordu — sekme
> etiketlerinde "Maaş" düpedüz "Maas" olarak görünüyordu.
>
> Küçük boyutlarda oran ~1.4'e çıkarıldı. Ayrıca sekme etiketleri
> react-navigation'ın varsayılan kutusundan çıkarılıp kendi `Text`
> bileşenimize alındı — o kutu yazı tipi boyutuyla aynı yükseklikte ve
> `overflow: hidden` olduğu için satır yüksekliği artışı bile yetmiyordu.

## Sayısal hizalama

Tablo ve liste sütunlarında `fontVariant: ['tabular-nums']` kullanılır;
rakamlar eşit genişlikte olur ve alt alta kayar görünmez.

İlgili: [[Tasarım Sistemi]] · [[UI Bileşenleri]]
