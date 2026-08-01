import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { Text } from './Text';

/**
 * Alttan açılan aksiyon paneli — `Alert.alert` yerine kullanılır.
 * Alert seçenek sırasını platforma göre değiştirir, biçimlendirilemez ve
 * yıkıcı işlemi diğerlerinden görsel olarak ayırmaz; bu panel üçünü de çözer.
 */
export function Sheet({ visible, onClose, title, subtitle, children }) {
  const { color, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const ilerleme = useSharedValue(0);

  useEffect(() => {
    ilerleme.value = visible
      ? withSpring(1, { damping: 20, stiffness: 220, mass: 0.7 })
      : withTiming(0, { duration: 160 });
  }, [visible, ilerleme]);

  const perdeStili = useAnimatedStyle(() => ({ opacity: ilerleme.value }));
  const panelStili = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - ilerleme.value) * 380 }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: color.overlay }, perdeStili]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityLabel="Kapat"
            accessibilityRole="button"
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            {
              marginTop: 'auto',
              backgroundColor: color.surface,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: insets.bottom + spacing.lg,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: color.border,
            },
            panelStili,
          ]}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 38,
              height: 4,
              borderRadius: 2,
              backgroundColor: color.borderStrong,
              marginBottom: spacing.lg,
            }}
          />

          {title ? (
            <View style={{ marginBottom: spacing.md }}>
              <Text variant="heading">{title}</Text>
              {subtitle ? (
                <Text variant="caption" tone="muted" style={{ marginTop: 3 }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

/** Panel içindeki tek aksiyon satırı. */
export function SheetAction({ icon, label, hint, onPress, tone = 'default' }) {
  const { color, radius, spacing, status } = useTheme();

  const tonlar = {
    default: { fg: color.text, ikon: color.textMuted, bg: color.surfaceAlt },
    danger: { fg: status.danger, ikon: status.danger, bg: status.dangerTint },
  }[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        backgroundColor: pressed ? tonlar.bg : 'transparent',
      })}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: radius.sm,
          backgroundColor: tonlar.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={17} color={tonlar.ikon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong" color={tonlar.fg}>
          {label}
        </Text>
        {hint ? (
          <Text variant="caption" tone="faint" style={{ marginTop: 1 }}>
            {hint}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
