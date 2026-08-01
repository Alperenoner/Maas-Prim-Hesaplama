import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { paraFormatla } from '../../lib/format';
import { useTheme } from '../../theme';
import { Text } from './Text';

/**
 * Tutar değiştiğinde eski değerden yenisine sayarak geçiş yapar.
 * Rakamın sıçraması yerine akması, hesabın canlı olduğunu görünür kılıyor.
 */
export function AnimatedAmount({ value, style, variant = 'display', color, kesir = 2 }) {
  const [gosterilen, setGosterilen] = useState(value ?? 0);
  const cerceve = useRef(null);
  const baslangic = useRef(value ?? 0);

  useEffect(() => {
    const hedef = Number(value) || 0;
    const bas = Number(gosterilen) || 0;

    if (Math.abs(hedef - bas) < 0.5) {
      setGosterilen(hedef);
      return undefined;
    }

    baslangic.current = bas;
    const baslangicZamani = Date.now();
    const sure = 420;

    const adim = () => {
      const t = Math.min(1, (Date.now() - baslangicZamani) / sure);
      const yumusak = 1 - Math.pow(1 - t, 3);
      setGosterilen(baslangic.current + (hedef - baslangic.current) * yumusak);
      if (t < 1) cerceve.current = requestAnimationFrame(adim);
    };

    cerceve.current = requestAnimationFrame(adim);
    return () => cerceve.current && cancelAnimationFrame(cerceve.current);
    // `gosterilen` bilerek bağımlılık dışı: her karede yeniden tetiklenmemeli.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Text variant={variant} color={color} style={[{ fontVariant: ['tabular-nums'] }, style]}>
      {paraFormatla(gosterilen, { kesir })} <Text variant={variant} color={color} style={{ opacity: 0.5 }}>TL</Text>
    </Text>
  );
}

/**
 * Öne çıkan toplam kutusu.
 *
 * Vurgu renginin DOLU hâli kullanılıyor (soluk tint değil): ekrandaki tek
 * doygun renkli blok bu, dolayısıyla göz doğrudan toplama gidiyor.
 */
export function TotalCard({ label, value, accent = 'maas', hint, right }) {
  const { radius, spacing, accent: accentler, shadow } = useTheme();
  const vurgu = accentler[accent] ?? accentler.maas;

  return (
    <View
      style={[
        {
          backgroundColor: vurgu.base,
          borderRadius: radius.lg,
          padding: spacing.xl,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          overflow: 'hidden',
        },
        shadow.accent,
        { shadowColor: vurgu.base },
      ]}
    >
      {/* Sağ üstte hafif bir ışık halkası — düz bloğu canlandırır */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -46,
          right: -26,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: vurgu.on,
          opacity: 0.1,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          variant="overline"
          color={vurgu.on}
          style={{ textTransform: 'uppercase', opacity: 0.85 }}
        >
          {label}
        </Text>
        <AnimatedAmount value={value} color={vurgu.on} style={{ marginTop: spacing.xs }} />
        {hint ? (
          <Text variant="caption" color={vurgu.on} style={{ marginTop: spacing.xs, opacity: 0.8 }}>
            {hint}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Etiket / tutar satırı — kırılım listelerinde kullanılır. */
export function AmountRow({ label, value, accent, muted = false, strong = false, icon }) {
  const { spacing, accent: accentler } = useTheme();
  const vurgu = accent ? accentler[accent] : null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs + 2,
        gap: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
        {icon}
        <Text variant={strong ? 'bodyStrong' : 'body'} tone={muted ? 'muted' : 'text'} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text
        variant={strong ? 'bodyStrong' : 'body'}
        color={vurgu?.base}
        style={{ fontVariant: ['tabular-nums'], fontWeight: strong ? '700' : '600' }}
      >
        {paraFormatla(value)} TL
      </Text>
    </View>
  );
}
