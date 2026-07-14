import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { TAB_RENKLERI, ThemeContext } from './_layout';

const RENK = TAB_RENKLERI.hizli;

const KALEMLER = [
  { key: 'kurulum', label: 'Kurulum', icon: 'construct' },
  { key: 'haftaIci', label: 'Hafta İçi', icon: 'briefcase' },
  { key: 'haftaSonu', label: 'Hafta Sonu', icon: 'calendar' },
  { key: 'arac', label: 'Araç', icon: 'car-sport' },
];

export default function ExploreScreen() {
  const { isDark } = useContext(ThemeContext);
  const [maas, setMaas] = useState('');
  const [kurulumSayisi, setKurulumSayisi] = useState('');
  const [haftaIciSayisi, setHaftaIciSayisi] = useState('');
  const [haftaSonuSayisi, setHaftaSonuSayisi] = useState('');
  const [aracSayisi, setAracSayisi] = useState('');

  const [kurulumToplam, setKurulumToplam] = useState(0);
  const [haftaIciToplam, setHaftaIciToplam] = useState(0);
  const [haftaSonuToplam, setHaftaSonuToplam] = useState(0);
  const [aracToplam, setAracToplam] = useState(0);
  const [genelToplam, setGenelToplam] = useState(0);

  const bg = isDark ? '#121212' : '#f2f4f8';
  const text = isDark ? '#ffffff' : '#1f2430';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#f7f8fb';
  const borderColor = isDark ? '#3a3a3a' : '#e6e8ee';
  const mutedText = isDark ? '#9aa0aa' : '#8a8f9a';

  const maasDegisti = (girilen) => {
    const temiz = girilen.replace(/[^0-9]/g, '');
    setMaas(temiz);
  };

  const formatGoster = (rakamDizisi) => {
    if (!rakamDizisi) return '';
    return parseInt(rakamDizisi, 10).toLocaleString('tr-TR');
  };

  const formatTL = (sayi) => sayi.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

  useEffect(() => {
    const m = parseFloat(maas) || 0;
    const kSayi = parseFloat(kurulumSayisi) || 0;
    const hiSayi = parseFloat(haftaIciSayisi) || 0;
    const hsSayi = parseFloat(haftaSonuSayisi) || 0;
    const aSayi = parseFloat(aracSayisi) || 0;

    const kurulum = kSayi * (m * 0.025);
    const haftaIci = hiSayi * (m * 0.025);
    const haftaSonu = hsSayi * (m * 0.035);
    const arac = aSayi * (m * 0.035);

    setKurulumToplam(kurulum);
    setHaftaIciToplam(haftaIci);
    setHaftaSonuToplam(haftaSonu);
    setAracToplam(arac);
    setGenelToplam(m + kurulum + haftaIci + haftaSonu + arac);
  }, [maas, kurulumSayisi, haftaIciSayisi, haftaSonuSayisi, aracSayisi]);

  const sayilar = {
    kurulum: [kurulumSayisi, setKurulumSayisi, kurulumToplam],
    haftaIci: [haftaIciSayisi, setHaftaIciSayisi, haftaIciToplam],
    haftaSonu: [haftaSonuSayisi, setHaftaSonuSayisi, haftaSonuToplam],
    arac: [aracSayisi, setAracSayisi, aracToplam],
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.hero, { backgroundColor: RENK }]}>
        <View style={styles.heroIconKutu}>
          <Ionicons name="flash" size={22} color="#fff" />
        </View>
        <Text style={styles.heroBaslik}>Hızlı Hesaplama</Text>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderColor }]}>

        <View style={styles.satirGirdi}>
          <View style={styles.labelSatir}>
            <Ionicons name="cash" size={15} color={RENK} style={styles.labelIcon} />
            <Text style={[styles.label, { color: text }]}>Maaş Tutarı</Text>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]}
            keyboardType="numeric"
            value={formatGoster(maas)}
            onChangeText={maasDegisti}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') setMaas('');
            }}
            placeholder="0"
            placeholderTextColor={mutedText}
          />
        </View>

        {KALEMLER.map(({ key, label, icon }) => {
          const [deger, setter] = sayilar[key];
          return (
            <View style={styles.satirGirdi} key={key}>
              <View style={styles.labelSatir}>
                <Ionicons name={icon} size={15} color={RENK} style={styles.labelIcon} />
                <Text style={[styles.label, { color: text }]}>{label}</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]}
                keyboardType="numeric"
                value={deger}
                onChangeText={setter}
                placeholder="0"
                placeholderTextColor={mutedText}
              />
            </View>
          );
        })}

        <View style={[styles.ayrac, { borderColor: borderColor }]} />

        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, { color: mutedText }]}>Kurulum</Text>
          <Text style={[styles.sonucDeger, { color: text }]}>{formatTL(kurulumToplam)} TL</Text>
        </View>
        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, { color: mutedText }]}>Hafta İçi</Text>
          <Text style={[styles.sonucDeger, { color: text }]}>{formatTL(haftaIciToplam)} TL</Text>
        </View>
        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, { color: mutedText }]}>Hafta Sonu</Text>
          <Text style={[styles.sonucDeger, { color: text }]}>{formatTL(haftaSonuToplam)} TL</Text>
        </View>
        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, { color: mutedText }]}>Araç</Text>
          <Text style={[styles.sonucDeger, { color: text }]}>{formatTL(aracToplam)} TL</Text>
        </View>

        <View style={[styles.genelToplamKutu, { backgroundColor: RENK }]}>
          <Text style={styles.genelToplamLabel}>Genel Toplam</Text>
          <Text style={styles.genelToplamDeger}>{formatTL(genelToplam)} TL</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 14 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroIconKutu: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroBaslik: { fontSize: 17, fontWeight: '800', color: '#fff' },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  satirGirdi: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  labelSatir: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  labelIcon: { marginRight: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10, fontSize: 14, width: 112, textAlign: 'right', fontWeight: '600' },
  ayrac: { borderBottomWidth: 1, marginVertical: 8 },
  sonucSatir: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  sonucLabel: { fontSize: 13, fontWeight: '500' },
  sonucDeger: { fontSize: 13, fontWeight: '700' },
  genelToplamKutu: {
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  genelToplamLabel: { color: '#fff', fontSize: 13, marginBottom: 2, fontWeight: '600' },
  genelToplamDeger: { color: '#fff', fontSize: 23, fontWeight: '800' },
});
