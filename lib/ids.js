/**
 * Kayıt kimliği üreteci.
 *
 * Önceki sürüm `Math.random().toString()` kullanıyordu: aynı anda üretilen iki
 * kayıt aynı kimliği alabiliyordu ve kimlikler sıralanabilir değildi. Çakışma
 * hâlinde silme yanlış kaydı siler, bulut birleştirmesi veri kaybettirirdi.
 *
 * Neden `expo-crypto` / `randomUUID()` değil:
 * React Native çalışma zamanı `globalThis.crypto` sağlamıyor ve `expo-crypto`
 * import anında yerel (native) modülü çağırıyor. Bu bağımlılık eklendiğinde
 * güncelleme yalnızca yeni bir mağaza derlemesiyle dağıtılabilirdi; OTA
 * güncellemesi mevcut kurulumlarda çökmeye yol açardı. Kimliğin kriptografik
 * olarak öngörülemez olması bu uygulamada gerekli değil (kimlikler yalnızca
 * yerel liste anahtarı), bu yüzden yerel bağımlılık gerektirmeyen bir üreteç
 * tercih edildi.
 *
 * Biçim:  <zaman-damgası b36>-<sayaç b36>-<rastgele b36>
 * Örnek:  m4x9k2p-3-f7q2wd8a
 *
 * Çakışmaya karşı üç katman:
 *   1. Milisaniye zaman damgası — farklı anlarda üretilenler zaten ayrışır.
 *   2. Süreç içi sayaç — aynı milisaniyedeki üretimleri ayırır.
 *   3. 8 karakter rastgelelik (~2,8×10¹²) — farklı cihazlarda aynı
 *      milisaniye + sayaç denk gelse bile ayrışmayı sağlar. Kayıtlar bulut
 *      yedeğinde kimliğe göre birleştirildiği için bu katman gerekli.
 *
 * Ek fayda: kimlikler sözlük sırasında kronolojik olarak sıralanır.
 */

let sayac = 0;

const rastgeleParca = (uzunluk = 8) => {
  let sonuc = '';
  while (sonuc.length < uzunluk) {
    sonuc += Math.random().toString(36).slice(2);
  }
  return sonuc.slice(0, uzunluk);
};

export function yeniId() {
  sayac = (sayac + 1) % 0xffffff;
  return `${Date.now().toString(36)}-${sayac.toString(36)}-${rastgeleParca()}`;
}
