import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from './_layout';

export default function ExpensesScreen() {
  const [gun, setGun] = useState('');
  const [isim, setIsim] = useState('');
  const [tutar, setTutar] = useState('');
  const [saat, setSaat] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [harcamalar, setHarcamalar] = useState([]);
  
  const { isDark } = useContext(ThemeContext);

  const bg = isDark ? '#121212' : '#f5f5f5';
  const text = isDark ? '#ffffff' : '#333333';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#fafafa';
  const borderColor = isDark ? '#444444' : '#dddddd';

  const taksiMi = isim.toLowerCase().includes('taksi');
  const suAnkiAy = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  useFocusEffect(useCallback(() => { verileriYukle(); }, []));

  const verileriYukle = async () => {
    try {
      const kayitlar = await AsyncStorage.getItem('harcamaKayitlari');
      if (kayitlar !== null) setHarcamalar(JSON.parse(kayitlar));
    } catch (e) { console.log(e); }
  };

  const sadeceRakam = (t, setter) => setter(t.replace(/[^0-9]/g, ''));

  const harcamaEkle = async () => {
    if (!gun || !isim || !tutar) { Alert.alert("Hata", "Gün, ad ve tutar girmelisin kankam."); return; }
    if (parseInt(gun) < 1 || parseInt(gun) > 31) { Alert.alert("Hata", "Lütfen ayın gününü 1 ile 31 arasında gir."); return; }
    
    const secilenSaat = saat.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const tamTarih = `${gun} ${suAnkiAy}`;
    const gosterilecekIsim = taksiMi ? `${isim} (Saat: ${secilenSaat})` : isim;

    const yeniKayıt = { id: Math.random().toString(), ay: suAnkiAy, isim: gosterilecekIsim, tutar: parseFloat(tutar.replace(',', '.')), tarih: tamTarih };

    const yeniListe = [yeniKayıt, ...harcamalar];
    setHarcamalar(yeniListe);
    await AsyncStorage.setItem('harcamaKayitlari', JSON.stringify(yeniListe));
    setIsim(''); setTutar(''); setGun(''); setSaat(new Date());
  };

  const harcamaSil = async (id) => {
    const yeniListe = harcamalar.filter(item => item.id !== id);
    setHarcamalar(yeniListe);
    await AsyncStorage.setItem('harcamaKayitlari', JSON.stringify(yeniListe));
  };

  const onChangeTime = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setSaat(selectedDate);
  };

  const aylikGruplar = harcamalar.reduce((grup, item) => {
    if (!grup[item.ay]) grup[item.ay] = [];
    grup[item.ay].push(item);
    return grup;
  }, {});

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg, paddingTop: 10, paddingHorizontal: 20 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: text }}>Aylık Gider Takibi</Text>
      
      <View style={{ backgroundColor: cardBg, padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: borderColor }}>
        <Text style={{ color: text, marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Tarih (Sadece Gün):</Text>
        <TextInput style={{ backgroundColor: inputBg, color: text, borderWidth: 1, borderColor: borderColor, borderRadius: 8, padding: 10, marginBottom: 15 }} value={gun} onChangeText={(t) => sadeceRakam(t, setGun)} keyboardType="numeric" maxLength={2} placeholder="Örn: 15" placeholderTextColor="#888" />
        
        <Text style={{ color: text, marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Nereye Harcadın?</Text>
        <TextInput style={{ backgroundColor: inputBg, color: text, borderWidth: 1, borderColor: borderColor, borderRadius: 8, padding: 10, marginBottom: 15 }} value={isim} onChangeText={setIsim} placeholder="Örn: Taksi, Market, Fatura..." placeholderTextColor="#888" />
        
        <Text style={{ color: text, marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Tutar Ne Kadar? (TL)</Text>
        <TextInput style={{ backgroundColor: inputBg, color: text, borderWidth: 1, borderColor: borderColor, borderRadius: 8, padding: 10, marginBottom: 15 }} value={tutar} onChangeText={setTutar} keyboardType="numeric" placeholder="Örn: 250" placeholderTextColor="#888" />
        
        {taksiMi && (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: '#ffc107', marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Taksi İşlem Saati:</Text>
            <TouchableOpacity style={{ backgroundColor: inputBg, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ffc107' }} onPress={() => setShowPicker(true)}>
              <Text style={{ color: text, fontSize: 16 }}>{saat.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            
            {showPicker && (
              <DateTimePicker value={saat} mode="time" is24Hour={true} display="spinner" onChange={onChangeTime} />
            )}
          </View>
        )}

        <TouchableOpacity style={{ backgroundColor: '#dc3545', padding: 12, borderRadius: 8, alignItems: 'center' }} onPress={harcamaEkle}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Harcamayı Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(aylikGruplar).length === 0 && <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>Henüz bir harcama yok.</Text>}
        {Object.keys(aylikGruplar).map(ay => {
          const ayinToplami = aylikGruplar[ay].reduce((top, item) => top + item.tutar, 0);
          return (
            <View key={ay} style={{ marginBottom: 25 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: borderColor, paddingBottom: 5, marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: text }}>{ay} Giderleri</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc3545' }}>Top: {ayinToplami.toLocaleString('tr-TR')} TL</Text>
              </View>
              {aylikGruplar[ay].map(item => (
                <TouchableOpacity key={item.id} onPress={() => Alert.alert("Sil", `"${item.isim}" silinsin mi?`, [{ text: "Vazgeç", style: "cancel" }, { text: "Sil", style: "destructive", onPress: () => harcamaSil(item.id) }])}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: cardBg, padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: borderColor }}>
                    <View><Text style={{ fontSize: 14, fontWeight: 'bold', color: text }}>{item.isim}</Text><Text style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{item.tarih}</Text></View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#dc3545' }}>- {item.tutar.toLocaleString('tr-TR')} TL</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        <View style={{height: 40}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}