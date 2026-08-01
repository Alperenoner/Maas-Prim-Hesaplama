import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  AmountRow,
  Button,
  Card,
  CardHeader,
  Divider,
  Field,
  IconTile,
  PageHeader,
  Screen,
  Text,
  TotalCard,
} from '../../components/ui';
import { paraKisa, rakamFormatla, sadeceRakam } from '../../lib/format';
import { PRIM_KALEMLERI, primHesapla } from '../../lib/prim';
import { useTheme } from '../../theme';

const ACCENT = 'hizli';
const BOS = { kurulum: '', haftaIci: '', haftaSonu: '', arac: '' };

/** Tek dokunuşla senaryo kuran hazır şablonlar. */
const SENARYOLAR = [
  { etiket: 'Sakin ay', adetler: { kurulum: '4', haftaIci: '2', haftaSonu: '1', arac: '1' } },
  { etiket: 'Ortalama', adetler: { kurulum: '8', haftaIci: '4', haftaSonu: '3', arac: '2' } },
  { etiket: 'Yoğun ay', adetler: { kurulum: '14', haftaIci: '8', haftaSonu: '6', arac: '4' } },
];

export default function HizliEkrani() {
  const { color, spacing, radius, accent } = useTheme();
  const vurgu = accent[ACCENT];

  const [maas, setMaas] = useState('');
  const [adetler, setAdetler] = useState(BOS);

  const hesap = useMemo(() => primHesapla(maas, adetler), [maas, adetler]);
  const primOrani = hesap.toplam > 0 ? hesap.primToplam / hesap.toplam : 0;

  const adetDegistir = (anahtar, deger) =>
    setAdetler((onceki) => ({ ...onceki, [anahtar]: sadeceRakam(deger) }));

  return (
    <Screen>
      <PageHeader
        title="Hızlı hesap"
        subtitle="Kaydetmeden dener — “ya şu kadar nöbet tutsam?”"
        icon="flash"
        accent={ACCENT}
      />

      <Card>
        <Field
          label="Maaş tutarı"
          value={rakamFormatla(maas)}
          onChangeText={(metin) => setMaas(sadeceRakam(metin))}
          keyboardType="number-pad"
          placeholder="Örn: 30.000"
          accent={ACCENT}
          ikon="cash-outline"
          sonEk="TL"
          style={{ marginBottom: spacing.md }}
        />

        <Text variant="label" tone="muted" style={{ marginBottom: spacing.sm }}>
          Hazır senaryolar
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {SENARYOLAR.map((senaryo) => {
            const seciliMi = PRIM_KALEMLERI.every(
              (kalem) => (adetler[kalem.key] || '0') === senaryo.adetler[kalem.key]
            );
            return (
              <Pressable
                key={senaryo.etiket}
                onPress={() => setAdetler(senaryo.adetler)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: spacing.sm + 2,
                  borderRadius: radius.md,
                  backgroundColor: seciliMi ? vurgu.base : color.surfaceAlt,
                }}
              >
                <Text
                  variant="caption"
                  color={seciliMi ? vurgu.on : color.textMuted}
                  style={{ fontWeight: '700' }}
                >
                  {senaryo.etiket}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <CardHeader title="Adetler" />

        {PRIM_KALEMLERI.map((kalem, sira) => (
          <View
            key={kalem.key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              paddingVertical: spacing.sm,
              borderTopWidth: sira > 0 ? 0 : 0,
            }}
          >
            <IconTile icon={kalem.ikon} accent={ACCENT} size={32} />
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{kalem.etiket}</Text>
              <Text variant="caption" tone="faint">
                %{(hesap.kalemler[sira].oran * 100).toLocaleString('tr-TR')}
                {hesap.anaMaas > 0 ? ` · ${paraKisa(hesap.kalemler[sira].birim)} TL` : ''}
              </Text>
            </View>
            <Field
              value={adetler[kalem.key]}
              onChangeText={(deger) => adetDegistir(kalem.key, deger)}
              keyboardType="number-pad"
              placeholder="0"
              accent={ACCENT}
              style={{ width: 78, marginBottom: 0 }}
              inputStyle={{ textAlign: 'center', fontVariant: ['tabular-nums'] }}
            />
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <CardHeader title="Kırılım" />
        {hesap.kalemler.map((satir) => (
          <AmountRow
            key={satir.key}
            label={`${satir.etiket}${satir.adet > 0 ? ` × ${satir.adet}` : ''}`}
            value={satir.tutar}
            muted={satir.tutar === 0}
          />
        ))}
        <Divider />
        <AmountRow label="Ana maaş" value={hesap.anaMaas} strong />
        <AmountRow label="Toplam prim" value={hesap.primToplam} accent={ACCENT} strong />
      </Card>

      <View style={{ marginTop: spacing.md }}>
        <TotalCard
          label="Genel toplam"
          value={hesap.toplam}
          accent={ACCENT}
          hint={
            hesap.primToplam > 0
              ? `Toplamın %${(primOrani * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} kadarı prim`
              : 'Maaş ve adetleri girerek senaryonu kur'
          }
        />
      </View>

      <Button
        label="Alanları temizle"
        variant="ghost"
        icon="refresh-outline"
        onPress={() => {
          setMaas('');
          setAdetler(BOS);
        }}
        style={{ marginTop: spacing.md }}
      />

      <Text variant="caption" tone="faint" style={{ textAlign: 'center', marginTop: spacing.md }}>
        Bu ekran hiçbir şey kaydetmez. Kalıcı kayıt için “Maaş” sekmesini kullanın.
      </Text>
    </Screen>
  );
}
