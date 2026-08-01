---
tags: [genel-bakis, gecmis]
---

# Sürüm Geçmişi

## Aşama 1 — İlk sürüm (6–15 Temmuz 2026)

| Tarih | Ne oldu |
|---|---|
| 06.07 | `create-expo-app` şablonu |
| 14.07 | Expo SDK 57'ye yükseltme, Firebase arka ucu, ekranların yazılması |
| 14.07 | Arayüz modernizasyonu, onboarding, EmailJS otomasyonu |
| 14.07 | Sekme çubuğu düzeltmesi, Android sistem çubuğunun gizlenmesi |
| 14.07 | Web yönetim panelinin eklenmesi |
| 15.07 | Bulut yedeği, yıllık özet grafiği |
| 15.07 | Yumuşak silme + geri yükleme |
| 15.07 | Kalıcı silme, profil düzenleme, panelde arama |

## Aşama 2 — Güvenlik ve yeniden yazım (1 Ağustos 2026)

| Commit | Ne oldu |
|---|---|
| `bc7513e` | 7 güvenlik açığı kapatıldı, arayüz tasarım sistemine taşındı |
| `873ad16` | Panel yapılandırması depo dışına alındı |
| `f3a1922` | Kimlik üreteci yerel bağımlılıktan kurtarıldı (OTA mümkün oldu) |
| `d76a107` | EAS derleme profilleri ortam değişkenlerine bağlandı |
| `f5c668c` | Görsel etki artırıldı, geri bildirim ekranı yeniden yazıldı |
| — | EmailJS kaldırıldı, yanıtlama `mailto:` akışına taşındı |

Ayrıntılar: [[Kapatılan Açıklar]] · [[Kararlar Dizini]]

## Dağıtım kilometre taşları

- **Firestore kuralları** canlıya alındı → kritik açık kapandı
- **APK** yeniden derlendi ve dağıtıldı → [[Dağıtım]]
- **OTA kanalı** çalışır hâle geldi → [[Sorun Giderme OTA gelmiyor]]
- **GitHub** deposu herkese açık yayınlandı
