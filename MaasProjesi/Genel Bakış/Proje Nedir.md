---
tags: [genel-bakis]
---

# Proje Nedir

Saha teknisyenleri sabit maaş almıyor: ana maaşın üzerine yaptıkları kurulum ve
tuttukları nöbet başına prim ekleniyor. Bu primler maaşın yüzdesi olarak
hesaplandığı için her ay elle hesap yapmak hem zahmetli hem hataya açık.

**Prim Hesaplama** bu hesabı otomatikleştirir, sonucu ay ay arşivler ve yanında
harcama takibi sunar.

## Dört sekme, dört sorumluluk

| Sekme | Ne yapar | Not |
|---|---|---|
| **Maaş** | Ana maaş + dört prim kalemini girer, toplamı canlı hesaplar, ayı kaydeder | [[Maaş Ekranı]] |
| **Harcamalar** | Gider kaydeder, aya göre gruplar, ay toplamını gösterir | [[Harcamalar Ekranı]] |
| **Hızlı** | Hiçbir şey kaydetmeyen senaryo hesaplayıcı | [[Hızlı Hesap Ekranı]] |
| **Geçmiş** | Yıllık özet, sütun grafiği, ay kırılımı | [[Geçmiş Ekranı]] |

![[04-gecmis-acik.png|280]] ![[02-harcamalar-acik.png|280]]

## Sekme dışı akışlar

- [[Kayıt Ekranı]] — ilk açılışta zorunlu; isim, soyisim, e-posta ve isteğe bağlı şifre
- [[Profil Ekranı]] — bilgi düzenleme ve bulut yedeğini açma
- [[Geri Bildirim Ekranı]] — konu seçimli mesaj gönderme
- [[Yönetim Paneli]] — web tarafı, geri bildirimleri yönetir

## Temel tasarım ilkesi: yerel-öncelikli

Tüm veri **önce cihazda** saklanır. Bulut yedeği isteğe bağlıdır ve yalnızca
kullanıcının kendi hesabıyla erişilebilir.

Bunun pratik sonuçları:

- Uygulama internetsiz tam çalışır
- Açılış ağ beklemez → [[ADR 006 Kimlik doğrulama açılışı bloklamaz]]
- Yedekleme başarısız olsa bile kullanıcının işlemi tamamlanır → [[Veri Akışı]]

İlgili: [[Teknoloji Yığını]] · [[Mimari Genel Bakış]]
