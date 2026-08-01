import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme';
import { Text } from './Text';

/** Veri yokken gösterilen açıklayıcı boş durum. */
export function EmptyState({ icon = 'file-tray-outline', title, description, action, accent = 'maas' }) {
  const { radius, spacing, accent: accentler } = useTheme();
  const vurgu = accentler[accent] ?? accentler.maas;

  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: radius.lg,
          backgroundColor: vurgu.tint,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name={icon} size={28} color={vurgu.base} />
      </View>
      <Text variant="subheading" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {description ? (
        <Text
          variant="body"
          tone="muted"
          style={{ textAlign: 'center', marginTop: spacing.sm, maxWidth: 280 }}
        >
          {description}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: spacing.lg }}>{action}</View> : null}
    </View>
  );
}

/**
 * Satır içi bildirim şeridi.
 * tone: 'info' | 'success' | 'warning' | 'danger'
 */
export function Banner({ tone = 'info', title, message, icon, style, action }) {
  const { color, radius, spacing, status } = useTheme();

  const tonlar = {
    info: { fg: status.info, bg: status.infoTint, ikon: icon ?? 'information-circle' },
    success: { fg: status.success, bg: status.successTint, ikon: icon ?? 'checkmark-circle' },
    warning: { fg: status.warning, bg: status.warningTint, ikon: icon ?? 'alert-circle' },
    danger: { fg: status.danger, bg: status.dangerTint, ikon: icon ?? 'close-circle' },
  }[tone];

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutUp.duration(160)}
      style={[
        {
          flexDirection: 'row',
          gap: spacing.md,
          backgroundColor: tonlar.bg,
          borderRadius: radius.md,
          padding: spacing.md,
          alignItems: 'flex-start',
        },
        style,
      ]}
    >
      <Ionicons name={tonlar.ikon} size={19} color={tonlar.fg} style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        {title ? (
          <Text variant="label" color={tonlar.fg}>
            {title}
          </Text>
        ) : null}
        {message ? (
          <Text variant="caption" color={color.textMuted} style={{ marginTop: title ? 3 : 0, lineHeight: 17 }}>
            {message}
          </Text>
        ) : null}
        {action ? <View style={{ marginTop: spacing.sm }}>{action}</View> : null}
      </View>
    </Animated.View>
  );
}

/** Renkli, yuvarlatılmış küçük etiket. */
export function Badge({ label, tone = 'neutral', accent, style }) {
  const { color, radius, spacing, status, accent: accentler } = useTheme();

  const vurgu = accent ? accentler[accent] : null;
  const tonlar = vurgu
    ? { fg: vurgu.base, bg: vurgu.tint }
    : {
        neutral: { fg: color.textMuted, bg: color.surfaceAlt },
        success: { fg: status.success, bg: status.successTint },
        warning: { fg: status.warning, bg: status.warningTint },
        danger: { fg: status.danger, bg: status.dangerTint },
      }[tone];

  return (
    <View
      style={[
        {
          backgroundColor: tonlar.bg,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md - 2,
          paddingVertical: 4,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text variant="caption" color={tonlar.fg} style={{ fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}

/** Yükleme sırasında düzeni koruyan iskelet blok. */
export function Skeleton({ height = 16, width = '100%', style }) {
  const { color, radius } = useTheme();
  const parlaklik = useSharedValue(0.55);

  useEffect(() => {
    parlaklik.value = withTiming(1, { duration: 900 });
  }, [parlaklik]);

  const stil = useAnimatedStyle(() => ({ opacity: parlaklik.value }));

  return (
    <Animated.View
      style={[
        { height, width, borderRadius: radius.sm, backgroundColor: color.skeleton },
        stil,
        style,
      ]}
    />
  );
}

/** Ekranın en üstünde duran ince ayraç çizgisi. */
export function HairLine({ style }) {
  const { color } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: color.border }, style]} />;
}
