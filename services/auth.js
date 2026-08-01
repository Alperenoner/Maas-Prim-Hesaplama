import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from './firebase';

/**
 * Kimlik modeli
 * ─────────────
 * • Anonim oturum  → uygulama tamamen yerel çalışır, bulut yedeği KAPALI.
 * • Kalıcı hesap   → e-posta + şifre; UID cihazlar arasında sabit kalır,
 *                    bulut yedeği bu UID ile anahtarlanır.
 *
 * Anonim bir kullanıcı hesap oluşturduğunda `linkWithCredential` kullanılır:
 * UID değişmez, dolayısıyla o ana kadar yazılmış yedek kaybolmaz.
 */

export const ANONIM = 'anonim';
export const KALICI = 'kalici';

export function mevcutKullanici() {
  return auth.currentUser;
}

export function kullaniciTuru(kullanici = auth.currentUser) {
  if (!kullanici) return null;
  return kullanici.isAnonymous ? ANONIM : KALICI;
}

/** Bulut yedeği yalnızca kalıcı hesaplarda çalışır. */
export function yedeklemeAcikMi(kullanici = auth.currentUser) {
  return Boolean(kullanici) && !kullanici.isAnonymous;
}

export function oturumuIzle(geriCagirim) {
  return onAuthStateChanged(auth, geriCagirim);
}

/**
 * Oturum durumunu canlı izleyen hook.
 *
 * Ekranlar `yedeklemeAcikMi()` sonucunu tek seferlik okumak yerine bunu
 * kullanır; profil ekranından hesap açıldığında diğer ekranlardaki
 * "yedekleme kapalı" uyarısı anında kaybolur.
 */
export function useOturum() {
  const [kullanici, setKullanici] = useState(() => auth.currentUser);
  const [hazir, setHazir] = useState(() => Boolean(auth.currentUser));

  useEffect(() => {
    return onAuthStateChanged(auth, (yeni) => {
      setKullanici(yeni);
      setHazir(true);
    });
  }, []);

  return { kullanici, hazir, yedekAcik: yedeklemeAcikMi(kullanici) };
}

/**
 * Uygulama açılışında çağrılır — hiçbir oturum yoksa anonim oturum açar.
 *
 * ÖNEMLİ: Bu çağrı arayüzü BLOKE ETMEZ. Uygulama yerel-öncelikli çalışır;
 * ağ yavaş ya da erişilemez olduğunda kullanıcı yine de kayıt girebilmeli.
 * (Önceki sürüm açılışta `signInAnonymously`'yi bekliyordu ve ağ yanıt
 * vermediğinde uygulama yükleme göstergesinde kilitli kalıyordu.)
 */
export async function oturumuBaslat() {
  if (auth.currentUser) return auth.currentUser;
  const sonuc = await signInAnonymously(auth);
  return sonuc.user;
}

const HATA_MESAJLARI = {
  'auth/invalid-email': 'E-posta adresi geçersiz görünüyor.',
  'auth/email-already-in-use': 'Bu e-posta zaten kullanımda. Giriş yapmayı deneyin.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/wrong-password': 'E-posta veya şifre hatalı.',
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/user-not-found': 'Bu e-postayla kayıtlı bir hesap bulunamadı.',
  'auth/too-many-requests': 'Çok fazla deneme yapıldı. Bir süre sonra tekrar deneyin.',
  'auth/network-request-failed': 'İnternet bağlantısı kurulamadı.',
  'auth/requires-recent-login': 'Bu işlem için tekrar giriş yapmanız gerekiyor.',
  'auth/credential-already-in-use': 'Bu e-posta başka bir hesaba bağlı. Giriş yapmayı deneyin.',
  'auth/operation-not-allowed': 'E-posta/şifre girişi Firebase projesinde etkin değil.',
};

export function hatayiCevir(hata) {
  return HATA_MESAJLARI[hata?.code] ?? 'Beklenmeyen bir hata oluştu. Tekrar deneyin.';
}

const gorunenAdiAyarla = async (kullanici, isim, soyisim) => {
  const ad = [isim, soyisim].filter(Boolean).join(' ').trim();
  if (!ad || kullanici.displayName === ad) return;
  try {
    await updateProfile(kullanici, { displayName: ad });
  } catch {
    // Görünen ad kritik değil — başarısız olursa akışı durdurmuyoruz.
  }
};

/**
 * Kalıcı hesap oluşturur. Anonim bir oturum açıksa hesabı ona BAĞLAR,
 * böylece mevcut UID (ve o UID'ye yazılmış yedek) korunur.
 */
export async function hesapOlustur({ eposta, sifre, isim, soyisim }) {
  const temizEposta = String(eposta).trim().toLowerCase();
  const mevcut = auth.currentUser;

  if (mevcut?.isAnonymous) {
    const kimlik = EmailAuthProvider.credential(temizEposta, sifre);
    const sonuc = await linkWithCredential(mevcut, kimlik);
    await gorunenAdiAyarla(sonuc.user, isim, soyisim);
    return sonuc.user;
  }

  const sonuc = await createUserWithEmailAndPassword(auth, temizEposta, sifre);
  await gorunenAdiAyarla(sonuc.user, isim, soyisim);
  return sonuc.user;
}

/** Mevcut hesaba giriş yapar (cihaz değiştirme senaryosu). */
export async function girisYap({ eposta, sifre }) {
  const sonuc = await signInWithEmailAndPassword(auth, String(eposta).trim().toLowerCase(), sifre);
  return sonuc.user;
}

export async function sifreSifirlamaGonder(eposta) {
  await sendPasswordResetEmail(auth, String(eposta).trim().toLowerCase());
}

/** Çıkış yapar ve hemen yeni bir anonim oturum açar — uygulama çalışmaya devam eder. */
export async function cikisYap() {
  await signOut(auth);
  return oturumuBaslat();
}
