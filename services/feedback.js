import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';

import { mevcutKullanici } from './auth';
import { db } from './firebase';

const KOLEKSIYON = 'geribildirimler';

export const MESAJ_MIN = 10;
export const MESAJ_MAX = 2000;

/**
 * Geri bildirim gönderir.
 *
 * Belgeye gönderenin UID'si yazılır; güvenlik kuralı `request.resource.data.uid`
 * ile oturumun UID'sinin eşleşmesini zorunlu kılar, böylece bir istemci
 * başkasının adına kayıt oluşturamaz.
 */
export async function geriBildirimGonder({ mesaj, profil }) {
  const kullanici = mevcutKullanici();
  if (!kullanici) throw new Error('Oturum açık değil.');

  const temizMesaj = String(mesaj ?? '').trim();
  if (temizMesaj.length < MESAJ_MIN) {
    throw new Error(`Mesaj en az ${MESAJ_MIN} karakter olmalı.`);
  }

  await addDoc(collection(db, KOLEKSIYON), {
    uid: kullanici.uid,
    mesaj: temizMesaj.slice(0, MESAJ_MAX),
    isim: String(profil?.isim ?? '').trim() || null,
    soyisim: String(profil?.soyisim ?? '').trim() || null,
    eposta: kullanici.email ?? (String(profil?.eposta ?? '').trim().toLowerCase() || null),
    durum: 'Yeni',
    platform: Platform.OS,
    tarih: serverTimestamp(),
  });
}
