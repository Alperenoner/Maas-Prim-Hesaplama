import { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemeContext } from './_layout';

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

  const bg = isDark ? '#121212' : '#f5f5f5';
  const text = isDark ? '#ffffff' : '#333333';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#fafafa';
  const borderColor = isDark ? '#444444' : '#dddddd';

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

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.title, { color: text }]}>Maaş & Nöbet Hesaplama</Text>

      <View style={[styles.card, {backgroundColor: cardBg, borderColor: borderColor}]}>

        <View style={styles.satirGirdi}>
          <Text style={[styles.label, {color: text}]}>Maaş Tutarı</Text>
          <TextInput
            style={[styles.input, {backgroundColor: inputBg, color: text, borderColor: borderColor}]}
            keyboardType="numeric"
            value={formatGoster(maas)}
            onChangeText={maasDegisti}
            placeholder="0"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.satirGirdi}>
          <Text style={[styles.label, {color: text}]}>Kurulum Sayısı</Text>
          <TextInput
            style={[styles.input, {backgroundColor: inputBg, color: text, borderColor: borderColor}]}
            keyboardType="numeric"
            value={kurulumSayisi}
            onChangeText={setKurulumSayisi}
            placeholder="0"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.satirGirdi}>
          <Text style={[styles.label, {color: text}]}>Hafta İçi Nöbet</Text>
          <TextInput
            style={[styles.input, {backgroundColor: inputBg, color: text, borderColor: borderColor}]}
            keyboardType="numeric"
            value={haftaIciSayisi}
            onChangeText={setHaftaIciSayisi}
            placeholder="0"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.satirGirdi}>
          <Text style={[styles.label, {color: text}]}>Hafta Sonu Nöbet</Text>
          <TextInput
            style={[styles.input, {backgroundColor: inputBg, color: text, borderColor: borderColor}]}
            keyboardType="numeric"
            value={haftaSonuSayisi}
            onChangeText={setHaftaSonuSayisi}
            placeholder="0"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.satirGirdi}>
          <Text style={[styles.label, {color: text}]}>Araç Nöbeti</Text>
          <TextInput
            style={[styles.input, {backgroundColor: inputBg, color: text, borderColor: borderColor}]}
            keyboardType="numeric"
            value={aracSayisi}
            onChangeText={setAracSayisi}
            placeholder="0"
            placeholderTextColor="#888"
          />
        </View>

        <View style={[styles.ayrac, {borderColor: borderColor}]} />

        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, {color: text}]}>Kurulum</Text>
          <Text style={[styles.sonucDeger, {color: text}]}>{formatTL(kurulumToplam)} TL</Text>
        </View>
        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, {color: text}]}>Hafta İçi</Text>
          <Text style={[styles.sonucDeger, {color: text}]}>{formatTL(haftaIciToplam)} TL</Text>
        </View>
        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, {color: text}]}>Hafta Sonu</Text>
          <Text style={[styles.sonucDeger, {color: text}]}>{formatTL(haftaSonuToplam)} TL</Text>
        </View>
        <View style={styles.sonucSatir}>
          <Text style={[styles.sonucLabel, {color: text}]}>Araç</Text>
          <Text style={[styles.sonucDeger, {color: text}]}>{formatTL(aracToplam)} TL</Text>
        </View>

        <View style={styles.genelToplamKutu}>
          <Text style={styles.genelToplamLabel}>Genel Toplam</Text>
          <Text style={styles.genelToplamDeger}>{formatTL(genelToplam)} TL</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  card: { padding: 14, borderRadius: 12, borderWidth: 1 },
  satirGirdi: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 13, flex: 1 },
  input: { borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, fontSize: 14, width: 110, textAlign: 'right' },
  ayrac: { borderBottomWidth: 1, marginVertical: 8 },
  sonucSatir: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  sonucLabel: { fontSize: 13 },
  sonucDeger: { fontSize: 13, fontWeight: '600' },
  genelToplamKutu: { marginTop: 10, backgroundColor: '#28a745', borderRadius: 8, padding: 10, alignItems: 'center' },
  genelToplamLabel: { color: '#fff', fontSize: 13, marginBottom: 2 },
  genelToplamDeger: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});