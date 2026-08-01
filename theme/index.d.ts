import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface AccentPalette {
  base: string;
  strong: string;
  tint: string;
  on: string;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  surfaceSunken: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  inverse: string;
  overlay: string;
  skeleton: string;
}

export interface ThemeStatus {
  success: string;
  successTint: string;
  danger: string;
  dangerTint: string;
  warning: string;
  warningTint: string;
  info: string;
  infoTint: string;
}

export type AccentName = 'maas' | 'harcamalar' | 'hizli' | 'gecmis';
export type ThemeChoice = 'system' | 'light' | 'dark';

export interface Theme {
  mode: 'light' | 'dark';
  isDark: boolean;
  tercih: ThemeChoice;
  hazir: boolean;
  color: ThemeColors;
  accent: Record<AccentName, AccentPalette>;
  status: ThemeStatus;
  shadow: { card: ViewStyle; raised: ViewStyle };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl', number>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl' | 'pill', number>;
  type: Record<string, object>;
  temaSec: (tercih: ThemeChoice) => Promise<void>;
  temaDegistir: () => void;
}

export declare function ThemeProvider(props: { children: ReactNode }): JSX.Element;
export declare function useTheme(): Theme;
export declare function useAccent(ad: AccentName): AccentPalette;
export declare const spacing: Theme['spacing'];
export declare const radius: Theme['radius'];
export declare const type: Theme['type'];
