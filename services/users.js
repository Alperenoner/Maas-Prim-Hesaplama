import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

import { mevcutKullanici, yedeklemeAcikMi } from './auth';
import { db } from './firebase';

/**
 * Kullanıcı belgesinin kimliği artık otomatik değil, oturumun UID'sidir.
 *
 * Önceki sürümde belge kimliği rastgeleydi ve kural "oturum açmış herkes
 * güncelleyebilir" diyordu; belge kimliğini ele geçiren biri başkasının
 * kaydını değiştirebilirdi. UID'yi kimlik yapmak, kuralın sahipliği
 * (`request.auth.uid == uid`) doğrudan doğrulamasını mümkün kılıyor.
 */
const KOLEKSIYON = 'kullanicilar';

/**
 * Profil bilgisini oluşturur veya günceller.
 * Anonim oturumda hiçbir şey yazılmaz — kimliği doğrulanmamış kayıt tutmanın
 * yönetim paneli açısından bir değeri yok.
 */
export async function profiliSenkronla({ isim, soyisim, eposta }) {
  const kullanici = mevcutKullanici();
  if (!yedeklemeAcikMi(kullanici)) return { durum: 'atlandi' };

  try {
    await setDoc(
      doc(db, KOLEKSIYON, kullanici.uid),
      {
        isim: String(isim ?? '').trim(),
        soyisim: String(soyisim ?? '').trim(),
        eposta: String(eposta ?? '').trim().toLowerCase(),
        platform: Platform.OS,
        guncellenmeTarihi: serverTimestamp(),
        // `kayitTarihi` yalnızca ilk yazımda oluşur; merge sayesinde korunur.
        ...(await ilkKayitAlani(kullanici.uid)),
      },
      { merge: true }
    );
    return { durum: 'yazildi' };
  } catch (hata) {
    if (__DEV__) console.warn('[kullanici] senkron başarısız:', hata?.code ?? hata);
    return { durum: 'hata', sebep: hata?.code ?? 'bilinmeyen' };
  }
}

/**
 * Belge daha önce yazılmadıysa `kayitTarihi` alanını ekler.
 * Okuma hakkı yalnızca sahibinde ve yöneticide olduğu için bu çağrı güvenlidir.
 */
async function ilkKayitAlani(uid) {
  try {
    const belge = await getDoc(doc(db, KOLEKSIYON, uid));
    return belge.exists() ? {} : { kayitTarihi: serverTimestamp() };
  } catch {
    return {};
  }
}

/**
 * Oturum sahibinin kendi profil belgesini okur.
 * Cihaz değiştirildiğinde isim/soyisim bilgisini geri getirmek için kullanılır.
 */
export async function profiliGetir() {
  const kullanici = mevcutKullanici();
  if (!yedeklemeAcikMi(kullanici)) return null;

  try {
    const belge = await getDoc(doc(db, KOLEKSIYON, kullanici.uid));
    if (!belge.exists()) return null;
    const veri = belge.data();
    return {
      isim: String(veri.isim ?? '').trim(),
      soyisim: String(veri.soyisim ?? '').trim(),
      eposta: String(veri.eposta ?? kullanici.email ?? '').trim().toLowerCase(),
    };
  } catch {
    return null;
  }
}
