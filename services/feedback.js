import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';

import { mevcutKullanici } from './auth';
import { db } from './firebase';

const KOLEKSIYON = 'geribildirimler';

export const MESAJ_MIN = 10;
export const MESAJ_MAX = 2000;

/**
 * Geri bildirim konuları.
 *
 * Kategori sormanın iki faydası var: kullanıcı boş bir metin kutusuyla
 * karşılaşmak yerine ne yazacağını anlıyor, yönetici de gelen mesajı
 * okumadan önceliklendirebiliyor.
 */
export const KATEGORILER = [
  {
    key: 'hata',
    etiket: 'Bir hata var',
    aciklama: 'Bir şey çalışmıyor ya da yanlış hesaplıyor',
    ikon: 'bug-outline',
    soru: 'Ne oldu?',
    ipucu: 'Hangi ekranda olduğunu ve ne yaptığında oluştuğunu yazarsan daha hızlı çözülür.',
    ornek: 'Örn: Hafta sonu nöbeti 3 girdiğimde toplam değişmiyor. Maaş sekmesinde oluyor.',
  },
  {
    key: 'oneri',
    etiket: 'Önerim var',
    aciklama: 'Eklenmesini istediğin bir özellik',
    ikon: 'bulb-outline',
    soru: 'Ne eklenmesini istersin?',
    ipucu: 'Neye ihtiyaç duyduğunu ve neden işine yarayacağını anlatman yeterli.',
    ornek: 'Örn: Harcamaları kategoriye göre ayırabilmek isterim; market ve yakıt ayrı görünsün.',
  },
  {
    key: 'soru',
    etiket: 'Sorum var',
    aciklama: 'Bir şeyin nasıl çalıştığını anlamadın',
    ikon: 'help-circle-outline',
    soru: 'Ne öğrenmek istiyorsun?',
    ipucu: 'Sorunu olabildiğince açık yaz; e-postana dönüş yapılır.',
    ornek: 'Örn: Telefonumu değiştirsem kayıtlarım geri gelir mi? Yedekleme nasıl çalışıyor?',
  },
  {
    key: 'diger',
    etiket: 'Diğer',
    aciklama: 'Yukarıdakilerden hiçbiri değil',
    ikon: 'chatbox-ellipses-outline',
    soru: 'Ne söylemek istersin?',
    ipucu: 'Aklındaki her şeyi yazabilirsin.',
    ornek: 'Örn: Uygulamayı beğendim ama şu kısım kafa karıştırıcı geldi…',
  },
];

const GECERLI_KATEGORILER = KATEGORILER.map((k) => k.key);

/**
 * Geri bildirim gönderir.
 *
 * Belgeye gönderenin UID'si yazılır; güvenlik kuralı `request.resource.data.uid`
 * ile oturumun UID'sinin eşleşmesini zorunlu kılar, böylece bir istemci
 * başkasının adına kayıt oluşturamaz.
 */
export async function geriBildirimGonder({ mesaj, kategori, profil }) {
  const kullanici = mevcutKullanici();
  if (!kullanici) {
    throw new Error('Oturum açılamadı. İnternet bağlantını kontrol edip tekrar dene.');
  }

  const temizMesaj = String(mesaj ?? '').trim();
  if (temizMesaj.length < MESAJ_MIN) {
    throw new Error(`Mesaj en az ${MESAJ_MIN} karakter olmalı.`);
  }

  const temizKategori = GECERLI_KATEGORILER.includes(kategori) ? kategori : 'diger';

  await addDoc(collection(db, KOLEKSIYON), {
    uid: kullanici.uid,
    mesaj: temizMesaj.slice(0, MESAJ_MAX),
    kategori: temizKategori,
    isim: String(profil?.isim ?? '').trim() || null,
    soyisim: String(profil?.soyisim ?? '').trim() || null,
    eposta: kullanici.email ?? (String(profil?.eposta ?? '').trim().toLowerCase() || null),
    durum: 'Yeni',
    platform: Platform.OS,
    tarih: serverTimestamp(),
  });
}
