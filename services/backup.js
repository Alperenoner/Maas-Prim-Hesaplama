import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { harcamaKaydiniNormallestir, maasKaydiniNormallestir } from '../lib/storage';
import { mevcutKullanici, yedeklemeAcikMi } from './auth';
import { db } from './firebase';

/**
 * Bulut yedeği artık KULLANICI UID'si ile anahtarlanır.
 *
 * Önceki sürümde belge kimliği kullanıcının e-postasıydı ve güvenlik kuralı
 * yalnızca "oturum açmış olmak" arıyordu; bu, e-postasını bilen herkesin
 * bir başkasının maaş ve harcama geçmişini okumasına ve üzerine yazmasına
 * izin veriyordu. UID tahmin edilemez ve kural artık sahipliği doğruluyor.
 */
const YEDEK_KOLEKSIYONU = 'yedekler';

const yedekReferansi = (uid) => doc(db, YEDEK_KOLEKSIYONU, uid);

/**
 * Yerel veriyi buluta yazar.
 * Anonim oturumda sessizce atlanır — anonim UID cihaza özeldir ve
 * uygulama silindiğinde geri getirilemez, dolayısıyla yedek anlamsız olur.
 *
 * @returns {Promise<{durum: 'yazildi'|'atlandi'|'hata', sebep?: string}>}
 */
export async function yedegeYaz({ maasKayitlari, harcamaKayitlari }) {
  const kullanici = mevcutKullanici();
  if (!yedeklemeAcikMi(kullanici)) {
    return { durum: 'atlandi', sebep: 'hesap-yok' };
  }

  try {
    await setDoc(
      yedekReferansi(kullanici.uid),
      {
        maasKayitlari: maasKayitlari ?? [],
        harcamaKayitlari: harcamaKayitlari ?? [],
        guncellenmeTarihi: serverTimestamp(),
        surum: 2,
      },
      { merge: true }
    );
    return { durum: 'yazildi' };
  } catch (hata) {
    if (__DEV__) console.warn('[yedek] yazma başarısız:', hata?.code ?? hata);
    return { durum: 'hata', sebep: hata?.code ?? 'bilinmeyen' };
  }
}

/**
 * Buluttaki yedeği okur. Yalnızca oturum sahibinin kendi belgesine erişebildiği
 * için ayrıca bir sahiplik kontrolüne gerek yoktur — kural bunu zorlar.
 *
 * @returns {Promise<{maasKayitlari: any[], harcamaKayitlari: any[], guncellenmeTarihi: any}|null>}
 */
export async function yedegiOku() {
  const kullanici = mevcutKullanici();
  if (!yedeklemeAcikMi(kullanici)) return null;

  try {
    const belge = await getDoc(yedekReferansi(kullanici.uid));
    if (!belge.exists()) return null;
    const veri = belge.data();
    return {
      maasKayitlari: (veri.maasKayitlari ?? []).map(maasKaydiniNormallestir).filter(Boolean),
      harcamaKayitlari: (veri.harcamaKayitlari ?? []).map(harcamaKaydiniNormallestir).filter(Boolean),
      guncellenmeTarihi: veri.guncellenmeTarihi ?? null,
    };
  } catch (hata) {
    if (__DEV__) console.warn('[yedek] okuma başarısız:', hata?.code ?? hata);
    return null;
  }
}

/**
 * İki listeyi kimliğe göre birleştirir — cihaz değiştirmede yerel ve bulut
 * verisinin çakışması hâlinde hiçbir kayıt kaybolmaz.
 */
export function listeleriBirlestir(yerel = [], bulut = []) {
  const harita = new Map();
  bulut.forEach((kayit) => kayit?.id && harita.set(kayit.id, kayit));
  yerel.forEach((kayit) => kayit?.id && harita.set(kayit.id, kayit));
  return Array.from(harita.values());
}
