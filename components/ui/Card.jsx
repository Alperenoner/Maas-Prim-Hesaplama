import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from './Text';

/** Standart yüzey kartı — kenarlık + yumuşak gölge + tutarlı yarıçap. */
export function Card({ children, style, padded = true, elevated = false, ...rest }) {
  const { color, radius, spacing, shadow } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: color.surface,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: color.border,
          padding: padded ? spacing.lg : 0,
        },
        elevated ? shadow.raised : shadow.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

/** Kart içi bölüm başlığı — isteğe bağlı sağ aksiyon alanı ile. */
export function CardHeader({ title, subtitle, right, style }) {
  const { spacing } = useTheme();
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="subheading">{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Kart içeriğini bölen ince ayraç. */
export function Divider({ style }) {
  const { color, spacing } = useTheme();
  return (
    <View
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: color.border,
          marginVertical: spacing.md,
        },
        style,
      ]}
    />
  );
}
