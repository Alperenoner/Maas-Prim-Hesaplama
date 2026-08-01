import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { STORAGE_KEYS } from '../lib/storage';
import { darkTheme, lightTheme, radius, spacing, type } from './tokens';

const ThemeContext = createContext(null);

/** 'system' | 'light' | 'dark' */
const TERCIHLER = ['system', 'light', 'dark'];

export function ThemeProvider({ children }) {
  const sistemTemasi = useColorScheme();
  const [tercih, setTercih] = useState('system');
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.tema)
      .then((kayitli) => {
        if (kayitli && TERCIHLER.includes(kayitli)) setTercih(kayitli);
      })
      .finally(() => setHazir(true));
  }, []);

  const mod = tercih === 'system' ? (sistemTemasi === 'dark' ? 'dark' : 'light') : tercih;

  const temaSec = useCallback(async (yeni) => {
    if (!TERCIHLER.includes(yeni)) return;
    setTercih(yeni);
    await AsyncStorage.setItem(STORAGE_KEYS.tema, yeni);
  }, []);

  const temaDegistir = useCallback(() => {
    temaSec(mod === 'dark' ? 'light' : 'dark');
  }, [mod, temaSec]);

  const deger = useMemo(() => {
    const tema = mod === 'dark' ? darkTheme : lightTheme;
    return {
      ...tema,
      isDark: mod === 'dark',
      tercih,
      hazir,
      temaSec,
      temaDegistir,
      spacing,
      radius,
      type,
    };
  }, [mod, tercih, hazir, temaSec, temaDegistir]);

  return <ThemeContext.Provider value={deger}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme, ThemeProvider içinde kullanılmalıdır.');
  return ctx;
}

/** Belirli bir sekmenin vurgu paletini döndürür. */
export function useAccent(ad) {
  const { accent } = useTheme();
  return accent[ad] ?? accent.maas;
}

export { radius, spacing, type };
