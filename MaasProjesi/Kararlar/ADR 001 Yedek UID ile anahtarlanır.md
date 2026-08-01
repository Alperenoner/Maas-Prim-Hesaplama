---
tags: [karar, guvenlik]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 001 — Yedek UID ile anahtarlanır

## Bağlam

Bulut yedeği belgesinin kimliği kullanıcının **e-postasıydı**
(`yedekler/ahmet@ornek.com`) ve kural yalnızca oturum açmış olmayı arıyordu.

Bu, cihaz değiştirmede "e-postanı yaz, verin gelsin" akışını mümkün kılıyordu —
ama aynı zamanda **e-postayı bilen herkesin** o veriye erişmesini sağlıyordu.

## Karar

Belge kimliği oturumun **UID**'si oldu; kural sahipliği doğruluyor.

```
match /yedekler/{uid} {
  allow get: if sahibi(uid);
  allow create, update: if sahibi(uid) && gecerliYedek();
}
```

Cihaz değiştirme artık **gerçek kimlik doğrulaması** gerektiriyor: kullanıcı
e-posta + şifreyle giriş yapar, UID aynı kalır, yedek geri gelir.

## Alternatifler

| Seçenek | Neden seçilmedi |
|---|---|
| E-postayı hash'lemek | Güvenlik değil, belirsizlik. E-posta bilinirse hash de hesaplanır. |
| Yedeğe sahip UID alanı eklemek | Yeni cihazın UID'si farklı olacağı için geri yükleme çalışmazdı |
| Yedeği tamamen kaldırmak | Cihaz değiştirme senaryosu kullanıcı için değerli |

## Sonuçlar

**Olumlu**
- Anonim bir saldırgan artık kimsenin verisine erişemiyor
- Yönetici bile başkasının yedeğini göremiyor

**Olumsuz**
- Yedekleme için şifre belirlemek zorunlu oldu (isteğe bağlı tutuldu)
- Eski e-posta kimlikli belgeler **erişilemez** kaldı — Firestore'da duruyorlar,
  konsoldan görülüp temizlenebilirler

İlgili: [[Firestore Kuralları]] · [[Kimlik Doğrulama]] · [[Kapatılan Açıklar]]
