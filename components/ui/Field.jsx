import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from './Text';

/**
 * Etiketli metin girdisi.
 * Odaklandığında kenarlık vurgu rengine geçer; hata ve yardım metinleri
 * alanın altında sabit yükseklikte durur, böylece düzen zıplamaz.
 */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  hata,
  ipucu,
  sonEk,
  accent = 'maas',
  ikon,
  style,
  inputStyle,
  ...rest
}) {
  const { color, radius, spacing, type, accent: accentler, status } = useTheme();
  const [odakli, setOdakli] = useState(false);
  const vurgu = accentler[accent] ?? accentler.maas;

  const kenarlik = hata ? status.danger : odakli ? vurgu.base : color.border;

  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      {label ? (
        <Text variant="label" tone="muted" style={{ marginBottom: spacing.xs + 2 }}>
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: color.surfaceAlt,
          borderRadius: radius.md,
          borderWidth: odakli || hata ? 1.5 : StyleSheet.hairlineWidth,
          borderColor: kenarlik,
          paddingHorizontal: spacing.md,
        }}
      >
        {ikon ? (
          <Ionicons
            name={ikon}
            size={17}
            color={odakli ? vurgu.base : color.textFaint}
            style={{ marginRight: spacing.sm }}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.textFaint}
          onFocus={() => setOdakli(true)}
          onBlur={() => setOdakli(false)}
          style={[
            {
              flex: 1,
              paddingVertical: 13,
              color: color.text,
              ...type.bodyStrong,
            },
            inputStyle,
          ]}
          {...rest}
        />

        {sonEk ? (
          <Text variant="label" tone="faint" style={{ marginLeft: spacing.sm }}>
            {sonEk}
          </Text>
        ) : null}
      </View>

      {hata || ipucu ? (
        <Text
          variant="caption"
          color={hata ? status.danger : color.textFaint}
          style={{ marginTop: spacing.xs + 2 }}
        >
          {hata || ipucu}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Sayısal adet girdisi — artı/eksi düğmeleriyle.
 * Klavye açmadan hızlı giriş sağlar; saha kullanımında asıl senaryo bu.
 */
export function Stepper({ label, ikon, value, onChange, accent = 'maas', yardim, max = 999 }) {
  const { color, radius, spacing, accent: accentler } = useTheme();
  const vurgu = accentler[accent] ?? accentler.maas;
  const sayi = Number(value) || 0;

  const degistir = (fark) => {
    const yeni = Math.min(max, Math.max(0, sayi + fark));
    if (yeni === sayi) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
    onChange(String(yeni));
  };

  const AdetButonu = ({ yon }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${yon > 0 ? 'artır' : 'azalt'}`}
      onPress={() => degistir(yon)}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 34,
        height: 34,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? vurgu.tint : color.surfaceAlt,
        opacity: yon < 0 && sayi === 0 ? 0.4 : 1,
      })}
    >
      <Ionicons name={yon > 0 ? 'add' : 'remove'} size={18} color={vurgu.base} />
    </Pressable>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        gap: spacing.md,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.sm,
          backgroundColor: sayi > 0 ? vurgu.tint : color.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={ikon} size={16} color={sayi > 0 ? vurgu.base : color.textFaint} />
      </View>

      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong">{label}</Text>
        {yardim ? (
          <Text variant="caption" tone="faint" style={{ marginTop: 1 }}>
            {yardim}
          </Text>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <AdetButonu yon={-1} />
        <TextInput
          value={sayi === 0 ? '' : String(sayi)}
          onChangeText={(metin) => onChange(metin.replace(/\D/g, ''))}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={color.textFaint}
          accessibilityLabel={`${label} adedi`}
          style={{
            width: 46,
            textAlign: 'center',
            paddingVertical: 7,
            borderRadius: radius.sm,
            backgroundColor: color.surfaceAlt,
            color: color.text,
            fontSize: 15,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}
        />
        <AdetButonu yon={1} />
      </View>
    </View>
  );
}
