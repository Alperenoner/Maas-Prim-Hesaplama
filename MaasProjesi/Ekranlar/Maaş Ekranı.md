---
tags: [ekran, maas]
dosya: app/(tabs)/index.jsx
vurgu: maas
---

# Maaş Ekranı

Uygulamanın kalbi. Ana maaş + dört prim kalemi girilir, toplam canlı hesaplanır,
ay arşive yazılır.

![[01-maas-acik.png|320]] ![[08-maas-koyu.png|320]]

## Bölümler

1. **Başlık** — ay etiketi ve "bu ay kayıtlı" rozeti
2. **Uyarı şeridi** — bulut yedeği kapalıysa görünür ([[Kimlik Doğrulama]])
3. **Ana maaş kartı** — tutar + "maaşımı hatırla" anahtarı
4. **Prim kalemleri** — dört [[UI Bileşenleri|Stepper]], her birinin altında katkısı
5. **Toplam kartı** — dolu vurgu renginde, animasyonlu rakam
6. **Son kayıtlar** — son 3 ay, dokunulunca aksiyon paneli

## Dikkat çeken davranışlar

### Aynı ay iki kez kaydedilemez

```js
if (!duzenlenenId && buAyKayitli) {
  setDurum({ tone: 'warning', mesaj: `${buAy} için zaten bir kayıt var...` });
  return;
}
```

Kullanıcı düzenlemeye yönlendirilir. Eskiden bu bir `Alert` kutusuydu; artık
satır içi şerit.

### Maaşı hatırlama

Açıkken tutar `hatirlananMaas` anahtarına yazılır ve uygulama açılışında
forma otomatik gelir. Kapatıldığında anahtar silinir.

### Düzenleme modu

Bir kayda dokunup "Düzenle" seçilince form dolar, kaydet butonu
"Değişiklikleri kaydet" olur ve kart vurgu renginde çerçevelenir.

### Kaydetme sonrası

```js
const kaydedilen = await maasKayitlariniYaz(yeniListe);  // beklenir
yedegeYaz({ maasKayitlari: kaydedilen });                 // beklenmez
Haptics.notificationAsync(Success);
```

Ayrıntı: [[Veri Akışı]]

## Aksiyon paneli

`Alert.alert` yerine alttan açılan panel kullanılıyor. Nedeni:
Alert seçenek sırasını platforma göre değiştirir, biçimlendirilemez ve yıkıcı
işlemi görsel olarak ayırmaz. Ayrıntı: [[UI Bileşenleri]]

İlgili: [[Prim Hesaplama Kuralı]] · [[Geçmiş Ekranı]] · [[Veri Modeli]]
