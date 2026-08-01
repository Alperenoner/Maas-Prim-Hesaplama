---
tags: [karar, hata]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 004 — React Compiler null erişimi

## Bağlam

Ekran görüntüsü üretimi sırasında **12 ekranın 10'u beyaz açılıyordu**.
Konsolda tek satır:

```
TypeError: Cannot read properties of null (reading 'id')
```

Derlenmiş paketten kaynak çıkarıldığında sorun görüldü:

```js
// React Compiler çıktısı
t[130] !== be || t[131] !== N.id ? ( ... ) : ...
//                        ^^^^^^ N (secilenKayit) null olsa bile çözümleniyor
```

Kaynak kod şuydu:

```jsx
<Sheet visible={Boolean(secilenKayit)}>
  <SheetAction onPress={() => kayitSil(secilenKayit.id)} />
</Sheet>
```

`secilenKayit` null iken de `Sheet`'in children'ı oluşturuluyor, React Compiler
`secilenKayit.id` erişimini memo bağımlılık dizisine çıkarıyor ve **koşuldan
bağımsız** çözümlüyor.

## Karar

İki desen benimsendi:

**1. Geri çağrımlarda güvenli erişim**

```jsx
onPress={() => secilenKayit && kayitSil(secilenKayit.id)}
```

**2. Koşullu blokları ayrı bileşene çıkarma**

```jsx
{secilen ? <AyKirilimi kayit={secilen} /> : null}
```

Prop bileşen içinde asla null olmadığı için derleyici güvenle memoize ediyor.

## Neden derleyici kapatılmadı

React Compiler el yazımı memoizasyonu gereksiz kılıyor ve performans faydası
gerçek. Sorun derleyicide değil, koşullu render içinde nullable alan
erişiminde. Bu desen zaten kaçınılması gereken bir desen.

## Nasıl yakalandı

Bu hata birim testiyle değil, **derlenmiş uygulamayı gerçek tarayıcıda
çalıştırıp konsol istisnalarını toplayarak** bulundu.
→ [[Ekran Görüntüsü Üretimi]]

## Sonuçlar

- Koşullu render içinde `x.y` yerine `x?.y` veya ayrı bileşen kullanılıyor
- Ekran görüntüsü üretimi artık bir regresyon testi işlevi görüyor

İlgili: [[Geçmiş Ekranı]] · [[Teknoloji Yığını]]
