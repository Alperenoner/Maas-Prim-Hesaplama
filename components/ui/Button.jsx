import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '../../theme';
import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Basma geri bildirimi (ölçek + dokunsal titreşim) olan birincil buton.
 *
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size:    'md' | 'lg'
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  accent,
  icon,
  iconAfter,
  loading = false,
  disabled = false,
  full = true,
  style,
}) {
  const { color, radius, spacing, accent: accentler, status } = useTheme();
  const olcek = useSharedValue(1);

  const vurgu = accentler[accent] ?? accentler.maas;
  const pasif = disabled || loading;

  const stiller = {
    primary: { bg: vurgu.base, fg: vurgu.on, border: 'transparent' },
    secondary: { bg: vurgu.tint, fg: vurgu.base, border: 'transparent' },
    ghost: { bg: 'transparent', fg: color.textMuted, border: color.border },
    danger: { bg: status.dangerTint, fg: status.danger, border: 'transparent' },
  }[variant];

  const boyut = size === 'lg'
    ? { paddingVertical: 14, minHeight: 50, fontSize: 15 }
    : { paddingVertical: 10, minHeight: 40, fontSize: 14 };

  const animasyon = useAnimatedStyle(() => ({ transform: [{ scale: olcek.value }] }));

  const basildi = () => {
    olcek.value = withSpring(0.97, { damping: 18, stiffness: 320 });
  };
  const birakildi = () => {
    olcek.value = withSpring(1, { damping: 15, stiffness: 260 });
  };

  const tiklandi = (olay) => {
    if (pasif) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.(olay);
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: pasif, busy: loading }}
      accessibilityLabel={label}
      onPress={tiklandi}
      onPressIn={basildi}
      onPressOut={birakildi}
      disabled={pasif}
      style={[
        {
          backgroundColor: stiller.bg,
          borderColor: stiller.border,
          borderWidth: variant === 'ghost' ? StyleSheet.hairlineWidth : 0,
          borderRadius: radius.md,
          paddingVertical: boyut.paddingVertical,
          paddingHorizontal: spacing.lg,
          minHeight: boyut.minHeight,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
          alignSelf: full ? 'stretch' : 'flex-start',
          opacity: pasif ? 0.55 : 1,
        },
        animasyon,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={stiller.fg} />
      ) : icon ? (
        <Ionicons name={icon} size={boyut.fontSize + 3} color={stiller.fg} />
      ) : null}

      <Text
        variant="bodyStrong"
        color={stiller.fg}
        style={{ fontSize: boyut.fontSize, fontWeight: '700' }}
        numberOfLines={1}
      >
        {label}
      </Text>

      {iconAfter && !loading ? (
        <Ionicons name={iconAfter} size={boyut.fontSize + 3} color={stiller.fg} />
      ) : null}
    </AnimatedPressable>
  );
}

/** İkon-yalnız yuvarlak buton (başlık çubuğu aksiyonları için). */
export function IconButton({ icon, onPress, accessibilityLabel, tone = 'muted', size = 22, style }) {
  const { color, radius, spacing } = useTheme();
  const tonlar = { muted: color.textMuted, text: color.text };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={(olay) => {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync().catch(() => {});
        }
        onPress?.(olay);
      }}
      style={({ pressed }) => [
        {
          width: 38,
          height: 38,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: spacing.xs / 2,
          backgroundColor: pressed ? color.surfaceAlt : 'transparent',
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={tonlar[tone] ?? color.textMuted} />
    </Pressable>
  );
}

/**
 * Vurgu renginde yuvarlatılmış ikon kutusu — başlıklarda kimlik taşır.
 * `filled` ile dolu vurgu rengi + beyaz ikon kullanılır (daha güçlü vurgu).
 */
export function IconTile({ icon, accent, size = 40, filled = false, style }) {
  const { accent: accentler, radius, shadow } = useTheme();
  const vurgu = accentler[accent] ?? accentler.maas;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          backgroundColor: filled ? vurgu.base : vurgu.tint,
          alignItems: 'center',
          justifyContent: 'center',
        },
        filled ? [shadow.accent, { shadowColor: vurgu.base }] : null,
        style,
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={filled ? vurgu.on : vurgu.base} />
    </View>
  );
}
