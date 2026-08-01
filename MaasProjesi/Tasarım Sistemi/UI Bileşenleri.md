---
tags: [tasarim, bilesen]
dosya: components/ui/
---

# UI Bileşenleri

Yirmi bileşen, tek `components/ui/index.js` barelinden dışa aktarılıyor.

## Yerleşim

| Bileşen | Sorumluluk |
|---|---|
| `Screen` | Güvenli alan, arka plan, klavye kaçınma, kaydırma |
| `Card` / `CardHeader` / `Divider` | Yüzey kartı ve iç bölümleme |
| `PageHeader` | Ekran başlığı + dolu vurgu ikonu |
| `SectionLabel` | Liste bölüm başlığı + vurgu çizgisi |

## Girdi

| Bileşen | Not |
|---|---|
| `Field` | Etiketli metin girdisi; odakta vurgu rengine geçer, hata/ipucu alanı sabit yükseklikte |
| `Stepper` | Adet girdisi + artı/eksi düğmeleri — klavye açmadan hızlı giriş |

`Stepper` saha kullanımında asıl senaryo: teknisyen sayıyı yazmak yerine
dokunarak artırıyor.

## Aksiyon

| Bileşen | Not |
|---|---|
| `Button` | Yay animasyonu + dokunsal titreşim; primary/secondary/ghost/danger |
| `IconButton` | Başlık çubuğu aksiyonları |
| `IconTile` | Vurgu renginde ikon kutusu; `filled` ile dolu varyant |

## Geri bildirim

| Bileşen | Not |
|---|---|
| `Sheet` / `SheetAction` | `Alert.alert` yerine alttan açılan panel |
| `Banner` | Satır içi bildirim şeridi (info/success/warning/danger) |
| `EmptyState` | Veri yokken açıklayıcı boş durum |
| `Badge` | Küçük renkli etiket |
| `Skeleton` | Yükleme iskeleti |

> [!note] Neden `Alert.alert` bırakıldı
> Alert seçenek sırasını platforma göre değiştirir, biçimlendirilemez ve
> yıkıcı işlemi diğerlerinden görsel olarak ayırmaz. `Sheet` üçünü de çözüyor:
> yıkıcı aksiyon kırmızı ikon kutusuyla ayrışıyor, sıra sabit ve panel içinde
> ek bilgi (ör. ayın kalem kırılımı) gösterilebiliyor.

## Veri gösterimi

| Bileşen | Not |
|---|---|
| `AnimatedAmount` | Tutar değişince sayarak geçer |
| `TotalCard` | Dolu vurgu renginde toplam bloğu |
| `AmountRow` | Etiket / tutar satırı |
| `BarChart` | Grafik kütüphanesi olmadan sütun grafiği |
| `Text` | Tipografi ölçeğine bağlı metin |

İlgili: [[Tasarım Sistemi]] · [[Renk Jetonları]]
