/**
 * Yönetim paneli yapılandırması.
 *
 * Kurulum:  cp admin-panel/config.example.js admin-panel/config.js
 *           ve değerleri doldurun. `config.js` sürüm kontrolüne DAHİL DEĞİLDİR.
 *
 * Firebase değerleri gizli anahtar değildir (istemci yapılandırması tasarımı
 * gereği herkese açıktır) — verinin korunması `firestore.rules` ile sağlanır.
 * Yine de deponun herkese açık olduğu durumlarda proje kimliğini ve özellikle
 * EmailJS anahtarlarını dışarıda tutmak, kotanızın üçüncü taraflarca
 * kullanılmasını zorlaştırır.
 */

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

/**
 * EmailJS yanıt gönderimi.
 *
 * GÜVENLİK: EmailJS istemci tarafında çalışır; bu anahtarlar yayınlanan
 * sayfanın kaynağından okunabilir. Şablonun başkaları tarafından
 * kullanılmasını engellemenin TEK yolu EmailJS panelinden
 * Account → Security → Allowed origins altına yayın alan adınızı eklemektir.
 */
export const EMAILJS = {
  serviceId: '',
  templateId: '',
  publicKey: '',
};
