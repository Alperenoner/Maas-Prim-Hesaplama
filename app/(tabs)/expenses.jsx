import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import {
  Badge,
  Banner,
  Button,
  Card,
  CardHeader,
  Divider,
  EmptyState,
  Field,
  PageHeader,
  Screen,
  Sheet,
  SheetAction,
  Text,
} from '../../components/ui';
import {
  ayEtiketi,
  ayEtiketiSirasi,
  ondalikCevir,
  paraFormatla,
  paraKisa,
  saatEtiketi,
  sadeceRakam,
} from '../../lib/format';
import { yeniId } from '../../lib/ids';
import { harcamalariOku, harcamalariYaz } from '../../lib/storage';
import { yedegeYaz } from '../../services/backup';
import { useTheme } from '../../theme';

const ACCENT = 'harcamalar';

/** Açıklamada geçtiğinde saat sorulan anahtar kelimeler. */
const SAAT_GEREKTIREN = ['taksi', 'uber', 'servis'];

export default function HarcamalarEkrani() {
  const { color, spacing, accent, radius } = useTheme();
  const vurgu = accent[ACCENT];

  const [gun, setGun] = useState('');
  const [isim, setIsim] = useState('');
  const [tutar, setTutar] = useState('');
  const [saat, setSaat] = useState(new Date());
  const [saatSecici, setSaatSecici] = useState(false);
  const [harcamalar, setHarcamalar] = useState([]);
  const [secilen, setSecilen] = useState(null);
  const [hatalar, setHatalar] = useState({});
  const [durum, setDurum] = useState(null);

  const buAy = ayEtiketi();
  const saatIster = SAAT_GEREKTIREN.some((kelime) =>
    isim.toLocaleLowerCase('tr-TR').includes(kelime)
  );

  useFocusEffect(
    useCallback(() => {
      let iptal = false;
      harcamalariOku().then((liste) => {
        if (!iptal) setHarcamalar(liste);
      });
      return () => {
        iptal = true;
      };
    }, [])
  );

  /** Aylar takvim sırasına göre, ay içindeki kayıtlar güne göre sıralanır. */
  const aylikGruplar = useMemo(() => {
    const harita = new Map();
    harcamalar.forEach((kayit) => {
      if (!harita.has(kayit.ay)) harita.set(kayit.ay, []);
      harita.get(kayit.ay).push(kayit);
    });

    return Array.from(harita.entries())
      .map(([ay, kayitlar]) => ({
        ay,
        kayitlar: [...kayitlar].sort((a, b) => (b.gun ?? 0) - (a.gun ?? 0)),
        toplam: kayitlar.reduce((t, k) => t + k.tutar, 0),
      }))
      .sort((a, b) => (ayEtiketiSirasi(b.ay) ?? -1) - (ayEtiketiSirasi(a.ay) ?? -1));
  }, [harcamalar]);

  const buAyinToplami = aylikGruplar.find((grup) => grup.ay === buAy)?.toplam ?? 0;

  const dogrula = () => {
    const yeni = {};
    const gunSayi = Number(gun);
    if (!gun) yeni.gun = 'Gerekli';
    else if (gunSayi < 1 || gunSayi > 31) yeni.gun = '1–31';
    if (!isim.trim()) yeni.isim = 'Harcamanın adını yazın.';
    if (ondalikCevir(tutar) <= 0) yeni.tutar = 'Sıfırdan büyük bir tutar girin.';
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  };

  const ekle = async () => {
    if (!dogrula()) return;

    const kayit = {
      id: yeniId(),
      ay: buAy,
      isim: isim.trim(),
      tutar: ondalikCevir(tutar),
      gun: Number(gun),
      tarih: `${Number(gun)} ${buAy}`,
      saat: saatIster ? saatEtiketi(saat) : null,
    };

    const kaydedilen = await harcamalariYaz([kayit, ...harcamalar]);
    setHarcamalar(kaydedilen);
    yedegeYaz({ harcamaKayitlari: kaydedilen });

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    setIsim('');
    setTutar('');
    setGun('');
    setSaat(new Date());
    setHatalar({});
    setDurum({ tone: 'success', mesaj: `${kayit.isim} eklendi.` });
  };

  const sil = async (id) => {
    const kaydedilen = await harcamalariYaz(harcamalar.filter((k) => k.id !== id));
    setHarcamalar(kaydedilen);
    yedegeYaz({ harcamaKayitlari: kaydedilen });
    setSecilen(null);
    setDurum({ tone: 'success', mesaj: 'Harcama silindi.' });
  };

  return (
    <Screen>
      <PageHeader
        title="Harcamalar"
        subtitle={`${buAy} · ${paraKisa(buAyinToplami)} TL harcandı`}
        icon="cart"
        accent={ACCENT}
      />

      {durum ? (
        <Banner
          tone={durum.tone}
          message={durum.mesaj}
          style={{ marginBottom: spacing.lg }}
          action={
            <Pressable onPress={() => setDurum(null)} hitSlop={8}>
              <Text variant="caption" color={vurgu.base} style={{ fontWeight: '700' }}>
                Tamam
              </Text>
            </Pressable>
          }
        />
      ) : null}

      {/* ---------------- Yeni harcama ---------------- */}
      <Card>
        <CardHeader title="Yeni harcama" subtitle={`${buAy} ayına eklenir`} />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Field
            label="Gün"
            value={gun}
            onChangeText={(metin) => setGun(sadeceRakam(metin).slice(0, 2))}
            keyboardType="number-pad"
            placeholder="15"
            maxLength={2}
            accent={ACCENT}
            hata={hatalar.gun}
            style={{ width: 96 }}
          />
          <Field
            label="Tutar"
            value={tutar}
            onChangeText={setTutar}
            keyboardType="decimal-pad"
            placeholder="250"
            accent={ACCENT}
            sonEk="TL"
            hata={hatalar.tutar}
            style={{ flex: 1 }}
          />
        </View>

        <Field
          label="Nereye harcadın?"
          value={isim}
          onChangeText={setIsim}
          placeholder="Market, fatura, taksi…"
          accent={ACCENT}
          ikon="pricetag-outline"
          hata={hatalar.isim}
        />

        {saatIster ? (
          <Animated.View entering={FadeIn.duration(200)} style={{ marginBottom: spacing.md }}>
            <Text variant="label" tone="muted" style={{ marginBottom: spacing.xs + 2 }}>
              İşlem saati
            </Text>
            <Pressable
              onPress={() => setSaatSecici(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                backgroundColor: vurgu.tint,
                borderRadius: radius.md,
                paddingVertical: 13,
                paddingHorizontal: spacing.md,
              }}
            >
              <Ionicons name="time-outline" size={17} color={vurgu.base} />
              <Text variant="bodyStrong" color={vurgu.base}>
                {saatEtiketi(saat)}
              </Text>
              <Text variant="caption" tone="faint" style={{ marginLeft: 'auto' }}>
                değiştir
              </Text>
            </Pressable>

            {saatSecici ? (
              <DateTimePicker
                value={saat}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(olay, secilenTarih) => {
                  setSaatSecici(Platform.OS === 'ios');
                  if (secilenTarih) setSaat(secilenTarih);
                }}
              />
            ) : null}
          </Animated.View>
        ) : null}

        <Button label="Harcamayı kaydet" icon="add-circle-outline" accent={ACCENT} onPress={ekle} />
      </Card>

      {/* ---------------- Liste ---------------- */}
      {aylikGruplar.length === 0 ? (
        <Card style={{ marginTop: spacing.lg }} padded={false}>
          <EmptyState
            icon="receipt-outline"
            accent={ACCENT}
            title="Henüz harcama yok"
            description="Eklediğin harcamalar ay ay gruplanır ve her ayın toplamı başlıkta görünür."
          />
        </Card>
      ) : (
        aylikGruplar.map((grup) => (
          <View key={grup.ay} style={{ marginTop: spacing.xl }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}
            >
              <Text variant="overline" tone="faint" style={{ textTransform: 'uppercase' }}>
                {grup.ay}
              </Text>
              <Badge label={`${paraKisa(grup.toplam)} TL`} accent={ACCENT} />
            </View>

            <Card padded={false}>
              {grup.kayitlar.map((kayit, sira) => (
                <Animated.View key={kayit.id} layout={LinearTransition.springify()}>
                  {sira > 0 ? <Divider style={{ marginVertical: 0 }} /> : null}
                  <Pressable
                    onPress={() => setSecilen(kayit)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: spacing.lg,
                      backgroundColor: pressed ? color.surfaceAlt : 'transparent',
                    })}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: radius.sm,
                        backgroundColor: vurgu.tint,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="pricetag" size={16} color={vurgu.base} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text variant="bodyStrong" numberOfLines={1}>
                        {kayit.isim}
                      </Text>
                      <Text variant="caption" tone="faint" style={{ marginTop: 2 }}>
                        {kayit.tarih}
                        {kayit.saat ? ` · ${kayit.saat}` : ''}
                      </Text>
                    </View>

                    <Text
                      variant="bodyStrong"
                      color={vurgu.base}
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      −{paraKisa(kayit.tutar)} TL
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </Card>
          </View>
        ))
      )}

      <Sheet
        visible={Boolean(secilen)}
        onClose={() => setSecilen(null)}
        title={secilen?.isim}
        subtitle={
          secilen
            ? `${paraFormatla(secilen.tutar)} TL · ${secilen.tarih}${
                secilen.saat ? ` · ${secilen.saat}` : ''
              }`
            : undefined
        }
      >
        <SheetAction
          icon="trash-outline"
          label="Harcamayı sil"
          hint="Bu işlem geri alınamaz"
          tone="danger"
          onPress={() => secilen && sil(secilen.id)}
        />
        <SheetAction icon="close-outline" label="Vazgeç" onPress={() => setSecilen(null)} />
      </Sheet>
    </Screen>
  );
}
