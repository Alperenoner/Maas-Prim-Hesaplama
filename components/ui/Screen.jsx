import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';

/**
 * Tüm ekranların ortak dış kabuğu: arka plan rengi, yatay dolgu,
 * klavye kaçınma ve güvenli alan boşlukları tek yerde çözülür.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = { top: false, bottom: true },
  contentStyle,
  footer,
  ...rest
}) {
  const { color, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const dolgu = {
    paddingHorizontal: padded ? spacing.lg : 0,
    paddingTop: edges.top ? insets.top + spacing.md : spacing.md,
    paddingBottom: edges.bottom ? insets.bottom + spacing.xxxl : spacing.xxxl,
  };

  const govde = scroll ? (
    <ScrollView
      style={styles.dolgusuz}
      contentContainerStyle={[dolgu, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.dolgusuz, dolgu, contentStyle]} {...rest}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.dolgusuz, { backgroundColor: color.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {govde}
      {footer ? (
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: color.surface,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: color.border,
          }}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  dolgusuz: { flex: 1 },
});
