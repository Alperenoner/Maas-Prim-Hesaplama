/**
 * Yönetim paneli yapılandırması.
 *
 * Kurulum:  cp admin-panel/config.example.js admin-panel/config.js
 *           ve değerleri doldurun. `config.js` sürüm kontrolüne DAHİL DEĞİLDİR.
 *
 * Firebase değerleri gizli anahtar değildir (istemci yapılandırması tasarımı
 * gereği herkese açıktır) — verinin korunması `firestore.rules` ile sağlanır.
 * Yine de deponun herkese açık olduğu durumlarda proje
 * kimliğini dışarıda tutmak iyi bir alışkanlıktır.
 */

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};
