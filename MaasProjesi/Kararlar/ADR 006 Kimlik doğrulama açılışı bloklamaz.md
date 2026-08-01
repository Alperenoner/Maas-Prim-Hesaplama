---
tags: [karar, mimari]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 006 — Kimlik doğrulama açılışı bloklamaz

## Bağlam

Kök yerleşim açılışta oturumu bekliyordu:

```js
await veriGocunuCalistir();
await oturumuBaslat();   // ← ağ beklenir
setHazir(true);
```

Ağ erişilemez veya yavaş olduğunda `signInAnonymously()` ne çözülüyor ne
reddediliyordu; uygulama **yükleme göstergesinde kilitli** kalıyordu. Bu,
tarayıcı testinde doğrudan gözlemlendi.

## Karar

Kimlik doğrulama arka plana alındı:

```js
(async () => {
  await veriGocunuCalistir().catch(() => {});
  setHazir(true);          // ← arayüz hemen açılır
})();

oturumuBaslat().catch(...);  // arka planda
```

Ekranlar oturum durumunu `useOturum()` aboneliğiyle izliyor; oturum hazır
olduğunda ilgili özellikler kendiliğinden etkinleşiyor.

## Gerekçe

Uygulama **yerel-öncelikli**. Kimlik doğrulaması yalnızca bulut yedeği ve
geri bildirim için gerekli. Kullanıcının maaş girmesi için ağ gerekmiyor.

## Sonuçlar

- Uçak modunda uygulama tam çalışıyor
- "Bulut yedeği kapalı" uyarısı oturum hazır olana kadar gösterilmiyor
  (`oturumHazir && !yedekAcik`) — yanlış alarm vermiyor

İlgili: [[Durum Yönetimi]] · [[Kimlik Doğrulama]] · [[Kapatılan Açıklar]]
