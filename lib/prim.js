/**
 * Prim hesaplama kuralının TEK kaynağı.
 * Hem "Maaş" hem "Hızlı hesaplama" ekranı buradan besleniyor —
 * oranlar değişince yalnızca bu dosya güncellenir.
 */

/** Oranlar ana maaşın yüzdesi cinsindendir. */
export const PRIM_ORANLARI = {
  kurulum: 0.025,
  haftaIci: 0.025,
  haftaSonu: 0.035,
  arac: 0.035,
};

/** Ekranlarda tekrar eden kalem tanımı — etiket, ikon ve alan adları tek yerde. */
export const PRIM_KALEMLERI = [
  {
    key: 'kurulum',
    etiket: 'Kurulum',
    kisaEtiket: 'Kurulum',
    ikon: 'construct-outline',
    adetAlani: 'kurulumAdet',
    paraAlani: 'kurulumPara',
  },
  {
    key: 'haftaIci',
    etiket: 'Hafta İçi Nöbet',
    kisaEtiket: 'H. İçi',
    ikon: 'briefcase-outline',
    adetAlani: 'haftaIciAdet',
    paraAlani: 'haftaIciPara',
  },
  {
    key: 'haftaSonu',
    etiket: 'Hafta Sonu Nöbet',
    kisaEtiket: 'H. Sonu',
    ikon: 'calendar-outline',
    adetAlani: 'haftaSonuAdet',
    paraAlani: 'haftaSonuPara',
  },
  {
    key: 'arac',
    etiket: 'Araç Nöbeti',
    kisaEtiket: 'Araç',
    ikon: 'car-sport-outline',
    adetAlani: 'aracAdet',
    paraAlani: 'aracPara',
  },
];

const sayiyaCevir = (deger) => {
  const sayi = typeof deger === 'number' ? deger : parseFloat(String(deger ?? '').replace(/\D/g, ''));
  return Number.isFinite(sayi) && sayi > 0 ? sayi : 0;
};

/**
 * @param {number|string} maas   Ana maaş
 * @param {Record<string, number|string>} adetler  Kalem anahtarı → adet
 * @returns {{
 *   anaMaas: number,
 *   kalemler: Array<{key: string, etiket: string, adet: number, birim: number, tutar: number}>,
 *   primToplam: number,
 *   toplam: number,
 * }}
 */
export function primHesapla(maas, adetler = {}) {
  const anaMaas = sayiyaCevir(maas);

  const kalemler = PRIM_KALEMLERI.map((kalem) => {
    const adet = sayiyaCevir(adetler[kalem.key]);
    const birim = anaMaas * PRIM_ORANLARI[kalem.key];
    return {
      key: kalem.key,
      etiket: kalem.etiket,
      kisaEtiket: kalem.kisaEtiket,
      ikon: kalem.ikon,
      oran: PRIM_ORANLARI[kalem.key],
      adet,
      birim,
      tutar: birim * adet,
    };
  });

  const primToplam = kalemler.reduce((toplam, k) => toplam + k.tutar, 0);

  return { anaMaas, kalemler, primToplam, toplam: anaMaas + primToplam };
}

/** Hesap sonucunu diske yazılacak kayıt biçimine dönüştürür. */
export function kayitOlustur({ id, ay, maas, adetler }) {
  const { anaMaas, kalemler, toplam } = primHesapla(maas, adetler);

  const alanlar = {};
  kalemler.forEach((kalem) => {
    const tanim = PRIM_KALEMLERI.find((t) => t.key === kalem.key);
    alanlar[tanim.adetAlani] = kalem.adet;
    alanlar[tanim.paraAlani] = kalem.tutar;
  });

  return {
    id,
    ay,
    hamMaas: anaMaas,
    hamToplam: toplam,
    ...alanlar,
    ozet: kalemler.map((k) => `${k.kisaEtiket}: ${k.adet}`).join(' · '),
  };
}

/** Kayıttan düzenleme formunu geri doldurmak için adetleri çıkarır. */
export function kayittanAdetler(kayit) {
  const adetler = {};
  PRIM_KALEMLERI.forEach((kalem) => {
    adetler[kalem.key] = kayit?.[kalem.adetAlani] ?? 0;
  });
  return adetler;
}
