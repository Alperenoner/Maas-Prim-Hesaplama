---
tags: [altyapi, firebase]
---

# Firebase Kurulumu

**Proje:** `maas-primtakip` · **Numara:** 589781739238

## Kullanılan servisler

| Servis | Ne için |
|---|---|
| Authentication | Anonim + E-posta/Şifre → [[Kimlik Doğrulama]] |
| Cloud Firestore | Yedek, kullanıcı, geri bildirim → [[Veri Modeli]] |
| Hosting | [[Yönetim Paneli]] |

## Sıfırdan kurulum

1. Firebase Console'da proje oluştur
2. **Authentication → Sign-in method**: `Anonymous` ve `Email/Password` etkinleştir
3. **Firestore**: veritabanı oluştur
4. Web uygulaması ekle, yapılandırmayı kopyala
5. `.env` ve `admin-panel/config.js` dosyalarını doldur
6. Kuralları dağıt: `npm run deploy:rules`
7. `firestore.rules` içindeki yönetici e-postasını değiştir

## Yapılandırma nerede

| Dosya | Kim kullanır | Git'te mi |
|---|---|---|
| `.env` | Mobil uygulama | ❌ gitignore |
| `.env.example` | Şablon | ✅ |
| `admin-panel/config.js` | Panel | ❌ gitignore |
| `admin-panel/config.example.js` | Şablon | ✅ |

EAS derlemeleri `.env`'i göremediği için değerler ayrıca **EAS ortam
değişkeni** olarak tanımlı. → [[Dağıtım]]

> [!warning] Bu değerler gizli değil ama ayrı tutuluyor
> İstemci Firebase yapılandırması pakete gömülür ve okunabilir. Ayrı dosyada
> tutulmalarının nedeni gizlilik değil, farklı ortamlara (geliştirme/üretim)
> kod değiştirmeden bağlanabilmek.

İlgili: [[Firestore Kuralları]] · [[Dağıtım]]
