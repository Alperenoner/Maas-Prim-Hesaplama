import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TAB_RENKLERI, ThemeContext } from './_layout';

const RENK = TAB_RENKLERI.maas;

export default function App() {
  const [maas, setMaas] = useState('');
  const [hatirla, setHatirla] = useState(false);
  const [kurulum, setKurulum] = useState('');
  const [haftaIci, setHaftaIci] = useState('');
  const [haftaSonu, setHaftaSonu] = useState('');
  const [arac, setArac] = useState('');
  const [aylikKayitlar, setAylikKayitlar] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const { isDark } = useContext(ThemeContext);

  const bg = isDark ? '#121212' : '#f2f4f8';
  const text = isDark ? '#ffffff' : '#1f2430';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#f7f8fb';
  const borderColor = isDark ? '#3a3a3a' : '#e6e8ee';
  const mutedText = isDark ? '#9aa0aa' : '#8a8f9a';
  const anlikKutuBg = isDark ? '#2c2c2c' : '#eef0fc';

  useFocusEffect(useCallback(() => { verileriYukle(); }, []));

  const verileriYukle = async () => {
    try {
      const kayitlar = await AsyncStorage.getItem('maasKayitlari');
      if (kayitlar !== null) setAylikKayitlar(JSON.parse(kayitlar));
      const saklananMaas = await AsyncStorage.getItem('saklananMaas');
      const saklananHatirla = await AsyncStorage.getItem('saklananHatirla');
      if (saklananHatirla === 'true' && saklananMaas) { setMaas(saklananMaas); setHatirla(true); }
    } catch (e) { console.log(e); }
  };

  const hatirlaDegistir = async (value) => {
    setHatirla(value);
    if (value) { await AsyncStorage.setItem('saklananMaas', maas); await AsyncStorage.setItem('saklananHatirla', 'true'); }
    else { await AsyncStorage.removeItem('saklananMaas'); await AsyncStorage.setItem('saklananHatirla', 'false'); }
  };

  const sayiyiFormatla = (deger) => !deger ? '' : Number(deger).toLocaleString('tr-TR');
  const sadeceRakam = (t, setter) => setter(t.replace(/[^0-9]/g, ''));

  const anaMaas = parseFloat(maas) || 0;
  const birim2Bucuk = anaMaas * 0.025;
  const birim3Bucuk = anaMaas * 0.035;

  const kSayi = parseInt(kurulum) || 0;
  const hiSayi = parseInt(haftaIci) || 0;
  const hsSayi = parseInt(haftaSonu) || 0;
  const aSayi = parseInt(arac) || 0;

  const kPara = birim2Bucuk * kSayi;
  const hiPara = birim2Bucuk * hiSayi;
  const hsPara = birim3Bucuk * hsSayi;
  const aPara = birim3Bucuk * aSayi;

  const anlikToplam = anaMaas + kPara + hiPara + hsPara + aPara;

  const ayaKaydet = async () => {
    if (anlikToplam === 0) { Alert.alert("Hata", "Önce maaş girmelisin."); return; }
    const suAnkiAy = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

    if (!editingId) {
      const buAyZatenVarMi = aylikKayitlar.find(item => item.ay === suAnkiAy);
      if (buAyZatenVarMi) {
        Alert.alert("Hata", "Bu ay için kayıtlı maaş-prim hesaplamanız mevcut. Yeni giriş değil düzenleme yapmanız gerekmektedir.");
        return;
      }
    }

    let guncelListe = [...aylikKayitlar];
    const kayitVerisi = {
      ay: suAnkiAy,
      toplam: anlikToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      hamToplam: anlikToplam, rawMaas: maas,
      kurulumAdet: kSayi, kurulumPara: kPara,
      haftaIciAdet: hiSayi, haftaIciPara: hiPara,
      haftaSonuAdet: hsSayi, haftaSonuPara: hsPara,
      aracAdet: aSayi, aracPara: aPara,
      ozet: `Kurulum: ${kSayi} | H.İçi: ${hiSayi} | H.Sonu: ${hsSayi} | Araç: ${aSayi}`
    };

    if (editingId) {
      guncelListe = aylikKayitlar.map(item => item.id === editingId ? { ...item, ...kayitVerisi } : item);
      setEditingId(null);
      Alert.alert("Başarılı", "Kayıt güncellendi.");
    } else {
      guncelListe = [{ id: Math.random().toString(), ...kayitVerisi }, ...aylikKayitlar];
      Alert.alert("Başarılı", `${suAnkiAy} eklendi.`);
    }

    setAylikKayitlar(guncelListe);
    await AsyncStorage.setItem('maasKayitlari', JSON.stringify(guncelListe));
    setKurulum(''); setHaftaIci(''); setHaftaSonu(''); setArac('');
  };

  const kayitSil = async (id) => {
    const kalanlar = aylikKayitlar.filter(item => item.id !== id);
    setAylikKayitlar(kalanlar);
    await AsyncStorage.setItem('maasKayitlari', JSON.stringify(kalanlar));
  };

  const kartTiklandi = (item) => {
    Alert.alert(`${item.ay} İşlemleri`, "Ne yapmak istersin?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => kayitSil(item.id) },
      { text: "Düzenle", onPress: () => { setEditingId(item.id); setMaas(item.rawMaas||''); setKurulum(item.kurulumAdet?.toString()||'0'); setHaftaIci(item.haftaIciAdet?.toString()||'0'); setHaftaSonu(item.haftaSonuAdet?.toString()||'0'); setArac(item.aracAdet?.toString()||'0'); } }
    ]);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: RENK }]}>
          <View style={styles.heroIconKutu}>
            <Ionicons name="wallet" size={22} color="#fff" />
          </View>
          <Text style={styles.heroBaslik}>Maaş Takip Sistemi</Text>
        </View>

        <View style={[styles.inputAlan, { backgroundColor: cardBg, borderColor: borderColor, borderWidth: 1 }]}>
          <Text style={[styles.etiket, { color: text }]}>Ana Maaş Tutarı</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(maas)} onChangeText={(t) => sadeceRakam(t, setMaas)} placeholder="Örn: 30.000" placeholderTextColor={mutedText} />

          <View style={styles.switchSatir}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="bookmark" size={14} color={RENK} style={{ marginRight: 5 }} />
              <Text style={[styles.switchEtiket, { color: mutedText }]}>Maaşımı Hatırla</Text>
            </View>
            <Switch value={hatirla} onValueChange={hatirlaDegistir} trackColor={{ true: RENK, false: '#767577' }} />
          </View>

          <Text style={[styles.etiket, { color: text }]}>Kurulum Sayısı {kSayi > 0 && <Text style={{ color: RENK }}>(+ {kPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(kurulum)} onChangeText={(t) => sadeceRakam(t, setKurulum)} placeholder="0" placeholderTextColor={mutedText} />

          <Text style={[styles.etiket, { color: text }]}>Hafta İçi Nöbet {hiSayi > 0 && <Text style={{ color: RENK }}>(+ {hiPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(haftaIci)} onChangeText={(t) => sadeceRakam(t, setHaftaIci)} placeholder="0" placeholderTextColor={mutedText} />

          <Text style={[styles.etiket, { color: text }]}>Hafta Sonu Nöbet {hsSayi > 0 && <Text style={{ color: RENK }}>(+ {hsPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(haftaSonu)} onChangeText={(t) => sadeceRakam(t, setHaftaSonu)} placeholder="0" placeholderTextColor={mutedText} />

          <Text style={[styles.etiket, { color: text }]}>Araç Nöbeti {aSayi > 0 && <Text style={{ color: RENK }}>(+ {aPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(arac)} onChangeText={(t) => sadeceRakam(t, setArac)} placeholder="0" placeholderTextColor={mutedText} />

          <View style={[styles.anlikKutu, { backgroundColor: anlikKutuBg }]}>
            <Text style={[styles.anlikYazi, { color: text }]}>Bu Ayki Toplam Hak Ediş</Text>
            <Text style={[styles.anlikRakam, { color: RENK }]}>{anlikToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</Text>
          </View>

          <TouchableOpacity style={[styles.buton, { backgroundColor: RENK }, editingId ? { backgroundColor: '#F59E0B' } : {}]} onPress={ayaKaydet}>
            <Ionicons name={editingId ? 'create' : 'save'} size={17} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.butonYazi}>{editingId ? "Değişiklikleri Güncelle" : "Bu Ayı Kaydet"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gecmisBaslikKutusu}>
          <Ionicons name="albums" size={15} color={mutedText} style={{ marginRight: 5 }} />
          <Text style={[styles.altBaslik, { color: mutedText }]}>Son 2 Ay</Text>
        </View>

        {aylikKayitlar.slice(0, 2).map((item) => (
          <TouchableOpacity key={item.id} style={[styles.kayitKarti, { backgroundColor: cardBg, borderColor: borderColor }]} onPress={() => kartTiklandi(item)}>
            <View style={[styles.kayitSeritKutu, { backgroundColor: RENK }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.kayitAy, { color: text }]}>{item.ay}</Text>
              <Text style={[styles.kayitOzet, { color: mutedText }]}>{item.ozet}</Text>
            </View>
            <Text style={[styles.kayitToplam, { color: RENK }]}>{item.toplam} TL</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 16 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroIconKutu: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroBaslik: { fontSize: 18, fontWeight: '800', color: '#fff' },
  altBaslik: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  gecmisBaslikKutusu: { flexDirection: 'row', alignItems: 'center', marginTop: 22, marginBottom: 10 },
  inputAlan: {
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  etiket: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 15, fontWeight: '600' },
  switchSatir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 4 },
  switchEtiket: { fontSize: 13, fontWeight: '500' },
  anlikKutu: { marginTop: 16, padding: 14, borderRadius: 12, alignItems: 'center' },
  anlikYazi: { fontSize: 13, fontWeight: '600' },
  anlikRakam: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  buton: { padding: 13, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 14 },
  butonYazi: { color: '#fff', fontSize: 15, fontWeight: '800' },
  kayitKarti: { padding: 12, borderRadius: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, overflow: 'hidden' },
  kayitSeritKutu: { width: 4, alignSelf: 'stretch', borderRadius: 2, marginRight: 12 },
  kayitAy: { fontSize: 15, fontWeight: '800' },
  kayitOzet: { fontSize: 11, marginTop: 2 },
  kayitToplam: { fontSize: 16, fontWeight: '800' }
});
