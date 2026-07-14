import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ThemeContext = createContext();

export const TAB_RENKLERI = {
  maas: '#4F46E5',
  harcamalar: '#DC2626',
  hizli: '#16A34A',
  gecmis: '#F59E0B',
};

export default function TabLayout() {
  const systemTheme = useColorScheme() === 'dark';
  const [isDark, setIsDark] = useState(systemTheme);
  const [profilKontrolEdildi, setProfilKontrolEdildi] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    AsyncStorage.getItem('seciliTema').then(savedTheme => {
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('kullaniciProfili').then(profil => {
      if (!profil) {
        router.replace('/kayit');
      } else {
        setProfilKontrolEdildi(true);
      }
    });
  }, []);

  if (!profilKontrolEdildi) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#121212' : '#f2f4f8' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const toggleTheme = async () => {
    const yeniTema = !isDark;
    setIsDark(yeniTema);
    await AsyncStorage.setItem('seciliTema', yeniTema ? 'dark' : 'light');
  };

  const TemaButonu = () => (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15, padding: 5 }}>
      <Text style={{ fontSize: 22 }}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );

  const FeedbackButonu = () => (
    <TouchableOpacity onPress={() => router.push('/feedback')} style={{ marginLeft: 15, padding: 5 }}>
      <Text style={{ fontSize: 22 }}>💬</Text>
    </TouchableOpacity>
  );

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <Tabs screenOptions={{
        headerRight: () => <TemaButonu />,
        headerLeft: () => <FeedbackButonu />,
        headerStyle: { backgroundColor: isDark ? '#121212' : '#ffffff' },
        headerTintColor: isDark ? '#ffffff' : '#000000',
        headerTitleStyle: { fontWeight: '800' },
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#eeeeee',
          height: 54 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
        }
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Maaş',
            tabBarActiveTintColor: TAB_RENKLERI.maas,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size + 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Harcamalar',
            tabBarActiveTintColor: TAB_RENKLERI.harcamalar,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size + 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Hızlı',
            tabBarActiveTintColor: TAB_RENKLERI.hizli,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'flash' : 'flash-outline'} size={size + 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Geçmiş',
            tabBarActiveTintColor: TAB_RENKLERI.gecmis,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'time' : 'time-outline'} size={size + 2} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeContext.Provider>
  );
}