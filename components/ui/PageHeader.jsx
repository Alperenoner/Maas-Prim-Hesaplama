import { View } from 'react-native';

import { useTheme } from '../../theme';
import { IconTile } from './Button';
import { Text } from './Text';

/**
 * Ekran başlığı.
 *
 * Önceki sürümde her ekranın tepesinde tam genişlikte renkli bir blok vardı;
 * dört sekmede dört doygun renk arka arkaya gelince arayüz gürültülü
 * görünüyordu. Artık kimlik rengi yalnızca küçük ikon kutusunda taşınıyor,
 * başlık normal metin renginde — hem daha sakin hem daha okunaklı.
 */
export function PageHeader({ title, subtitle, icon, accent = 'maas', right, style }) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.lg,
        },
        style,
      ]}
    >
      {icon ? <IconTile icon={icon} accent={accent} size={42} /> : null}

      <View style={{ flex: 1 }}>
        <Text variant="title" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" style={{ marginTop: 2 }} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right}
    </View>
  );
}

/** Liste bölümlerinin üstündeki küçük başlık. */
export function SectionLabel({ label, right, style }) {
  const { spacing } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacing.xl,
          marginBottom: spacing.md,
        },
        style,
      ]}
    >
      <Text variant="overline" tone="faint" style={{ textTransform: 'uppercase' }}>
        {label}
      </Text>
      {right}
    </View>
  );
}
