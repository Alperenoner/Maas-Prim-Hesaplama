import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export default function TabLayout() {
  const systemTheme = useColorScheme() === 'dark';
  const [isDark, setIsDark] = useState(systemTheme);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('seciliTema').then(savedTheme => {
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    });
  }, []);

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
        tabBarActiveTintColor: isDark ? '#4caf50' : '#28a745',
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#eeeeee',
        }
      }}>
        <Tabs.Screen name="index" options={{ title: 'Maaş', tabBarIcon: () => <Text style={{fontSize: 20}}>💰</Text> }} />
        <Tabs.Screen name="expenses" options={{ title: 'Harcamalar', tabBarIcon: () => <Text style={{fontSize: 20}}>💸</Text> }} />
        <Tabs.Screen name="explore" options={{ title: 'Hızlı', tabBarIcon: () => <Text style={{fontSize: 20}}>🧮</Text> }} />
        <Tabs.Screen name="history" options={{ title: 'Geçmiş', tabBarIcon: () => <Text style={{fontSize: 20}}>📂</Text> }} />
      </Tabs>
    </ThemeContext.Provider>
  );
}