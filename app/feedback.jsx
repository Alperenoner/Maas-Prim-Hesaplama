import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from '../emailjsConfig';
import { db } from '../firebaseConfig';

const RENK = '#4F46E5';

export default function FeedbackScreen() {
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [durum, setDurum] = useState(null);
  const [profil, setProfil] = useState(null);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('kullaniciProfili').then(veri => {
      if (veri) setProfil(JSON.parse(veri));
    });
  }, []);

  const otomatikYanitGonder = async (hedefProfil) => {
    if (EMAILJS_SERVICE_ID.startsWith('BURAYA')) return;
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: hedefProfil.eposta,
            isim: hedefProfil.isim,
            soyisim: hedefProfil.soyisim,
            unvan: hedefProfil.unvan,
            hitap: `${hedefProfil.isim} ${hedefProfil.unvan}`,
            mesaj: mesaj,
          },
        }),
      });
    } catch (e) {
      console.log('EmailJS gönderim hatası:', e);
    }
  };

  const gonder = async () => {
    if (!mesaj) { setDurum('bos'); return; }

    setYukleniyor(true);
    setDurum(null);
    try {
      await addDoc(collection(db, "geribildirimler"), {
        mesaj: mesaj,
        tarih: serverTimestamp(),
        durum: "Yeni",
        platform: Platform.OS,
        isim: profil?.isim || null,
        soyisim: profil?.soyisim || null,
        eposta: profil?.eposta || null,
        unvan: profil?.unvan || null,
      });

      if (profil?.eposta) {
        await otomatikYanitGonder(profil);
      }

      setMesaj('');
      setDurum('basarili');
    } catch (error) {
      setDurum('hata');
      console.log("Firebase Hatası: ", error);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, padding: 20, backgroundColor: '#f2f4f8' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: RENK, borderRadius: 16, padding: 16, marginBottom: 18 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>Geri Bildirim</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>Uygulamayı geliştirmemiz için fikirlerini paylaş</Text>
        </View>
      </View>

      <TextInput
        style={{ backgroundColor: '#fff', padding: 15, borderRadius: 14, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#e6e8ee', marginBottom: 15, fontSize: 16 }}
        multiline
        placeholder="Fikirlerinizi buraya yazın..."
        value={mesaj}
        onChangeText={setMesaj}
      />

      <TouchableOpacity
        style={{ backgroundColor: RENK, padding: 15, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
        onPress={gonder}
        disabled={yukleniyor}
      >
        {yukleniyor ? <ActivityIndicator color="#fff" style={{ marginRight: 10 }} /> : <Ionicons name="send" size={17} color="#fff" style={{ marginRight: 8 }} />}
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
          {yukleniyor ? "Gönderiliyor..." : "Gönder"}
        </Text>
      </TouchableOpacity>

      {durum === 'basarili' && (
        <Text style={{ color: '#16A34A', textAlign: 'center', marginTop: 15, fontSize: 16, fontWeight: '600' }}>
          ✓ Geri bildiriminiz alındı, teşekkürler!
        </Text>
      )}
      {durum === 'hata' && (
        <Text style={{ color: '#dc3545', textAlign: 'center', marginTop: 15, fontSize: 16, fontWeight: '600' }}>
          Gönderilirken bir sorun oluştu, tekrar deneyin.
        </Text>
      )}
      {durum === 'bos' && (
        <Text style={{ color: '#dc3545', textAlign: 'center', marginTop: 15, fontSize: 16 }}>
          Lütfen bir mesaj yazın.
        </Text>
      )}

      <TouchableOpacity style={{ marginTop: 15, alignItems: 'center' }} onPress={() => router.back()}>
        <Text style={{ color: RENK, fontSize: 16, fontWeight: '600' }}>Vazgeç ve Geri Dön</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
