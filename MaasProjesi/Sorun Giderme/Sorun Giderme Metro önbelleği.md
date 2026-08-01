---
tags: [sorun-giderme, derleme]
---

# "Firebase yapılandırması eksik" hatası

## Belirti

Uygulama açılışta şu hatayla çöküyor:

```
Error: Firebase yapılandırması eksik: apiKey, authDomain, projectId, ...
```

Oysa `.env` dosyası yerinde ve `expo export` çıktısında şu satır görünüyor:

```
env: load .env
env: export EXPO_PUBLIC_FIREBASE_API_KEY ...
```

## Sebep

`EXPO_PUBLIC_*` değişkenleri **derleme zamanında** pakete gömülür. Metro
önbelleği bayat kaldığında `services/firebase.js` dosyasının önceki dönüşümü
kullanılır ve değerler `undefined` olarak gömülü kalır.

Dotenv'in yüklendiğini gösteren satır yanıltıcı: değişkenler sürece yüklenir
ama dönüşüm önbellekten geldiği için pakete girmez.

## Kontrol

```bash
grep -c "maas-primtakip" dist/_expo/static/js/web/*.js
# 0 dönerse yapılandırma pakette yok
```

## Çözüm

```bash
rm -rf dist .expo/cache node_modules/.cache
npx expo export --platform web --clear
```

`docs/demo/capture.mjs` artık `--clear` ile çalışıyor.

## EAS derlemelerinde farklı bir sebep

EAS sunucusu `.env` dosyasını **görmez** — dosya `.gitignore`'da ve EAS git
üzerinden yükleme yapıyor. Değerler EAS ortam değişkeni olarak tanımlanmalı:

```bash
npx eas-cli env:create --environment preview \
  --name EXPO_PUBLIC_FIREBASE_API_KEY --value "..." \
  --visibility plaintext --scope project
```

ve `eas.json` profilinde `"environment": "preview"` bulunmalı.

Derleme çıktısında şu satır doğrulama sağlar:

```
Environment variables ... loaded from the "preview" environment on EAS:
EXPO_PUBLIC_FIREBASE_API_KEY, ...
```

İlgili: [[Firebase Kurulumu]] · [[Dağıtım]] · [[Ekran Görüntüsü Üretimi]]
