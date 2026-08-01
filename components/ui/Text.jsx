import { Text as RNText } from 'react-native';

import { useTheme } from '../../theme';

/**
 * Tipografi ölçeğine bağlı metin bileşeni.
 * `variant` tipografi jetonunu, `tone` renk jetonunu seçer.
 */
export function Text({ variant = 'body', tone = 'text', color, style, children, ...rest }) {
  const { type, color: renkler } = useTheme();

  const tonRenkleri = {
    text: renkler.text,
    muted: renkler.textMuted,
    faint: renkler.textFaint,
    inverse: renkler.inverse,
  };

  return (
    <RNText
      style={[type[variant], { color: color ?? tonRenkleri[tone] ?? renkler.text }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
