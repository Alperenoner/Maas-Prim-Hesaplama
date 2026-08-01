/**
 * Tasarım jetonları — tüm renk, boşluk, yarıçap ve tipografi değerleri burada.
 * Ekranlar asla ham hex kullanmaz; `useTheme()` üzerinden bu jetonları okur.
 */

/** 8pt tabanlı boşluk ölçeği */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

/** Tipografi ölçeği — boyut/ağırlık/satır yüksekliği birlikte tanımlı */
export const type = {
  display: { fontSize: 32, fontWeight: '700', letterSpacing: -0.8, lineHeight: 38 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, lineHeight: 30 },
  heading: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, lineHeight: 24 },
  subheading: { fontSize: 15, fontWeight: '600', letterSpacing: -0.1, lineHeight: 20 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  bodyStrong: { fontSize: 15, fontWeight: '600', lineHeight: 21 },
  // Not: Türkçe'de ş/ç/ğ küçük punto satır yüksekliklerinde çengelleri
  // kırpılabiliyor; küçük boyutlarda ~1.4 oranı bilinçli olarak korunuyor.
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500', lineHeight: 17 },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, lineHeight: 16 },
  mono: { fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
};

/**
 * Vurgu renkleri. Her sekmenin kimliği bu renkle taşınır.
 * `on` = o rengin üzerine yazılacak metin, `tint` = %10-12 alfa yüzey.
 */
const accentsLight = {
  maas: { base: '#4F46E5', strong: '#4338CA', tint: '#EEF0FE', on: '#FFFFFF' },
  harcamalar: { base: '#DC2626', strong: '#B91C1C', tint: '#FEEDED', on: '#FFFFFF' },
  hizli: { base: '#15803D', strong: '#166534', tint: '#E9F6EE', on: '#FFFFFF' },
  gecmis: { base: '#B45309', strong: '#92400E', tint: '#FDF1E3', on: '#FFFFFF' },
};

const accentsDark = {
  maas: { base: '#8B85FF', strong: '#A5A0FF', tint: '#1D1B33', on: '#0B0D10' },
  harcamalar: { base: '#FF7A7A', strong: '#FF9494', tint: '#2E1A1C', on: '#0B0D10' },
  hizli: { base: '#4ADE80', strong: '#6EE7A0', tint: '#122619', on: '#0B0D10' },
  gecmis: { base: '#FBBF24', strong: '#FCD34D', tint: '#2A2113', on: '#0B0D10' },
};

/** Durum renkleri — vurgu renklerinden ayrı tutulur, hiçbir zaman seri rengi olarak kullanılmaz */
const statusLight = {
  success: '#15803D',
  successTint: '#E9F6EE',
  danger: '#DC2626',
  dangerTint: '#FEEDED',
  warning: '#B45309',
  warningTint: '#FDF1E3',
  info: '#4F46E5',
  infoTint: '#EEF0FE',
};

const statusDark = {
  success: '#4ADE80',
  successTint: '#122619',
  danger: '#FF7A7A',
  dangerTint: '#2E1A1C',
  warning: '#FBBF24',
  warningTint: '#2A2113',
  info: '#8B85FF',
  infoTint: '#1D1B33',
};

export const lightTheme = {
  mode: 'light',
  color: {
    bg: '#F5F6F8',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F2F5',
    surfaceSunken: '#EAEDF1',
    border: '#E3E7EC',
    borderStrong: '#CFD5DE',
    text: '#0F172A',
    textMuted: '#5A6474',
    textFaint: '#8B94A3',
    inverse: '#FFFFFF',
    overlay: 'rgba(15, 23, 42, 0.45)',
    skeleton: '#E8EBEF',
  },
  accent: accentsLight,
  status: statusLight,
  shadow: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    raised: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};

export const darkTheme = {
  mode: 'dark',
  color: {
    bg: '#0B0D10',
    surface: '#14171C',
    surfaceAlt: '#1B1F26',
    surfaceSunken: '#0F1216',
    border: '#252A33',
    borderStrong: '#39404C',
    text: '#F7F8FA',
    textMuted: '#9AA4B2',
    textFaint: '#6B7684',
    inverse: '#0B0D10',
    overlay: 'rgba(0, 0, 0, 0.62)',
    skeleton: '#1E232B',
  },
  accent: accentsDark,
  status: statusDark,
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 1,
    },
    raised: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};

/** Sekme anahtarı → vurgu adı eşlemesi (yönlendirme adlarıyla aynı) */
export const TAB_ACCENTS = {
  index: 'maas',
  expenses: 'harcamalar',
  explore: 'hizli',
  history: 'gecmis',
};
