import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from './_layout';

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

  const bg = isDark ? '#121212' : '#f5f5f5';
  const text = isDark ? '#ffffff' : '#333333';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#fafafa';
  const borderColor = isDark ? '#444444' : '#dddddd';
  const mutedText = isDark ? '#aaaaaa' : '#666666';
  const anlikKutuBg = isDark ? '#2c2c2c' : '#e9ecef';

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
    
    // GÖREV 3: Aynı aya yeni giriş engeli
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
        <Text style={[styles.baslik, { color: text }]}>Maaş Takip Sistemi</Text>
        
        <View style={[styles.inputAlan, { backgroundColor: cardBg, borderColor: borderColor, borderWidth: 1 }]}>
          <Text style={[styles.etiket, { color: text }]}>Ana Maaş Tutarı:</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(maas)} onChangeText={(t) => sadeceRakam(t, setMaas)} placeholder="Örn: 30.000" placeholderTextColor={mutedText} />
          
          <View style={styles.switchSatir}>
            <Text style={[styles.switchEtiket, { color: mutedText }]}>Maaşımı Hatırla</Text>
            <Switch value={hatirla} onValueChange={hatirlaDegistir} trackColor={{ true: '#28a745', false: '#767577' }} />
          </View>

          {/* GÖREV 2: Label yanlarında dinamik tutarlar */}
          <Text style={[styles.etiket, { color: text }]}>Kurulum Sayısı: {kSayi > 0 && <Text style={{color:'#28a745'}}>(+ {kPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(kurulum)} onChangeText={(t) => sadeceRakam(t, setKurulum)} placeholder="0" placeholderTextColor={mutedText} />
          
          <Text style={[styles.etiket, { color: text }]}>Hafta İçi Nöbet: {hiSayi > 0 && <Text style={{color:'#28a745'}}>(+ {hiPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(haftaIci)} onChangeText={(t) => sadeceRakam(t, setHaftaIci)} placeholder="0" placeholderTextColor={mutedText} />
          
          <Text style={[styles.etiket, { color: text }]}>Hafta Sonu Nöbet: {hsSayi > 0 && <Text style={{color:'#28a745'}}>(+ {hsPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(haftaSonu)} onChangeText={(t) => sadeceRakam(t, setHaftaSonu)} placeholder="0" placeholderTextColor={mutedText} />
          
          <Text style={[styles.etiket, { color: text }]}>Araç Nöbeti: {aSayi > 0 && <Text style={{color:'#28a745'}}>(+ {aPara.toLocaleString('tr-TR')} TL)</Text>}</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]} keyboardType="numeric" value={sayiyiFormatla(arac)} onChangeText={(t) => sadeceRakam(t, setArac)} placeholder="0" placeholderTextColor={mutedText} />

          <View style={[styles.anlikKutu, { backgroundColor: anlikKutuBg }]}>
            <Text style={[styles.anlikYazi, { color: text }]}>Bu Ayki Toplam Hak Ediş:</Text>
            <Text style={styles.anlikRakam}>{anlikToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</Text>
          </View>
          
          <TouchableOpacity style={[styles.buton, editingId ? { backgroundColor: isDark ? '#ffca28' : '#ffc107' } : {}]} onPress={ayaKaydet}>
            <Text style={[styles.butonYazi, editingId ? { color: '#000' } : {}]}>{editingId ? "Değişiklikleri Güncelle" : "Bu Ayı Kaydet"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gecmisBaslikKutusu}>
          <Text style={[styles.altBaslik, { color: text }]}>Son 2 Ay</Text>
        </View>
        
        {aylikKayitlar.slice(0, 2).map((item) => (
          <TouchableOpacity key={item.id} style={[styles.kayitKarti, { backgroundColor: cardBg, borderColor: borderColor }]} onPress={() => kartTiklandi(item)}>
            <View><Text style={[styles.kayitAy, { color: text }]}>{item.ay}</Text><Text style={[styles.kayitOzet, { color: mutedText }]}>{item.ozet}</Text></View>
            <Text style={styles.kayitToplam}>{item.toplam} TL</Text>
          </TouchableOpacity>
        ))}
        <View style={{height: 40}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 20 },
  baslik: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  altBaslik: { fontSize: 14, fontWeight: 'bold', fontStyle: 'italic' },
  gecmisBaslikKutusu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 10 },
  inputAlan: { padding: 15, borderRadius: 10 },
  etiket: { fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 3 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 15 },
  switchSatir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 5 },
  switchEtiket: { fontSize: 13, fontWeight: '500' },
  anlikKutu: { marginTop: 15, padding: 12, borderRadius: 8, alignItems: 'center' },
  anlikYazi: { fontSize: 13, fontWeight: '600' },
  anlikRakam: { fontSize: 22, fontWeight: 'bold', color: '#28a745', marginTop: 3 },
  buton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  butonYazi: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  kayitKarti: { padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  kayitAy: { fontSize: 15, fontWeight: 'bold' },
  kayitOzet: { fontSize: 11, marginTop: 2 },
  kayitToplam: { fontSize: 16, fontWeight: 'bold', color: '#28a745' }
});