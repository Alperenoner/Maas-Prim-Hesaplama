import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton, Text } from '../../components/ui';
import { profilOku } from '../../lib/storage';
import { useTheme } from '../../theme';
import { TAB_ACCENTS } from '../../theme/tokens';

const SEKMELER = [
  { name: 'index', title: 'Maaş', icon: 'wallet' },
  { name: 'expenses', title: 'Harcamalar', icon: 'cart' },
  { name: 'explore', title: 'Hızlı', icon: 'flash' },
  { name: 'history', title: 'Geçmiş', icon: 'time' },
];

export default function TabLayout() {
  const { color, isDark, accent, type, temaDegistir } = useTheme();
  const [profilKontrolEdildi, setProfilKontrolEdildi] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let iptal = false;
    profilOku().then((profil) => {
      if (iptal) return;
      if (!profil?.eposta) {
        router.replace('/kayit');
      } else {
        setProfilKontrolEdildi(true);
      }
    });
    return () => {
      iptal = true;
    };
  }, [router]);

  if (!profilKontrolEdildi) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg }}>
        <ActivityIndicator size="large" color={color.textMuted} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: color.bg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: color.border,
        },
        headerTintColor: color.text,
        headerTitleStyle: { ...type.subheading, color: color.text },
        headerLeftContainerStyle: { paddingLeft: 10 },
        headerRightContainerStyle: { paddingRight: 10 },
        headerLeft: () => (
          <IconButton
            icon="chatbubble-ellipses-outline"
            accessibilityLabel="Geri bildirim gönder"
            onPress={() => router.push('/feedback')}
          />
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon={isDark ? 'sunny-outline' : 'moon-outline'}
              accessibilityLabel={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
              onPress={temaDegistir}
            />
            <IconButton
              icon="person-circle-outline"
              accessibilityLabel="Profil"
              size={24}
              onPress={() => router.push('/profil')}
            />
          </View>
        ),
        tabBarInactiveTintColor: color.textFaint,
        tabBarShowLabel: false,
        tabBarItemStyle: { paddingTop: 6, paddingBottom: 4 },
        tabBarStyle: {
          backgroundColor: color.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: color.border,
          paddingBottom: insets.bottom,
          height: 64 + insets.bottom,
          ...(Platform.OS === 'ios' ? {} : { elevation: 0 }),
        },
      }}
    >
      {SEKMELER.map((sekme) => (
        <Tabs.Screen
          key={sekme.name}
          name={sekme.name}
          options={{
            title: sekme.title,
            tabBarActiveTintColor: accent[TAB_ACCENTS[sekme.name]].base,
            // İkon ve etiket tek bir görünümde çiziliyor.
            //
            // react-navigation'ın kendi etiket kutusu, yazı tipi boyutuyla aynı
            // yükseklikte ve `overflow: hidden` olduğu için Türkçe ş/ç çengellerini
            // kesiyordu ("Maaş" → "Maas", "Geçmiş" → "Gecmis"). Etiketi kendi
            // düzenimizde çizip varsayılanı kapatarak sorun tümüyle ortadan kalkıyor.
            tabBarIcon: ({ focused, color: renk }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', width: 76 }}>
                {/* Aktif sekmenin ikonu vurgu renginde bir hap zemine oturuyor —
                    hangi sekmede olduğun tek bakışta anlaşılıyor. */}
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 3,
                    borderRadius: 999,
                    backgroundColor: focused
                      ? accent[TAB_ACCENTS[sekme.name]].tint
                      : 'transparent',
                  }}
                >
                  <Ionicons
                    name={focused ? sekme.icon : `${sekme.icon}-outline`}
                    size={22}
                    color={renk}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  color={renk}
                  style={{
                    fontSize: 11,
                    lineHeight: 15,
                    fontWeight: focused ? '700' : '600',
                    marginTop: 2,
                  }}
                >
                  {sekme.title}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
