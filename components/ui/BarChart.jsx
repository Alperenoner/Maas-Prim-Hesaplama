import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { paraKisa } from '../../lib/format';
import { useTheme } from '../../theme';
import { Text } from './Text';

const YUKSEKLIK = 116;

function Sutun({ deger, maks, etiket, accent, secili, onPress, gecikme }) {
  const { radius, spacing, accent: accentler } = useTheme();
  const vurgu = accentler[accent] ?? accentler.gecmis;

  const oran = maks > 0 ? Math.max(0.04, deger / maks) : 0.04;
  const ilerleme = useSharedValue(0);

  useEffect(() => {
    ilerleme.value = withDelay(gecikme, withTiming(oran, { duration: 620 }));
  }, [oran, gecikme, ilerleme]);

  const stil = useAnimatedStyle(() => ({ height: `${ilerleme.value * 100}%` }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${etiket}: ${paraKisa(deger)} lira`}
      style={{ flex: 1, alignItems: 'center', gap: spacing.sm }}
    >
      <View style={{ height: YUKSEKLIK, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Animated.View
          style={[
            {
              width: '62%',
              maxWidth: 26,
              minHeight: 5,
              borderRadius: radius.sm,
              backgroundColor: secili ? vurgu.base : vurgu.tint,
              borderWidth: secili ? 0 : 1,
              borderColor: vurgu.base,
            },
            stil,
          ]}
        />
      </View>
      <Text
        variant="caption"
        tone={secili ? 'text' : 'faint'}
        numberOfLines={1}
        style={{ fontWeight: secili ? '700' : '500' }}
      >
        {etiket}
      </Text>
    </Pressable>
  );
}

/**
 * Son aylara ait toplamları gösteren sütun grafiği.
 *
 * Bir sütuna dokunulduğunda o ayın tutarı üstte yazıyla belirir —
 * her sütunun üzerine rakam basmak yerine seçim üzerinden okunur,
 * böylece küçük ekranda etiketler üst üste binmez.
 */
export function BarChart({ data = [], accent = 'gecmis', selectedId, onSelect, emptyLabel }) {
  const { spacing } = useTheme();

  if (data.length === 0) {
    return (
      <Text variant="caption" tone="faint" style={{ textAlign: 'center', paddingVertical: spacing.lg }}>
        {emptyLabel ?? 'Grafik için en az iki aylık kayıt gerekiyor.'}
      </Text>
    );
  }

  const maks = Math.max(...data.map((d) => d.deger), 1);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs }}>
      {data.map((nokta, sira) => (
        <Sutun
          key={nokta.id ?? sira}
          deger={nokta.deger}
          maks={maks}
          etiket={nokta.etiket}
          accent={accent}
          secili={selectedId ? nokta.id === selectedId : sira === data.length - 1}
          onPress={() => onSelect?.(nokta)}
          gecikme={sira * 60}
        />
      ))}
    </View>
  );
}
