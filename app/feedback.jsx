import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';

export default function FeedbackScreen() {
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [durum, setDurum] = useState(null);
  const router = useRouter();

  const gonder = async () => {
    if (!mesaj) { setDurum('bos'); return; }

    setYukleniyor(true);
    setDurum(null);
    try {
      await addDoc(collection(db, "geribildirimler"), {
        mesaj: mesaj,
        tarih: serverTimestamp(),
        durum: "Yeni",
        platform: Platform.OS
      });
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
    <KeyboardAvoidingView style={{flex: 1, padding: 20, backgroundColor: '#f5f5f5'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333'}}>Geri Bildirim</Text>
      <Text style={{marginBottom: 10, color: '#555'}}>Uygulamayı geliştirmemiz için fikirlerini paylaş:</Text>

      <TextInput
        style={{backgroundColor: '#fff', padding: 15, borderRadius: 8, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#ddd', marginBottom: 15, fontSize: 16}}
        multiline
        placeholder="Fikirlerinizi buraya yazın..."
        value={mesaj}
        onChangeText={setMesaj}
      />

      <TouchableOpacity
        style={{backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
        onPress={gonder}
        disabled={yukleniyor}
      >
        {yukleniyor ? <ActivityIndicator color="#fff" style={{marginRight: 10}} /> : null}
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
          {yukleniyor ? "Gönderiliyor..." : "Gönder"}
        </Text>
      </TouchableOpacity>

      {durum === 'basarili' && (
        <Text style={{color: '#28a745', textAlign: 'center', marginTop: 15, fontSize: 16, fontWeight: '600'}}>
          ✓ Geri bildiriminiz alındı, teşekkürler!
        </Text>
      )}
      {durum === 'hata' && (
        <Text style={{color: '#dc3545', textAlign: 'center', marginTop: 15, fontSize: 16, fontWeight: '600'}}>
          Gönderilirken bir sorun oluştu, tekrar deneyin.
        </Text>
      )}
      {durum === 'bos' && (
        <Text style={{color: '#dc3545', textAlign: 'center', marginTop: 15, fontSize: 16}}>
          Lütfen bir mesaj yazın.
        </Text>
      )}

      <TouchableOpacity style={{marginTop: 15, alignItems: 'center'}} onPress={() => router.back()}>
        <Text style={{color: '#007BFF', fontSize: 16}}>Vazgeç ve Geri Dön</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}