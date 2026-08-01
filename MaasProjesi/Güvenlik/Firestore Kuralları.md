---
tags: [guvenlik, firestore]
dosya: firestore.rules
---

# Firestore Kuralları

18 satırdan 129 satıra çıktı. Her koleksiyon için sahiplik, alan doğrulaması
ve boyut sınırı var.

## Yardımcı fonksiyonlar

```
function kaliciHesap() {
  return girisYapti()
    && request.auth.token.firebase.sign_in_provider != 'anonymous';
}

function sahibi(uid) {
  return kaliciHesap() && request.auth.uid == uid;
}
```

Anonim oturumlar **veri sahibi olamaz** — anonim UID cihaza özel ve
kurtarılamaz olduğu için sahiplik iddiası anlamsız olurdu.

## `yedekler/{uid}`

```
allow get: if sahibi(uid);
allow create, update: if sahibi(uid) && gecerliYedek();
allow delete: if sahibi(uid);
allow list: if false;
```

`list` kapalı: koleksiyonu listeleyip UID toplamak mümkün olmasın.

Boyut sınırı: en fazla 600 maaş, 5000 harcama kaydı.

## `kullanicilar/{uid}`

```
allow get: if sahibi(uid) || yoneticiMi();
allow list: if yoneticiMi();
allow create: if sahibi(uid) && gecerliProfil();
allow update: if (sahibi(uid) && gecerliProfil())
  || (yoneticiMi() && sadece(['silindi','silinmeTarihi']));
allow delete: if yoneticiMi();
```

Yönetici **yalnızca silme bayrağını** değiştirebilir; kullanıcının adını
veya e-postasını değiştiremez.

## `geribildirimler/{docId}`

```
allow create: if girisYapti() && gecerliGeriBildirim();
allow get, list, update, delete: if yoneticiMi();
```

`gecerliGeriBildirim()` şunları zorunlu kılar:
- `uid == request.auth.uid` — başkasının adına yazılamaz
- `durum == 'Yeni'` — istemci "Yanıtlandı" olarak oluşturamaz
- `tarih == request.time` — istemci tarih uyduramaz
- `kategori in ['hata','oneri','soru','diger']`

## Varsayılan ret

```
match /{document=**} {
  allow read, write: if false;
}
```

## Açık iş

> [!todo] `email_verified` kontrolü
> `yoneticiMi()` içinde şu satır **yorumda**:
> ```
> && request.auth.token.email_verified == true
> ```
> Yönetici hesabının e-postası doğrulanmadan etkinleştirilirse panele
> giriş yapılamaz. Doğrulama yapıldıktan sonra açılmalı.

## Dağıtım

```bash
npm run deploy:rules
```

> [!danger] Kurallar dosyada değil, sunucuda geçerlidir
> Depoda güncel olması yetmez. Dağıtılmadığı sürece eski kurallar çalışır.

İlgili: [[Güvenlik Genel Bakış]] · [[Kimlik Doğrulama]]
