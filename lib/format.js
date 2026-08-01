const TR = 'tr-TR';

/** 42150.5 → "42.150,50" */
export const paraFormatla = (sayi, { kesir = 2 } = {}) =>
  (Number(sayi) || 0).toLocaleString(TR, {
    minimumFractionDigits: kesir,
    maximumFractionDigits: kesir,
  });

/** 42150.5 → "42.151" (özet gösterimler için) */
export const paraKisa = (sayi) =>
  (Number(sayi) || 0).toLocaleString(TR, { maximumFractionDigits: 0 });

/** "30000" → "30.000" (girdi alanlarında canlı biçimleme) */
export const rakamFormatla = (metin) => {
  if (metin === null || metin === undefined || metin === '') return '';
  const temiz = String(metin).replace(/\D/g, '');
  if (!temiz) return '';
  return Number(temiz).toLocaleString(TR);
};

/** Girdiden rakam dışındaki her şeyi atar. */
export const sadeceRakam = (metin) => String(metin ?? '').replace(/\D/g, '');

/** Ondalık girdiyi normalize eder: "12,5" → 12.5 */
export const ondalikCevir = (metin) => {
  const temiz = String(metin ?? '').replace(/[^0-9.,]/g, '').replace(',', '.');
  const sayi = parseFloat(temiz);
  return Number.isFinite(sayi) ? sayi : 0;
};

/** Date → "Temmuz 2026" */
export const ayEtiketi = (tarih = new Date()) =>
  tarih.toLocaleDateString(TR, { month: 'long', year: 'numeric' });

/** Date → "14:30" */
export const saatEtiketi = (tarih) =>
  tarih.toLocaleTimeString(TR, { hour: '2-digit', minute: '2-digit' });

/** "Temmuz 2026" → 2026 (bulunamazsa null) */
export const ayEtiketindenYil = (etiket) => {
  const eslesme = /(\d{4})$/.exec(String(etiket ?? '').trim());
  return eslesme ? Number(eslesme[1]) : null;
};

const AY_ADLARI = [
  'ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran',
  'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık',
];

/**
 * "Temmuz 2026" → sıralanabilir sayı (2026 * 12 + 6).
 * Ay adı çözülemezse null döner; çağıran taraf bu kayıtları sona atar.
 */
export const ayEtiketiSirasi = (etiket) => {
  const metin = String(etiket ?? '').trim().toLocaleLowerCase(TR);
  const yil = ayEtiketindenYil(metin);
  if (yil === null) return null;
  const ayIndex = AY_ADLARI.findIndex((ad) => metin.startsWith(ad));
  if (ayIndex === -1) return null;
  return yil * 12 + ayIndex;
};

/** Ay etiketli kayıtları yeniden eskiye sıralar (takvim sırası, ekleme sırası değil). */
export const ayaGoreSirala = (kayitlar, alan = 'ay') =>
  [...kayitlar].sort((a, b) => {
    const sa = ayEtiketiSirasi(a?.[alan]);
    const sb = ayEtiketiSirasi(b?.[alan]);
    if (sa === null && sb === null) return 0;
    if (sa === null) return 1;
    if (sb === null) return -1;
    return sb - sa;
  });

/** Firestore Timestamp | Date | null → "14.07.2026 21:30" */
export const tarihSaatFormatla = (deger) => {
  if (!deger) return '';
  const tarih = typeof deger?.toDate === 'function' ? deger.toDate() : new Date(deger);
  if (Number.isNaN(tarih.getTime())) return '';
  return tarih.toLocaleString(TR);
};
