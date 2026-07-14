import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TAB_RENKLERI, ThemeContext } from './_layout';

const RENK = TAB_RENKLERI.gecmis;

const DETAY_SATIRLARI = [
  { adetKey: 'kurulumAdet', paraKey: 'kurulumPara', label: 'Kurulum', icon: 'construct' },
  { adetKey: 'haftaIciAdet', paraKey: 'haftaIciPara', label: 'H.İçi Nöbet', icon: 'briefcase' },
  { adetKey: 'haftaSonuAdet', paraKey: 'haftaSonuPara', label: 'H.Sonu Nöbet', icon: 'calendar' },
  { adetKey: 'aracAdet', paraKey: 'aracPara', label: 'Araç Nöbeti', icon: 'car-sport' },
];

export default function HistoryScreen() {
  const [gecmis, setGecmis] = useState([]);
  const { isDark } = useContext(ThemeContext);

  const bg = isDark ? '#121212' : '#f2f4f8';
  const text = isDark ? '#ffffff' : '#1f2430';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const borderColor = isDark ? '#3a3a3a' : '#e6e8ee';
  const mutedText = isDark ? '#9aa0aa' : '#8a8f9a';

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('maasKayitlari').then(res => {
      if (res) setGecmis(JSON.parse(res));
    });
  }, []));

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: 10, paddingHorizontal: 16 }}>
      <View style={[styles.hero, { backgroundColor: RENK }]}>
        <View style={styles.heroIconKutu}>
          <Ionicons name="time" size={22} color="#fff" />
        </View>
        <Text style={styles.heroBaslik}>Tüm Geçmiş Aylar</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {gecmis.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Ionicons name="archive-outline" size={36} color={mutedText} />
            <Text style={{ color: mutedText, textAlign: 'center', fontStyle: 'italic', marginTop: 10 }}>Henüz geçmişte kaydedilmiş bir ay yok.</Text>
          </View>
        )}

        {gecmis.map((item) => (
          <View key={item.id} style={[styles.kart, { backgroundColor: cardBg, borderColor: borderColor }]}>
            <View style={styles.baslikSatiri}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: text }}>{item.ay}</Text>
              <View style={{ backgroundColor: RENK, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>{item.toplam} TL</Text>
              </View>
            </View>

            <View style={styles.detayKutusu}>
              {DETAY_SATIRLARI.map(({ adetKey, paraKey, label, icon }) => (
                <View key={label} style={styles.detaySatir}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons name={icon} size={14} color={RENK} style={{ marginRight: 7 }} />
                    <Text style={{ color: mutedText, fontSize: 13, fontWeight: '600' }}>{label}</Text>
                  </View>
                  <Text style={{ color: text, fontSize: 13, fontWeight: '700' }}>
                    {item[adetKey] || 0} İşlem <Text style={{ color: RENK }}>(+{item[paraKey] ? item[paraKey].toLocaleString('tr-TR') : 0} TL)</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  kart: {
    borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  baslikSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.25)', paddingBottom: 10, marginBottom: 10 },
  detayKutusu: { gap: 8 },
  detaySatir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
