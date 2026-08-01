---
tags: [guvenlik, acik]
---

# Kapatılan Açıklar

## 🔴 Kritik — Bulut yedeği herkese açıktı

**Neydi:** `yedekler/{docId}` kuralı yalnızca oturum açmış olmayı arıyordu ve
belge kimliği kullanıcının **e-postasıydı**.

```
match /yedekler/{docId} {
  allow read, write: if request.auth != null;   // ← tek koşul
}
```

**Sonucu:** Uygulamayı indirip anonim oturum açan herhangi biri, tanıdığı bir
çalışanın e-postasını yazarak o kişinin **tüm maaş ve harcama geçmişini
okuyabilir, üzerine yazabilirdi**.

**Çözüm:** Belge kimliği tahmin edilemeyen oturum UID'si oldu, kural sahipliği
doğruluyor. → [[ADR 001 Yedek UID ile anahtarlanır]]

## 🔴 Kritik — Yönetim panelinde depolanmış XSS

**Neydi:** Kartlar `innerHTML` ile kuruluyor, kullanıcıdan gelen `mesaj`,
`isim`, `eposta` alanları kaçışlanmadan gömülüyordu.

**Sonucu:** Uygulamadan gönderilen bir geri bildirim, yöneticinin tarayıcısında
betik çalıştırabilirdi. Panel oturumu açıkken bu, tüm kullanıcı verisine
erişim demekti.

**Çözüm:** Tüm kullanıcı verisi `textContent` ile yazılıyor; kartlar DOM API'siyle
kuruluyor.

## 🟠 Yüksek — Kullanıcı belgelerinde sahiplik denetimi yoktu

`kullanicilar` üzerinde `update`, belge kimliğini bilen her oturuma açıktı.
Çözüm: kimlik UID oldu, alan adları ve uzunlukları kuralda doğrulanıyor.

## 🟠 Yüksek — Oturum her açılışta sıfırlanıyordu

`getAuth()` bellek kalıcılığı kullanıyordu. Çözüm: `initializeAuth` +
AsyncStorage. → [[Kimlik Doğrulama]]

## 🟠 Yüksek — Ağ yanıt vermezse uygulama açılmıyordu

Açılış `signInAnonymously`'yi bekliyordu; bağlantı kurulamadığında uygulama
yükleme göstergesinde kilitleniyordu. Tarayıcı testinde doğrudan gözlemlendi.
Çözüm: → [[ADR 006 Kimlik doğrulama açılışı bloklamaz]]

## 🟡 Orta — Yanıtlanmayan geri bildirim "yanıtlandı" görünüyordu

Panel Firestore durumunu e-posta gönderiminden **önce** güncelliyordu.
Çözüm: sıra tersine çevrildi; artık gönderim yöneticinin onayıyla işaretleniyor.
→ [[ADR 003 EmailJS yerine mailto]]

## 🟡 Orta — Çakışmaya açık kayıt kimlikleri

`Math.random().toString()` çakışabiliyordu; çakışma hâlinde silme yanlış kaydı
siler, bulut birleştirmesi veri kaybettirirdi.
Çözüm: → [[ADR 002 expo-crypto kaldırıldı]]

## 🟡 Orta — İstemci tarafı e-posta anahtarları

EmailJS anahtarları hem uygulama paketinde hem panelin kaynağındaydı.
Çözüm: servis tamamen kaldırıldı. → [[ADR 003 EmailJS yerine mailto]]

---

## ℹ️ Açık olmayan: Firebase apiKey

`firebaseConfig` içindeki `apiKey` bir sır **değildir**. İstemci tarafı Firebase
yapılandırmasının herkese açık olması tasarım gereğidir. Koruma kurallardan gelir.

İlgili: [[Güvenlik Genel Bakış]] · [[Kararlar Dizini]]
