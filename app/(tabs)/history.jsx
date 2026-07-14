import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from './_layout';

export default function HistoryScreen() {
  const [gecmis, setGecmis] = useState([]);
  const { isDark } = useContext(ThemeContext);

  const bg = isDark ? '#121212' : '#f5f5f5';
  const text = isDark ? '#ffffff' : '#333333';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const borderColor = isDark ? '#444444' : '#dddddd';
  const mutedText = isDark ? '#aaaaaa' : '#666666';

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('maasKayitlari').then(res => {
      if (res) setGecmis(JSON.parse(res));
    });
  }, []));

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: 10 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: text, textAlign: 'center', marginBottom: 20 }}>Tüm Geçmiş Aylar</Text>
        
        {gecmis.length === 0 && <Text style={{ color: mutedText, textAlign: 'center', fontStyle: 'italic' }}>Henüz geçmişte kaydedilmiş bir ay yok.</Text>}

        {gecmis.map((item) => (
          <View key={item.id} style={[styles.kart, { backgroundColor: cardBg, borderColor: borderColor }]}>
            <View style={styles.baslikSatiri}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: text }}>{item.ay}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#28a745' }}>{item.toplam} TL</Text>
            </View>
            
            <View style={styles.detayKutusu}>
              <Text style={{ color: text, marginBottom: 6, fontSize: 14 }}>
                <Text style={{fontWeight: 'bold'}}>Kurulum:</Text> {item.kurulumAdet || 0} İşlem <Text style={{color: '#28a745'}}>(+ {item.kurulumPara ? item.kurulumPara.toLocaleString('tr-TR') : 0} TL)</Text>
              </Text>
              <Text style={{ color: text, marginBottom: 6, fontSize: 14 }}>
                <Text style={{fontWeight: 'bold'}}>H.İçi Nöbet:</Text> {item.haftaIciAdet || 0} İşlem <Text style={{color: '#28a745'}}>(+ {item.haftaIciPara ? item.haftaIciPara.toLocaleString('tr-TR') : 0} TL)</Text>
              </Text>
              <Text style={{ color: text, marginBottom: 6, fontSize: 14 }}>
                <Text style={{fontWeight: 'bold'}}>H.Sonu Nöbet:</Text> {item.haftaSonuAdet || 0} İşlem <Text style={{color: '#28a745'}}>(+ {item.haftaSonuPara ? item.haftaSonuPara.toLocaleString('tr-TR') : 0} TL)</Text>
              </Text>
              <Text style={{ color: text, fontSize: 14 }}>
                <Text style={{fontWeight: 'bold'}}>Araç Nöbeti:</Text> {item.aracAdet || 0} İşlem <Text style={{color: '#28a745'}}>(+ {item.aracPara ? item.aracPara.toLocaleString('tr-TR') : 0} TL)</Text>
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  kart: { borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 15 },
  baslikSatiri: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#dddddd', paddingBottom: 10, marginBottom: 12 },
  detayKutusu: { paddingLeft: 5 }
});