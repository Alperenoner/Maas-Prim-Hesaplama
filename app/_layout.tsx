import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { veriGocunuCalistir } from '../lib/storage';
import { oturumuBaslat } from '../services/auth';
import { ThemeProvider, useTheme } from '../theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function Yigin() {
  const { color, isDark } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="kayit" options={{ animation: 'fade' }} />
        <Stack.Screen name="profil" />
        <Stack.Screen name="feedback" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

function Yukleniyor() {
  const { color } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg }}>
      <ActivityIndicator size="large" color={color.textMuted} />
    </View>
  );
}

function Kok() {
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    let iptal = false;

    (async () => {
      // Eski sürümden gelen yerel veriyi yeni şemaya taşı — bu yerel ve hızlı.
      await veriGocunuCalistir().catch(() => {});
      if (!iptal) setHazir(true);
    })();

    // Oturum açma ARKA PLANDA yürür. Uygulama yerel-öncelikli olduğu için
    // ağ beklenmez; kimlik doğrulaması yalnızca bulut yedeği ve geri bildirim
    // için gerekli ve o özellikler hazır olduğunda kendiliğinden etkinleşir.
    oturumuBaslat().catch((hata: any) => {
      if (__DEV__) console.warn('[auth] oturum açılamadı:', hata?.code ?? hata);
    });

    return () => {
      iptal = true;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    // Not: `setBehaviorAsync` SDK 57'de kaldırıldı. Edge-to-edge modda
    // çubuğun kaydırmayla geri gelmesi zaten sistem varsayılanı.
    NavigationBar.setVisibilityAsync('hidden').catch(() => {
      // Bazı cihazlarda desteklenmiyor — kritik değil.
    });
  }, []);

  if (!hazir) return <Yukleniyor />;
  return <Yigin />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Kok />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
