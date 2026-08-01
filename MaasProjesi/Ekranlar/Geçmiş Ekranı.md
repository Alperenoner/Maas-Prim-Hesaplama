---
tags: [ekran, gecmis]
dosya: app/(tabs)/history.jsx
vurgu: gecmis
---

# Geçmiş Ekranı

Salt okunur arşiv: yıllık özet, son 6 ayın sütun grafiği ve seçilen ayın kırılımı.

![[04-gecmis-acik.png|320]] ![[10-gecmis-koyu.png|320]]

## Yıllık özet

| Metrik | Hesap |
|---|---|
| Toplam kazanç | Bu yılın kayıtlarındaki `hamToplam` toplamı |
| Toplam prim | Dört kalem `*Para` alanlarının toplamı |
| Aylık ortalama | Toplam ÷ kayıtlı ay sayısı |
| En iyi ay | En yüksek `hamToplam` |

Yıl süzmesi `ayEtiketindenYil()` ile yapılır — metin sonundaki dört haneyi
sayıya çevirir.

## Sütun grafiği

Grafik kütüphanesi kullanılmıyor; saf `View` + Reanimated. Her sütun sırayla
60 ms gecikmeyle yükselir.

Bir sütuna dokunulunca o ayın kırılımı altta açılır. Rakamlar sütunların
üzerine basılmaz — küçük ekranda üst üste binerdi; seçim üzerinden okunur.

## React Compiler tuzağı

> [!danger] Bu ekran beyaz açılıyordu
> Seçili ayın kırılımı `{secilen ? (<Card>...{secilen.ay}...</Card>) : null}`
> biçiminde koşullu render ediliyordu. React Compiler `secilen.ay` erişimini
> memo bağımlılığına çıkarıp **koşuldan bağımsız** çözümlüyor ve `secilen`
> null olduğunda çalışma zamanı hatası veriyordu.
>
> Çözüm: kırılım ayrı bir `AyKirilimi({ kayit })` bileşenine taşındı — prop
> asla null olmadığı için sorun ortadan kalktı.
> Ayrıntı: [[ADR 004 React Compiler null erişimi]]

İlgili: [[Maaş Ekranı]] · [[Veri Modeli]]
