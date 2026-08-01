---
tags: [genel-bakis, teknoloji]
---

# Teknoloji Yığını

## Çekirdek

| Paket | Sürüm | Rolü |
|---|---|---|
| `expo` | ^57.0.4 | SDK ve araç zinciri |
| `react-native` | 0.86.0 | Çalışma zamanı |
| `react` | 19.2.3 | UI kütüphanesi |
| `expo-router` | ^57.0.4 | Dosya tabanlı yönlendirme → [[Yönlendirme]] |
| `firebase` | ^12.16.0 | Kimlik + veritabanı → [[Firebase Kurulumu]] |
| `react-native-reanimated` | 4.5.0 | Animasyonlar |
| `@react-native-async-storage/async-storage` | 2.2.0 | Yerel depolama → [[Veri Modeli]] |

## Etkin deneysel özellikler

`app.json` içinde:

```json
"experiments": {
  "typedRoutes": true,
  "reactCompiler": true
}
```

> [!warning] React Compiler dikkat gerektiriyor
> Derleyici, koşullu render edilen JSX içindeki alan erişimlerini memo
> bağımlılığına çıkarıp koşuldan bağımsız çözümleyebiliyor. Bu, altı ekranın
> beyaz açılmasına yol açtı.
> Ayrıntı: [[ADR 004 React Compiler null erişimi]]

## Kaldırılan bağımlılık

`expo-crypto` bir süre kullanıldı, sonra kaldırıldı — yerel modül olduğu için
OTA güncellemesini imkânsız kılıyordu.
Ayrıntı: [[ADR 002 expo-crypto kaldırıldı]]

## Yerel modül listesi

Bu paketler derlenmiş ikili dosyaya gömülür; eklenmesi/çıkarılması **yeni
derleme** gerektirir, OTA yetmez:

`async-storage` · `datetimepicker` · `expo-constants` · `expo-font` ·
`expo-haptics` · `expo-image` · `expo-linking` · `expo-navigation-bar` ·
`expo-router` · `expo-splash-screen` · `expo-status-bar` · `expo-symbols` ·
`expo-system-ui` · `expo-updates` · `expo-web-browser` · `gesture-handler` ·
`reanimated` · `safe-area-context` · `screens` · `worklets`

İlgili: [[Dağıtım]] · [[Sorun Giderme OTA gelmiyor]]
