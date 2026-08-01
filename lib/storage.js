import AsyncStorage from '@react-native-async-storage/async-storage';

import { ayEtiketi, ayaGoreSirala } from './format';
import { yeniId } from './ids';
import { PRIM_KALEMLERI } from './prim';

export const STORAGE_KEYS = {
  maasKayitlari: 'maasKayitlari',
  harcamaKayitlari: 'harcamaKayitlari',
  profil: 'kullaniciProfili',
  tema: 'temaTercihi',
  hatirlananMaas: 'hatirlananMaas',
  maasiHatirla: 'maasiHatirla',
  gocSurumu: 'veriGocSurumu',
};

/** Eski (v0) anahtarlar — göç sırasında okunup temizlenir. */
const ESKI_KEYS = {
  tema: 'seciliTema',
  saklananMaas: 'saklananMaas',
  saklananHatirla: 'saklananHatirla',
  docId: 'kullaniciDocId',
};

const GUNCEL_GOC_SURUMU = '2';

const jsonOku = async (anahtar, varsayilan) => {
  try {
    const ham = await AsyncStorage.getItem(anahtar);
    if (ham === null) return varsayilan;
    const cozulen = JSON.parse(ham);
    return cozulen ?? varsayilan;
  } catch {
    return varsayilan;
  }
};

const jsonYaz = (anahtar, deger) => AsyncStorage.setItem(anahtar, JSON.stringify(deger));

/* ------------------------------------------------------------------ *
 * Normalleştirme — hem eski hem yeni biçimdeki kayıtları tek şemaya indirger
 * ------------------------------------------------------------------ */

const sayi = (deger) => {
  const n = typeof deger === 'number' ? deger : parseFloat(deger);
  return Number.isFinite(n) ? n : 0;
};

export function maasKaydiniNormallestir(kayit) {
  if (!kayit || typeof kayit !== 'object') return null;

  const alanlar = {};
  PRIM_KALEMLERI.forEach(({ adetAlani, paraAlani }) => {
    alanlar[adetAlani] = sayi(kayit[adetAlani]);
    alanlar[paraAlani] = sayi(kayit[paraAlani]);
  });

  // v0: `toplam` biçimlenmiş metindi, `rawMaas` metin olarak tutuluyordu.
  const hamToplam = kayit.hamToplam !== undefined
    ? sayi(kayit.hamToplam)
    : sayi(String(kayit.toplam ?? '').replace(/\./g, '').replace(',', '.'));

  const hamMaas = kayit.hamMaas !== undefined ? sayi(kayit.hamMaas) : sayi(kayit.rawMaas);

  return {
    id: typeof kayit.id === 'string' && kayit.id.length > 0 ? kayit.id : yeniId(),
    ay: typeof kayit.ay === 'string' ? kayit.ay : ayEtiketi(),
    hamMaas,
    hamToplam,
    ...alanlar,
    ozet: typeof kayit.ozet === 'string' ? kayit.ozet : '',
  };
}

export function harcamaKaydiniNormallestir(kayit) {
  if (!kayit || typeof kayit !== 'object') return null;
  return {
    id: typeof kayit.id === 'string' && kayit.id.length > 0 ? kayit.id : yeniId(),
    ay: typeof kayit.ay === 'string' ? kayit.ay : ayEtiketi(),
    isim: typeof kayit.isim === 'string' ? kayit.isim : 'Adsız harcama',
    tutar: sayi(kayit.tutar),
    tarih: typeof kayit.tarih === 'string' ? kayit.tarih : '',
    gun: sayi(kayit.gun) || null,
    saat: typeof kayit.saat === 'string' ? kayit.saat : null,
  };
}

const listeNormallestir = (liste, normallestir) =>
  (Array.isArray(liste) ? liste : []).map(normallestir).filter(Boolean);

/* ------------------------------------------------------------------ *
 * Okuma / yazma
 * ------------------------------------------------------------------ */

export async function maasKayitlariniOku() {
  const ham = await jsonOku(STORAGE_KEYS.maasKayitlari, []);
  return ayaGoreSirala(listeNormallestir(ham, maasKaydiniNormallestir));
}

export async function maasKayitlariniYaz(kayitlar) {
  const sirali = ayaGoreSirala(listeNormallestir(kayitlar, maasKaydiniNormallestir));
  await jsonYaz(STORAGE_KEYS.maasKayitlari, sirali);
  return sirali;
}

export async function harcamalariOku() {
  const ham = await jsonOku(STORAGE_KEYS.harcamaKayitlari, []);
  return listeNormallestir(ham, harcamaKaydiniNormallestir);
}

export async function harcamalariYaz(kayitlar) {
  const temiz = listeNormallestir(kayitlar, harcamaKaydiniNormallestir);
  await jsonYaz(STORAGE_KEYS.harcamaKayitlari, temiz);
  return temiz;
}

export async function profilOku() {
  const profil = await jsonOku(STORAGE_KEYS.profil, null);
  if (!profil || typeof profil !== 'object') return null;
  return {
    isim: String(profil.isim ?? '').trim(),
    soyisim: String(profil.soyisim ?? '').trim(),
    eposta: String(profil.eposta ?? '').trim().toLowerCase(),
  };
}

export async function profilYaz(profil) {
  const temiz = {
    isim: String(profil.isim ?? '').trim(),
    soyisim: String(profil.soyisim ?? '').trim(),
    eposta: String(profil.eposta ?? '').trim().toLowerCase(),
  };
  await jsonYaz(STORAGE_KEYS.profil, temiz);
  return temiz;
}

export async function maasHatirlamaOku() {
  const [tutar, acik] = await AsyncStorage.multiGet([
    STORAGE_KEYS.hatirlananMaas,
    STORAGE_KEYS.maasiHatirla,
  ]);
  return { tutar: tutar[1] ?? '', acik: acik[1] === 'true' };
}

export async function maasHatirlamaYaz(acik, tutar) {
  if (acik) {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.hatirlananMaas, String(tutar ?? '')],
      [STORAGE_KEYS.maasiHatirla, 'true'],
    ]);
  } else {
    await AsyncStorage.multiRemove([STORAGE_KEYS.hatirlananMaas]);
    await AsyncStorage.setItem(STORAGE_KEYS.maasiHatirla, 'false');
  }
}

/** Yerel veriyi tamamen siler (hesap silme / çıkış akışı). */
export async function yerelVeriyiTemizle() {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  await AsyncStorage.multiRemove(Object.values(ESKI_KEYS));
}

/* ------------------------------------------------------------------ *
 * Göç
 * ------------------------------------------------------------------ */

/**
 * v0 → v2 göçü. Eski anahtarları yeni adlara taşır, kayıtları normalleştirip
 * takvim sırasına sokar ve kimliksiz/çakışan kayıtlara yeni kimlik verir.
 * Birden çok kez çağrılması güvenlidir.
 */
export async function veriGocunuCalistir() {
  const surum = await AsyncStorage.getItem(STORAGE_KEYS.gocSurumu);
  if (surum === GUNCEL_GOC_SURUMU) return { calisti: false };

  // Tema tercihi: 'dark' | 'light' → aynı değerler, yeni anahtar
  const eskiTema = await AsyncStorage.getItem(ESKI_KEYS.tema);
  if (eskiTema === 'dark' || eskiTema === 'light') {
    const mevcut = await AsyncStorage.getItem(STORAGE_KEYS.tema);
    if (mevcut === null) await AsyncStorage.setItem(STORAGE_KEYS.tema, eskiTema);
  }

  // Maaş hatırlama
  const eskiMaas = await AsyncStorage.getItem(ESKI_KEYS.saklananMaas);
  const eskiHatirla = await AsyncStorage.getItem(ESKI_KEYS.saklananHatirla);
  if (eskiHatirla !== null) {
    await maasHatirlamaYaz(eskiHatirla === 'true', eskiMaas ?? '');
  }

  // Kayıtları normalleştir + kimlik çakışmalarını çöz
  const maaslar = await maasKayitlariniOku();
  const gorulen = new Set();
  const benzersizMaaslar = maaslar.map((k) => {
    if (gorulen.has(k.id)) return { ...k, id: yeniId() };
    gorulen.add(k.id);
    return k;
  });
  await maasKayitlariniYaz(benzersizMaaslar);

  const harcamalar = await harcamalariOku();
  const gorulenH = new Set();
  const benzersizHarcamalar = harcamalar.map((k) => {
    if (gorulenH.has(k.id)) return { ...k, id: yeniId() };
    gorulenH.add(k.id);
    return k;
  });
  await harcamalariYaz(benzersizHarcamalar);

  await AsyncStorage.multiRemove([
    ESKI_KEYS.tema,
    ESKI_KEYS.saklananMaas,
    ESKI_KEYS.saklananHatirla,
    ESKI_KEYS.docId,
  ]);

  await AsyncStorage.setItem(STORAGE_KEYS.gocSurumu, GUNCEL_GOC_SURUMU);
  return { calisti: true, maasSayisi: benzersizMaaslar.length, harcamaSayisi: benzersizHarcamalar.length };
}
