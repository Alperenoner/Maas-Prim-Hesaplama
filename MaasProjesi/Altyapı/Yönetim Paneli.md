---
tags: [altyapi, panel]
dosya: admin-panel/index.html
---

# Yönetim Paneli

**Adres:** https://maas-primtakip.web.app

Derleme adımı olmayan **tek dosya**. Firebase SDK'sı CDN'den ES modülü olarak
yüklenir; yapılandırma `config.js`'ten gelir.

## Yetenekleri

| Sekme | İçerik |
|---|---|
| Geri bildirimler | Aktif kayıtlar, kategori rozeti, yanıtlama |
| Kullanıcılar | Kayıtlı kullanıcılar |
| Silinen bildirimler | Yumuşak silinmişler |
| Silinen kullanıcılar | Yumuşak silinmişler |

Üstte dört istatistik: bekleyen, yanıtlanan, kullanıcı sayısı, bu hafta gelen.

## Canlı dinleme

İki `onSnapshot` aboneliği; çıkışta ikisi de kapatılır. Yeni geri bildirim
anında listede belirir.

## Arama

`toLocaleLowerCase('tr-TR')` kullanılıyor — Türkçe I/İ dönüşümünü doğru yapar.
İsim, soyisim, e-posta, mesaj ve kategori içinde arar.

## Yanıtlama akışı

1. Yanıt yazılır → **"E-posta taslağı hazırla"**
2. `mailto:` ile yöneticinin e-posta uygulaması açılır (alıcı, konu, yanıt ve
   alıntılanan özgün mesaj dolu)
3. Yönetici gönderir
4. Panel sorar: *"Gönderdim — yanıtlandı olarak işaretle"*

Dördüncü adım önemli: panel gönderimi doğrulayamaz, bu yüzden varsayım yapmaz.

Ayrıntı: [[ADR 003 EmailJS yerine mailto]]

## Güvenlik

- Yetki tamamen [[Firestore Kuralları|kurallarda]]; panel herkese açık URL'de
  dursa da yönetici dışında kimse veri göremez
- Tüm kullanıcı verisi `textContent` ile yazılır → XSS kapalı
- `confirm()` yerine kendi onay penceresi
- `<meta name="robots" content="noindex, nofollow">`

İlgili: [[Kapatılan Açıklar]] · [[Dağıtım]]
