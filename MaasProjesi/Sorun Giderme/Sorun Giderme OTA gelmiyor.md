---
tags: [sorun-giderme, dagitim]
---

# OTA güncellemesi telefona gelmiyor

## Belirti

`eas update` başarıyla yayınlanıyor ama telefondaki uygulama eski sürümü
göstermeye devam ediyor.

## Teşhis sırası

### 1. Gerçekten eski sürüm mü?

Ekranda **yeni sürüme özgü** bir işaret ara. Bu projede: prim kalemlerinin
yanındaki `−` `+` düğmeleri. Yoksa eski paket çalışıyor.

### 2. İki kez soğuk başlatıldı mı?

`expo-updates` varsayılan davranışı:

- **1. açılış:** güncellemeyi indirir, eski paketi çalıştırmaya devam eder
- **2. açılış:** yeni paketi çalıştırır

Android'de "kapatmak" için uygulamayı **recents'ten kaydırmak** gerekir; geri
tuşu yeterli değil. Kesin yöntem: *Ayarlar → Uygulamalar → Zorla durdur*.

### 3. Kanal eşleşiyor mu?

```bash
npx eas-cli channel:list
npx eas-cli build:list --limit 5
```

Kurulu APK'nın kanalı ile `eas update --branch` hedefi aynı olmalı.

> [!bug] Bu projede yaşanan
> `eas update --branch production` çalıştırılmıştı ama `production` kanalında
> **hiç derleme yoktu** — kullanıcılar `preview` kanalını dinliyordu.
> Güncelleme kimseye ulaşmadı.

### 4. Runtime sürümü eşleşiyor mu?

Derlemenin `runtimeVersion` değeri ile güncellemeninki aynı olmalı.
Eski derlemelerde bu alan `None` olabilir — o ikili dosyalar hiçbir güncelleme
almaz.

### 5. İkili dosyada güncellemeler etkin mi?

APK'yı açıp manifest'e bak:

```bash
unzip -qo app.apk -d apk
python3 -c "print(open('apk/AndroidManifest.xml','rb').read().decode('utf-16-le','ignore'))" \
  | grep -o "expo.modules.updates.ENABLED\|EXPO_UPDATE_URL"
```

> [!danger] Bu projede yaşanan
> Yerel `android/` klasörü 8 Temmuz'da, güncelleme yapılandırması eklenmeden
> **önce** üretilmişti. İçinde `expo.modules.updates.ENABLED = false` vardı ve
> `EXPO_UPDATE_URL` hiç yoktu. Ayrıca paket adı hâlâ `com.anonymous.MaasProjesi`
> idi. Bu klasörden yapılan yerel derlemeler hiçbir OTA alamazdı.
>
> Çözüm: bayat `android/` ve `ios/` klasörleri silindi. Expo bunları
> `app.json`'dan gerektiğinde yeniden üretiyor.

### 6. Yeni paket çöküp geri mi alındı?

`expo-updates` yeni güncelleme açılışta çökerse otomatik olarak öncekine döner.
Bu durumda `eas update:list` yayını gösterir ama cihaz eskiyi çalıştırır.
Kontrol: yeni yerel modül eklendi mi? → [[ADR 002 expo-crypto kaldırıldı]]

## Geri alma

```bash
npx eas-cli update:republish --group <ESKİ_GRUP_ID> --branch preview
```

İlgili: [[Dağıtım]]
