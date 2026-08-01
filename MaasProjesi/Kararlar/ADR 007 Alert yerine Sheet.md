---
tags: [karar, tasarim]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 007 — Alert yerine Sheet

## Bağlam

Kayıt düzenleme/silme ve onay akışları `Alert.alert()` ile yapılıyordu:

```js
Alert.alert(`${item.ay} İşlemleri`, "Ne yapmak istersin?", [
  { text: "Vazgeç", style: "cancel" },
  { text: "Sil", style: "destructive", onPress: ... },
  { text: "Düzenle", onPress: ... }
]);
```

Sorunlar:

- Seçenek sırası platforma göre değişiyor (iOS/Android farklı)
- Biçimlendirilemiyor — ek bilgi gösterilemiyor
- Yıkıcı işlem yalnızca metin rengiyle ayrışıyor
- Uygulamanın tasarım diline ait değil

## Karar

Alttan açılan `Sheet` bileşeni yazıldı. Yıkıcı aksiyon kırmızı ikon
kutusuyla ayrışıyor, sıra sabit ve panel içinde bağlam gösterilebiliyor —
örneğin bir ayı silmeden önce o ayın kalem kırılımı görünüyor.

## Sonuçlar

- Onay akışları tutarlı ve platformdan bağımsız
- Kullanıcı sildiği şeyin ne olduğunu görüyor
- Bileşen `Modal` + Reanimated ile yazıldı, ek bağımlılık yok

İlgili: [[UI Bileşenleri]] · [[Maaş Ekranı]]
