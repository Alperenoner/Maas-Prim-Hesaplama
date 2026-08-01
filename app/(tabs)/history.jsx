import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  AmountRow,
  Badge,
  BarChart,
  Card,
  CardHeader,
  Divider,
  EmptyState,
  IconTile,
  PageHeader,
  Screen,
  SectionLabel,
  Text,
} from '../../components/ui';
import { ayEtiketindenYil, paraKisa } from '../../lib/format';
import { PRIM_KALEMLERI } from '../../lib/prim';
import { maasKayitlariniOku } from '../../lib/storage';
import { useTheme } from '../../theme';

const ACCENT = 'gecmis';


/**
 * Seçili ayın kalem kırılımı.
 *
 * Ayrı bir bileşen olmasının nedeni yalnızca düzen değil: React Compiler,
 * koşullu render edilen JSX içindeki `secilen.ay` gibi erişimleri memo
 * bağımlılığına çıkarıp koşuldan BAĞIMSIZ olarak çözümlüyor ve `secilen`
 * null olduğunda çalışma zamanı hatası veriyordu. Prop olarak geçirilen
 * değer bileşen içinde asla null olmadığı için bu sorun ortadan kalkıyor.
 */
function AyKirilimi({ kayit }) {
  const { spacing } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(240)} style={{ marginTop: spacing.md }}>
      <Card>
        <CardHeader
          title={kayit.ay}
          subtitle="Kalem kırılımı"
          right={<Badge label={`${paraKisa(kayit.hamToplam)} TL`} accent={ACCENT} />}
        />
        <AmountRow label="Ana maaş" value={kayit.hamMaas} muted />
        {PRIM_KALEMLERI.map((kalem) => (
          <AmountRow
            key={kalem.key}
            label={`${kalem.etiket} × ${kayit[kalem.adetAlani] ?? 0}`}
            value={kayit[kalem.paraAlani] ?? 0}
            icon={<IconTile icon={kalem.ikon} accent={ACCENT} size={26} />}
            muted={(kayit[kalem.paraAlani] ?? 0) === 0}
          />
        ))}
        <Divider />
        <AmountRow label="Toplam hak ediş" value={kayit.hamToplam} accent={ACCENT} strong />
      </Card>
    </Animated.View>
  );
}

export default function GecmisEkrani() {
  const { color, spacing, accent } = useTheme();
  const vurgu = accent[ACCENT];

  const [kayitlar, setKayitlar] = useState([]);
  const [secilenId, setSecilenId] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let iptal = false;
      maasKayitlariniOku().then((liste) => {
        if (iptal) return;
        setKayitlar(liste);
        setYukleniyor(false);
      });
      return () => {
        iptal = true;
      };
    }, [])
  );

  const buYil = new Date().getFullYear();

  const ozet = useMemo(() => {
    const buYilinKayitlari = kayitlar.filter((k) => ayEtiketindenYil(k.ay) === buYil);
    const yillikToplam = buYilinKayitlari.reduce((t, k) => t + (k.hamToplam || 0), 0);
    const yillikPrim = buYilinKayitlari.reduce((toplam, kayit) => {
      const primler = PRIM_KALEMLERI.reduce((alt, kalem) => alt + (kayit[kalem.paraAlani] || 0), 0);
      return toplam + primler;
    }, 0);

    return {
      aySayisi: buYilinKayitlari.length,
      yillikToplam,
      yillikPrim,
      ortalama: buYilinKayitlari.length > 0 ? yillikToplam / buYilinKayitlari.length : 0,
      enIyiAy:
        buYilinKayitlari
          .reduce((en, k) => ((k.hamToplam || 0) > (en?.hamToplam || 0) ? k : en), null)
          ?.ay?.split(' ')[0] ?? null,
    };
  }, [kayitlar, buYil]);

  /** Grafik en eskiden yeniye okunur; liste ise yeniden eskiye. */
  const grafikVerisi = useMemo(
    () =>
      kayitlar
        .slice(0, 6)
        .reverse()
        .map((kayit) => ({
          id: kayit.id,
          deger: kayit.hamToplam || 0,
          etiket: (kayit.ay || '').split(' ')[0].slice(0, 3),
        })),
    [kayitlar]
  );

  const secilen = kayitlar.find((k) => k.id === secilenId) ?? kayitlar[0] ?? null;

  if (!yukleniyor && kayitlar.length === 0) {
    return (
      <Screen>
        <PageHeader title="Geçmiş" subtitle="Kaydedilmiş aylar" icon="time" accent={ACCENT} />
        <Card padded={false}>
          <EmptyState
            icon="archive-outline"
            accent={ACCENT}
            title="Arşiv boş"
            description="“Maaş” sekmesinden bir ay kaydettiğinde geçmiş burada birikmeye başlar."
          />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader
        title="Geçmiş"
        subtitle={`${kayitlar.length} ay kayıtlı`}
        icon="time"
        accent={ACCENT}
      />

      {/* ---------------- Yıllık özet ---------------- */}
      <Card>
        <CardHeader
          title={`${buYil} özeti`}
          subtitle={`${ozet.aySayisi} ay kaydedildi`}
          right={
            ozet.enIyiAy ? <Badge label={`En iyi: ${ozet.enIyiAy}`} accent={ACCENT} /> : null
          }
        />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {[
            { etiket: 'Toplam kazanç', deger: ozet.yillikToplam, vurgulu: true },
            { etiket: 'Toplam prim', deger: ozet.yillikPrim },
            { etiket: 'Aylık ortalama', deger: ozet.ortalama },
          ].map((kutu) => (
            <View key={kutu.etiket} style={{ flex: 1 }}>
              <Text variant="caption" tone="faint" numberOfLines={1}>
                {kutu.etiket}
              </Text>
              <Text
                variant="subheading"
                color={kutu.vurgulu ? vurgu.base : color.text}
                style={{ marginTop: 2, fontVariant: ['tabular-nums'] }}
              >
                {paraKisa(kutu.deger)}
              </Text>
              <Text variant="caption" tone="faint">
                TL
              </Text>
            </View>
          ))}
        </View>

        {grafikVerisi.length > 1 ? (
          <>
            <Divider style={{ marginTop: spacing.lg }} />
            <View style={{ marginBottom: spacing.sm }}>
              <Text variant="label" tone="muted">
                Son {grafikVerisi.length} ay
              </Text>
              <Text variant="caption" tone="faint">
                Bir sütuna dokunarak o ayın kırılımını görebilirsin
              </Text>
            </View>
            <BarChart
              data={grafikVerisi}
              accent={ACCENT}
              selectedId={secilen?.id}
              onSelect={(nokta) => setSecilenId(nokta.id)}
            />
          </>
        ) : null}
      </Card>

      {/* ---------------- Seçili ay kırılımı ---------------- */}
      {secilen ? <AyKirilimi kayit={secilen} /> : null}

      {/* ---------------- Tüm aylar ---------------- */}
      <SectionLabel label="Tüm aylar" />

      <Card padded={false}>
        {kayitlar.map((kayit, sira) => {
          const seciliMi = kayit.id === secilen?.id;
          return (
            <View key={kayit.id}>
              {sira > 0 ? <Divider style={{ marginVertical: 0 }} /> : null}
              <Pressable
                onPress={() => setSecilenId(kayit.id)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.lg,
                  backgroundColor: pressed || seciliMi ? vurgu.tint : 'transparent',
                })}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong" color={seciliMi ? vurgu.base : color.text}>
                    {kayit.ay}
                  </Text>
                  <Text variant="caption" tone="faint" style={{ marginTop: 2 }}>
                    {kayit.ozet || 'Kalem girilmemiş'}
                  </Text>
                </View>
                <Text
                  variant="bodyStrong"
                  color={seciliMi ? vurgu.base : color.textMuted}
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {paraKisa(kayit.hamToplam)} TL
                </Text>
              </Pressable>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
