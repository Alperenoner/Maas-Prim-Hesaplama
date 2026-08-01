---
tags: [mimari]
---

# Veri Akışı

## Yazma yolu

```mermaid
sequenceDiagram
    participant K as Kullanıcı
    participant E as Ekran
    participant S as AsyncStorage
    participant F as Firestore

    K->>E: Kaydet
    E->>S: maasKayitlariniYaz()
    S-->>E: ✓ (beklenir)
    E-->>K: "Kaydedildi"
    E->>F: yedegeYaz() (beklenmez)
    Note over E,F: Başarısız olsa bile<br/>kullanıcı akışı etkilenmez
```

Sıra bilinçli: **önce disk, sonra bulut**. Bulut yazması `await` edilmez.

## Okuma yolu

Ekran odağa geldiğinde diskten okunur, normalleştirilir ve takvim sırasına
sokulur. Ayrıntı: [[Durum Yönetimi]]

## Geri yükleme (cihaz değiştirme)

```mermaid
graph LR
    A[Giriş yap] --> B["yedekler/{uid} okunur"]
    B --> C[Kimliğe göre birleştir]
    C --> D[Diske yaz]
    style C fill:#e9f6ee,stroke:#15803D
```

Birleştirme `listeleriBirlestir()` ile kimliğe göre yapılır — yerel ve
buluttaki kayıtların hiçbiri kaybolmaz:

```js
const harita = new Map();
bulut.forEach((k) => k?.id && harita.set(k.id, k));
yerel.forEach((k) => k?.id && harita.set(k.id, k));  // yerel kazanır
return Array.from(harita.values());
```

Bu yüzden kimliklerin çakışmaması kritik → [[ADR 002 expo-crypto kaldırıldı]]

## Geri bildirim döngüsü

```mermaid
graph LR
    A[Uygulama:<br/>konu + mesaj] --> B[("geribildirimler<br/>durum: Yeni")]
    B --> C[Panel: onSnapshot<br/>anında görünür]
    C --> D[Yönetici yanıt yazar]
    D --> E[mailto: taslak açılır]
    E --> F[Yönetici gönderir]
    F --> G[durum: Yanıtlandı]
```

Son adımda panel **onay ister** — e-postanın gerçekten gönderildiğini
bilemeyeceği için varsayım yapmaz.
Ayrıntı: [[ADR 003 EmailJS yerine mailto]]

İlgili: [[Veri Modeli]] · [[Yönetim Paneli]]
