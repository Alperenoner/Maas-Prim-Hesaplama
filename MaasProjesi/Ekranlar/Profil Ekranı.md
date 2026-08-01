---
tags: [ekran, profil]
dosya: app/profil.jsx
---

# Profil Ekranı

Bilgi düzenleme, bulut yedeğini açma ve çıkış.

![[05-profil-acik.png|320]] ![[12-profil-koyu.png|320]]

## Özet kartı

Baş harflerden avatar, isim, e-posta ve üç metrik: kayıtlı ay, harcama adedi,
toplam kazanç.

## Yedekleme bölümü

Duruma göre iki farklı içerik gösterir:

**Kapalıysa** — şifre alanı + "Yedeklemeyi aç" butonu. Basıldığında:

```js
await hesapOlustur({ ...profil, sifre });   // anonim hesabı YÜKSELTİR
await profiliSenkronla(profil);
await yedegeYaz({ maasKayitlari, harcamaKayitlari });  // mevcut veri yukarı
```

**Açıksa** — açıklama + "Şifremi değiştir" (sıfırlama e-postası gönderir).

> [!note] E-posta kilidi
> Yedekleme açıkken e-posta alanı düzenlenemez; hesaba bağlı adres
> değiştirilemez. Alan altında bunu açıklayan ipucu görünür.

## Çıkış

Alttan açılan panelde onay istenir ve **sonucun ne olacağı** duruma göre
farklı yazılır:

- Yedekleme açıksa: "Tekrar giriş yaptığında bulut yedeğinden geri yüklenir"
- Kapalıysa: "Bu cihazdaki veriler kalıcı olarak silinir"

İlgili: [[Kimlik Doğrulama]] · [[Kayıt Ekranı]]
