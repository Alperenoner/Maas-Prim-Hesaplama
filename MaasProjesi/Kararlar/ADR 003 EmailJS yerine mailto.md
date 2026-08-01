---
tags: [karar, guvenlik, panel]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 003 — EmailJS yerine mailto

## Bağlam

Geri bildirim yanıtları EmailJS ile gönderiliyordu. Servis anahtarları hem
uygulama paketinde hem panelin kaynağındaydı ve okunabilirdi.

EmailJS'te bu anahtarları korumanın tek yolu **alan adı kısıtlaması** — ve bu
özellik ücretli planlara ait. Ücretsiz planda anahtarı ele geçiren biri
hesabın aylık kotasından e-posta gönderebilir.

Ayrıca panel, e-posta gönderiminden **önce** kaydı "Yanıtlandı" işaretliyordu;
gönderim başarısız olsa bile kullanıcı yanıt almadan kayıt kapanıyordu.

## Karar

EmailJS tamamen kaldırıldı. Yanıtlama `mailto:` ile çalışıyor:

1. Panel yöneticinin e-posta uygulamasında hazır taslak açar
2. Yönetici gönderir
3. Panel onay ister → "Gönderdim — yanıtlandı olarak işaretle"

## Karşılaştırma

| | EmailJS | mailto |
|---|---|---|
| Sayfada anahtar | var, korunamıyor | **yok** |
| Aylık sınır | 200 istek | **yok** |
| Gönderen adres | servis adresi | **yöneticinin adresi** |
| Kullanıcı geri yazabilir | hayır | **evet** |
| Maliyet | koruma için ücretli | **ücretsiz** |
| Otomatik mi | evet | hayır — elle gönderim |

## Alternatifler

| Seçenek | Neden seçilmedi |
|---|---|
| EmailJS ücretli plan | Küçük proje için maliyet |
| Cloud Functions + SMTP | Firebase Blaze planı (ücretli) + altyapı |
| Firebase "Trigger Email" eklentisi | Aynı: Blaze + SMTP kimlik bilgisi |

## Sonuçlar

**Olumlu**
- Sayfada hiçbir kimlik bilgisi yok
- Kota sınırı ortadan kalktı
- Yanıt yöneticinin gerçek adresinden gittiği için kullanıcı doğrudan
  geri yazabiliyor (servis adresinde bu mümkün değildi)

**Olumsuz**
- Gönderim elle yapılıyor
- Panel gönderimi doğrulayamıyor — bu yüzden onay adımı eklendi

İlgili: [[Yönetim Paneli]] · [[Geri Bildirim Ekranı]]
