---
tags: [moc, prim-hesaplama]
olusturulma: 2026-08-01
---

# Prim Hesaplama — Proje Kasası

Saha teknisyenlerinin ana maaşına eklenen kurulum ve nöbet primlerini hesaplayan,
ayları arşivleyen ve harcamaları takip eden **yerel-öncelikli** bir React Native
uygulaması. Yanında geri bildirimleri yöneten bir web paneli çalışır.

> [!info] Hızlı bakış
> **Depo:** https://github.com/Alperenoner/Maas-Prim-Hesaplama
> **Panel:** https://maas-primtakip.web.app
> **Firebase projesi:** `maas-primtakip`
> **Platform:** Android · iOS · Web

![[01-maas-acik.png|300]]

## Nereden başlamalı

| Ne öğrenmek istiyorsun | Not |
|---|---|
| Uygulama ne yapıyor | [[Proje Nedir]] |
| Kod nasıl organize | [[Mimari Genel Bakış]] |
| Prim nasıl hesaplanıyor | [[Prim Hesaplama Kuralı]] |
| Veri nerede duruyor | [[Veri Modeli]] |
| Güvenlik durumu | [[Güvenlik Genel Bakış]] |
| Nasıl yayınlanır | [[Dağıtım]] |
| Bir şey bozulduğunda | [[Sorun Giderme Dizini]] |

## Haritalar

### Genel Bakış
- [[Proje Nedir]]
- [[Teknoloji Yığını]]
- [[Sürüm Geçmişi]]

### Mimari
- [[Mimari Genel Bakış]]
- [[Katmanlar]]
- [[Yönlendirme]]
- [[Durum Yönetimi]]
- [[Veri Akışı]]

### Ekranlar
- [[Maaş Ekranı]] · [[Harcamalar Ekranı]] · [[Hızlı Hesap Ekranı]] · [[Geçmiş Ekranı]]
- [[Kayıt Ekranı]] · [[Profil Ekranı]] · [[Geri Bildirim Ekranı]]

### Tasarım
- [[Tasarım Sistemi]]
- [[Renk Jetonları]]
- [[Tipografi]]
- [[UI Bileşenleri]]

### İş Mantığı
- [[Prim Hesaplama Kuralı]]
- [[Veri Modeli]]
- [[Veri Göçü]]

### Güvenlik
- [[Güvenlik Genel Bakış]]
- [[Firestore Kuralları]]
- [[Kimlik Doğrulama]]
- [[Kapatılan Açıklar]]

### Altyapı
- [[Firebase Kurulumu]]
- [[Dağıtım]]
- [[Yönetim Paneli]]
- [[Ekran Görüntüsü Üretimi]]

### Kararlar
- [[Kararlar Dizini]]

### Sorun Giderme
- [[Sorun Giderme Dizini]]

## Açık işler

- [ ] Yönetici e-postasını doğrulayıp [[Firestore Kuralları|kurallardaki]] `email_verified` satırını etkinleştir
- [ ] Firestore'daki eski e-posta kimlikli yedek belgelerini temizle → [[ADR 001 Yedek UID ile anahtarlanır]]
- [ ] Prim oranlarını uzaktan yapılandırılabilir yap → [[Prim Hesaplama Kuralı]]
