import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const yedekIdOlustur = (eposta) => eposta.trim().toLowerCase();

export const yedegeKaydet = async (eposta, veriler) => {
  if (!eposta) return;
  try {
    await setDoc(doc(db, 'yedekler', yedekIdOlustur(eposta)), {
      ...veriler,
      guncellenmeTarihi: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.log('Yedekleme hatası:', e);
  }
};

export const yedektenGeriYukle = async (eposta) => {
  if (!eposta) return null;
  try {
    const belge = await getDoc(doc(db, 'yedekler', yedekIdOlustur(eposta)));
    return belge.exists() ? belge.data() : null;
  } catch (e) {
    console.log('Yedek getirme hatası:', e);
    return null;
  }
};
