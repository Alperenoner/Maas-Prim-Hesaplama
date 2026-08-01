---
tags: [ekran, hizli]
dosya: app/(tabs)/explore.jsx
vurgu: hizli
---

# Hızlı Hesap Ekranı

Ana ekranla **aynı formülü** kullanan, fakat hiçbir şey kaydetmeyen simülasyon
ekranı. "Ya şu kadar nöbet tutsam?" sorusu için.

![[03-hizli-acik.png|320]] ![[11-hizli-koyu.png|320]]

## Hazır senaryolar

Tek dokunuşla dört kalemi birden dolduran şablonlar:

| Senaryo | Kurulum | H. İçi | H. Sonu | Araç |
|---|---|---|---|---|
| Sakin ay | 4 | 2 | 1 | 1 |
| Ortalama | 8 | 4 | 3 | 2 |
| Yoğun ay | 14 | 8 | 6 | 4 |

## Formül çoğaltması kaldırıldı

> [!success] Düzeltildi
> Eski sürümde prim formülü hem burada hem `index.jsx` içinde **ayrı ayrı**
> yazılıydı. Oran değişse iki dosyanın da güncellenmesi gerekiyordu.
> Artık ikisi de [[Prim Hesaplama Kuralı|lib/prim.js]]'ten besleniyor.

## Düzeltilen düzen hatası

> [!bug] Adet kutuları taşıyordu
> Bu ekran başta dar `Field` bileşenleri kullanıyordu; girilen rakam kutunun
> dışına taşıp kartın kenarında kesiliyordu. [[Maaş Ekranı]]'ndaki `Stepper`
> bileşenine geçildi — hem hata gitti hem iki ekran tutarlı oldu.

İlgili: [[Prim Hesaplama Kuralı]] · [[UI Bileşenleri]]
