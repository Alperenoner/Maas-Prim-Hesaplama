---
tags: [mimari]
---

# Katmanlar

## `lib/` — saf iş mantığı

Ağ bağımlılığı yok, React bağımlılığı yok. Node'da doğrudan çalıştırılabilir.

| Dosya | Sorumluluk |
|---|---|
| `prim.js` | [[Prim Hesaplama Kuralı]] — oranlar, kalemler, hesap, kayıt üretimi |
| `storage.js` | AsyncStorage okuma/yazma + [[Veri Göçü]] + normalleştirme |
| `format.js` | tr-TR para, tarih, ay etiketi biçimleme ve sıralama |
| `ids.js` | Çakışmaya kapalı kayıt kimliği → [[ADR 002 expo-crypto kaldırıldı]] |

## `services/` — ağ katmanı

| Dosya | Sorumluluk |
|---|---|
| `firebase.js` | Yapılandırma + AsyncStorage kalıcılığıyla auth başlatma |
| `auth.js` | Anonim → kalıcı hesap yükseltmesi, `useOturum` hook'u |
| `backup.js` | UID ile anahtarlanan yedek okuma/yazma/birleştirme |
| `users.js` | `kullanicilar/{uid}` profil senkronu |
| `feedback.js` | Kategoriler + geri bildirim gönderimi |

> [!important] `firebase.js` neden `initializeAuth` kullanıyor
> Firebase JS SDK'sı React Native'de varsayılan olarak **belleği** kullanır.
> `getAuth()` ile açılan oturum uygulama kapanınca kaybolur ve UID ile
> anahtarlanan yedeğe bir daha erişilemez.
> `initializeAuth` + `getReactNativePersistence(AsyncStorage)` bunu çözer.
> Ayrıntı: [[Kimlik Doğrulama]]

## `components/ui/` — tasarım sistemi

Ekranlar ham renk kodu kullanmaz; hepsi `useTheme()` üzerinden jeton okur.
Ayrıntı: [[UI Bileşenleri]] · [[Renk Jetonları]]

## `app/` — ekranlar

Yalnızca yukarıdaki üç katmanı birleştirir. Bir ekranda iş mantığı görüyorsan
`lib/`'e taşınması gerekiyor demektir.

İlgili: [[Mimari Genel Bakış]]
