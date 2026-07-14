import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { db } from '../firebaseConfig';
import { yedektenGeriYukle } from '../yedekleme';

const RENK = '#4F46E5';

export default function KayitScreen() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [eposta, setEposta] = useState('');
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const bg = isDark ? '#121212' : '#f2f4f8';
  const text = isDark ? '#ffffff' : '#1f2430';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const inputBg = isDark ? '#2c2c2c' : '#f7f8fb';
  const borderColor = isDark ? '#3a3a3a' : '#e6e8ee';
  const mutedText = isDark ? '#9aa0aa' : '#8a8f9a';

  const epostaGecerliMi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim());

  const kaydet = async () => {
    if (!isim.trim() || !soyisim.trim()) { setHata('Lütfen isim ve soyisminizi girin.'); return; }
    if (!epostaGecerliMi) { setHata('Lütfen geçerli bir e-posta adresi girin.'); return; }

    setHata('');
    setYukleniyor(true);
    const profil = { isim: isim.trim(), soyisim: soyisim.trim(), eposta: eposta.trim() };
    await AsyncStorage.setItem('kullaniciProfili', JSON.stringify(profil));

    try {
      await addDoc(collection(db, 'kullanicilar'), {
        ...profil,
        kayitTarihi: serverTimestamp(),
        platform: Platform.OS,
      });
    } catch (e) {
      console.log('Kullanıcı kaydı Firestore hatası:', e);
    }

    const yedek = await yedektenGeriYukle(profil.eposta);
    if (yedek) {
      if (yedek.maasKayitlari) await AsyncStorage.setItem('maasKayitlari', JSON.stringify(yedek.maasKayitlari));
      if (yedek.harcamaKayitlari) await AsyncStorage.setItem('harcamaKayitlari', JSON.stringify(yedek.harcamaKayitlari));
    }

    setYukleniyor(false);
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.hero, { backgroundColor: RENK }]}>
        <View style={styles.heroIconKutu}>
          <Ionicons name="person-add" size={26} color="#fff" />
        </View>
        <Text style={styles.heroBaslik}>Hoş Geldin!</Text>
        <Text style={styles.heroAlt}>Devam etmek için birkaç bilgi alalım</Text>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderColor }]}>
        <Text style={[styles.etiket, { color: text }]}>İsim</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]}
          value={isim}
          onChangeText={setIsim}
          placeholder="Örn: Alperen"
          placeholderTextColor={mutedText}
        />

        <Text style={[styles.etiket, { color: text }]}>Soyisim</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]}
          value={soyisim}
          onChangeText={setSoyisim}
          placeholder="Örn: Öner"
          placeholderTextColor={mutedText}
        />

        <Text style={[styles.etiket, { color: text }]}>E-posta</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: text, borderColor: borderColor }]}
          value={eposta}
          onChangeText={setEposta}
          placeholder="ornek@mail.com"
          placeholderTextColor={mutedText}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {hata ? <Text style={styles.hataYazisi}>{hata}</Text> : null}

        <TouchableOpacity style={[styles.buton, { backgroundColor: RENK }]} onPress={kaydet} disabled={yukleniyor}>
          {yukleniyor ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="arrow-forward-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.butonYazi}>{yukleniyor ? 'Kontrol ediliyor...' : 'Devam Et'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  hero: { borderRadius: 18, padding: 20, marginBottom: 18, alignItems: 'center' },
  heroIconKutu: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  heroBaslik: { fontSize: 22, fontWeight: '800', color: '#fff' },
  heroAlt: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  card: { borderRadius: 18, borderWidth: 1, padding: 18 },
  etiket: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  hataYazisi: { color: '#dc3545', marginTop: 12, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  buton: { marginTop: 20, padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  butonYazi: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
