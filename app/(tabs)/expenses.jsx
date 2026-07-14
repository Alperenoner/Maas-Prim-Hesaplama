import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { yedegeKaydet } from '../../yedekleme';
import { TAB_RENKLERI, ThemeContext } from './_layout';

const RENK = TAB_RENKLERI.harcamalar;

export default function ExpensesScreen() {
  const [gun, setGun] = useState('');
  const [isim, setIsim] = useState('');
  const [tutar, setTutar] = useState('');
  const [saat, setSaat] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [harcamalar, setHarcamalar] = useState([]);
  const [kullaniciEpostasi, setKullaniciEpostasi] = useState(null);

  const { isDark } = useContext(ThemeContext);

  const bg = isDark ? '#121212' : '#f2f4f8';
  const text = isDark ? '#ffffff' : '#1f2430';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#f7f8fb';
  const borderColor = isDark ? '#3a3a3a' : '#e6e8ee';
  const mutedText = isDark ? '#9aa0aa' : '#8a8f9a';

  const taksiMi = isim.toLowerCase().includes('taksi');
  const suAnkiAy = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  useFocusEffect(useCallback(() => { verileriYukle(); }, []));

  const verileriYukle = async () => {
    try {
      const kayitlar = await AsyncStorage.getItem('harcamaKayitlari');
      if (kayitlar !== null) setHarcamalar(JSON.parse(kayitlar));
      const profil = await AsyncStorage.getItem('kullaniciProfili');
      if (profil) setKullaniciEpostasi(JSON.parse(profil).eposta || null);
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
    yedegeKaydet(kullaniciEpostasi, { harcamaKayitlari: yeniListe });
    setIsim(''); setTutar(''); setGun(''); setSaat(new Date());
  };

  const harcamaSil = async (id) => {
    const yeniListe = harcamalar.filter(item => item.id !== id);
    setHarcamalar(yeniListe);
    yedegeKaydet(kullaniciEpostasi, { harcamaKayitlari: yeniListe });
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg, paddingTop: 10, paddingHorizontal: 16 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', backgroundColor: RENK, borderRadius: 16,
        paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
      }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Ionicons name="cart" size={20} color="#fff" />
        </View>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>Aylık Gider Takibi</Text>
      </View>

      <View style={{
        backgroundColor: cardBg, padding: 16, borderRadius: 18, marginBottom: 18,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
      }}>
        <Text style={{ color: text, marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Tarih (Sadece Gün)</Text>
        <TextInput style={{ backgroundColor: inputBg, color: text, borderWidth: 1, borderColor: borderColor, borderRadius: 10, padding: 10, marginBottom: 14, fontWeight: '600' }} value={gun} onChangeText={(t) => sadeceRakam(t, setGun)} keyboardType="numeric" maxLength={2} placeholder="Örn: 15" placeholderTextColor={mutedText} />

        <Text style={{ color: text, marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Nereye Harcadın?</Text>
        <TextInput style={{ backgroundColor: inputBg, color: text, borderWidth: 1, borderColor: borderColor, borderRadius: 10, padding: 10, marginBottom: 14, fontWeight: '600' }} value={isim} onChangeText={setIsim} placeholder="Örn: Taksi, Market, Fatura..." placeholderTextColor={mutedText} />

        <Text style={{ color: text, marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Tutar Ne Kadar? (TL)</Text>
        <TextInput style={{ backgroundColor: inputBg, color: text, borderWidth: 1, borderColor: borderColor, borderRadius: 10, padding: 10, marginBottom: 14, fontWeight: '600' }} value={tutar} onChangeText={setTutar} keyboardType="numeric" placeholder="Örn: 250" placeholderTextColor={mutedText} />

        {taksiMi && (
          <View style={{ marginBottom: 14 }}>
            <Text style={{ color: '#F59E0B', marginBottom: 5, fontWeight: '600', fontSize: 13 }}>Taksi İşlem Saati</Text>
            <TouchableOpacity style={{ backgroundColor: inputBg, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#F59E0B', flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowPicker(true)}>
              <Ionicons name="time" size={16} color="#F59E0B" style={{ marginRight: 8 }} />
              <Text style={{ color: text, fontSize: 16, fontWeight: '600' }}>{saat.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker value={saat} mode="time" is24Hour={true} display="spinner" onChange={onChangeTime} />
            )}
          </View>
        )}

        <TouchableOpacity style={{ backgroundColor: RENK, padding: 13, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={harcamaEkle}>
          <Ionicons name="add-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Harcamayı Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(aylikGruplar).length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Ionicons name="receipt-outline" size={36} color={mutedText} />
            <Text style={{ color: mutedText, textAlign: 'center', marginTop: 10 }}>Henüz bir harcama yok.</Text>
          </View>
        )}
        {Object.keys(aylikGruplar).map(ay => {
          const ayinToplami = aylikGruplar[ay].reduce((top, item) => top + item.tutar, 0);
          return (
            <View key={ay} style={{ marginBottom: 22 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: borderColor, paddingBottom: 8, marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: text, textTransform: 'uppercase', letterSpacing: 0.4 }}>{ay}</Text>
                <View style={{ backgroundColor: RENK, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>{ayinToplami.toLocaleString('tr-TR')} TL</Text>
                </View>
              </View>
              {aylikGruplar[ay].map(item => (
                <TouchableOpacity key={item.id} onPress={() => Alert.alert("Sil", `"${item.isim}" silinsin mi?`, [{ text: "Vazgeç", style: "cancel" }, { text: "Sil", style: "destructive", onPress: () => harcamaSil(item.id) }])}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cardBg, padding: 12, borderRadius: 14, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}>
                    <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: isDark ? '#3a2020' : '#fdecec', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Ionicons name="pricetag" size={16} color={RENK} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: text }}>{item.isim}</Text>
                      <Text style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>{item.tarih}</Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: RENK }}>- {item.tutar.toLocaleString('tr-TR')} TL</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
