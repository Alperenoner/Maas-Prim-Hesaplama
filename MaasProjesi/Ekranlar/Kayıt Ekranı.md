---
tags: [ekran, onboarding]
dosya: app/kayit.jsx
---

# Kayıt Ekranı

İlk açılışta zorunlu. İki modu var.

![[07-kayit-acik.png|320]]

## Mod 1 — Yeni başla

İsim, soyisim, e-posta. Altında **isteğe bağlı** bir onay kutusu:

> Bulut yedeğini aç — Şifre belirlersen verilerin hesabına bağlanır ve yeni bir
> cihazda giriş yaparak geri yükleyebilirsin.

- **İşaretliyse:** şifre istenir → `hesapOlustur()` → kalıcı hesap
- **İşaretsizse:** uygulama tamamen yerel çalışır, hiçbir bulut kaydı olmaz

Bu seçim [[Kimlik Doğrulama]] modelinin merkezinde.

## Mod 2 — Hesabım var

E-posta + şifre ile giriş. Ardından:

1. Bulut profilinden isim/soyisim getirilir (`profiliGetir()`)
2. Yedek okunur ve **yerel veriyle birleştirilir**
3. Diske yazılır

Ayrıntı: [[Veri Akışı]]

## Doğrulama

| Alan | Kural |
|---|---|
| E-posta | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Şifre | En az 6 karakter (Firebase alt sınırı) |
| İsim/soyisim | Yalnızca "yeni başla" modunda zorunlu |

İlgili: [[Profil Ekranı]] · [[Kimlik Doğrulama]]
