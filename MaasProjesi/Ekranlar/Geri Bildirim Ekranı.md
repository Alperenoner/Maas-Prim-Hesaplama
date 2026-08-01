---
tags: [ekran, geri-bildirim]
dosya: app/feedback.jsx
---

# Geri Bildirim Ekranı

Kullanıcıdan mesaj alır, [[Yönetim Paneli|panele]] iletir.

![[06-geribildirim-acik.png|320]] ![[13-geribildirim-koyu.png|320]]

## Neden yeniden yazıldı

İlk sürüm tek bir metin kutusu ve "Gönder" butonundan ibaretti. Kullanıcı geri
bildirimi: *"hiç anlaşılır değil"*. Tespit edilen beş belirsizlik:

| Sorun | Çözüm |
|---|---|
| "Mesajın" — kime, ne için? | İki adımlı akış: önce konu, sonra o konuya özel soru |
| Köşedeki çıplak "2000" | İlerleme çubuğu + "en az 10 karakter (4/10)" |
| Buton neden soluk belli değil | Etiket "Önce mesajını yaz" → yazınca "Gönder" |
| Gönderince ne olacak? | "Gönderdikten sonra ne olur?" bölümü + onay ekranı |
| Ekranın yarısı boş | Bilgi kartlarıyla dolduruldu |

## Konu kategorileri

`services/feedback.js` içinde tanımlı. Her kategorinin kendi sorusu, ipucu ve
örnek metni var:

| Konu | Soru | Örnek |
|---|---|---|
| Bir hata var | Ne oldu? | "Hafta sonu nöbeti 3 girdiğimde toplam değişmiyor" |
| Önerim var | Ne eklenmesini istersin? | "Harcamaları kategoriye göre ayırabilmek isterim" |
| Sorum var | Ne öğrenmek istiyorsun? | "Telefonumu değiştirsem kayıtlarım geri gelir mi?" |
| Diğer | Ne söylemek istersin? | — |

Kategori Firestore'a da yazılır ve [[Firestore Kuralları|kuralda]] doğrulanır:

```
&& d.kategori in ['hata', 'oneri', 'soru', 'diger']
```

Panelde renkli rozet olarak görünür.

## Gizlilik notu

Ekranda açıkça yazıyor: *"Yalnızca adın, e-postan ve mesajın iletilir.
Kayıtların cihazında kalır."* Bu doğru — gönderilen belgede maaş/harcama
verisi yok.

İlgili: [[Yönetim Paneli]] · [[ADR 003 EmailJS yerine mailto]]
