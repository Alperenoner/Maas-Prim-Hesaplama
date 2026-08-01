import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import {
  AmountRow,
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
  SectionLabel,
  Sheet,
  SheetAction,
  Stepper,
  Text,
  TotalCard,
} from '../../components/ui';
import { ayEtiketi, paraKisa, rakamFormatla, sadeceRakam } from '../../lib/format';
import { yeniId } from '../../lib/ids';
import { PRIM_KALEMLERI, kayitOlustur, kayittanAdetler, primHesapla } from '../../lib/prim';
import {
  maasHatirlamaOku,
  maasHatirlamaYaz,
  maasKayitlariniOku,
  maasKayitlariniYaz,
} from '../../lib/storage';
import { useOturum } from '../../services/auth';
import { yedegeYaz } from '../../services/backup';
import { useTheme } from '../../theme';

const ACCENT = 'maas';
const BOS_ADETLER = { kurulum: '', haftaIci: '', haftaSonu: '', arac: '' };

export default function MaasEkrani() {
  const { color, spacing, accent } = useTheme();
  const vurgu = accent[ACCENT];

  const [maas, setMaas] = useState('');
  const [adetler, setAdetler] = useState(BOS_ADETLER);
  const [hatirla, setHatirla] = useState(false);
  const [kayitlar, setKayitlar] = useState([]);
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [secilenKayit, setSecilenKayit] = useState(null);
  const [durum, setDurum] = useState(null);
  const { yedekAcik, hazir: oturumHazir } = useOturum();

  const buAy = ayEtiketi();

  useFocusEffect(
    useCallback(() => {
      let iptal = false;

      (async () => {
        const [liste, hatirlama] = await Promise.all([maasKayitlariniOku(), maasHatirlamaOku()]);
        if (iptal) return;
        setKayitlar(liste);
        if (hatirlama.acik && hatirlama.tutar) {
          setHatirla(true);
          setMaas((onceki) => onceki || hatirlama.tutar);
        }
      })();

      return () => {
        iptal = true;
      };
    }, [])
  );

  const hesap = useMemo(() => primHesapla(maas, adetler), [maas, adetler]);

  const buAyKayitli = useMemo(() => kayitlar.find((kayit) => kayit.ay === buAy), [kayitlar, buAy]);

  const adetDegistir = (anahtar, deger) =>
    setAdetler((onceki) => ({ ...onceki, [anahtar]: sadeceRakam(deger) }));

  const hatirlaDegistir = async (acik) => {
    setHatirla(acik);
    await maasHatirlamaYaz(acik, maas);
  };

  const formuTemizle = () => {
    setAdetler(BOS_ADETLER);
    setDuzenlenenId(null);
  };

  const kaydet = async () => {
    if (hesap.anaMaas <= 0) {
      setDurum({ tone: 'danger', mesaj: 'Kaydetmeden önce ana maaş tutarını girin.' });
      return;
    }

    if (!duzenlenenId && buAyKayitli) {
      setDurum({
        tone: 'warning',
        mesaj: `${buAy} için zaten bir kayıt var. Aşağıdaki karta dokunup "Düzenle" ile güncelleyebilirsiniz.`,
      });
      return;
    }

    const kayit = kayitOlustur({
      id: duzenlenenId ?? yeniId(),
      ay: duzenlenenId ? (kayitlar.find((k) => k.id === duzenlenenId)?.ay ?? buAy) : buAy,
      maas,
      adetler,
    });

    const yeniListe = duzenlenenId
      ? kayitlar.map((k) => (k.id === duzenlenenId ? kayit : k))
      : [kayit, ...kayitlar];

    const kaydedilen = await maasKayitlariniYaz(yeniListe);
    setKayitlar(kaydedilen);

    if (hatirla) await maasHatirlamaYaz(true, maas);
    yedegeYaz({ maasKayitlari: kaydedilen });

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    setDurum({
      tone: 'success',
      mesaj: duzenlenenId ? `${kayit.ay} güncellendi.` : `${kayit.ay} kaydedildi.`,
    });
    formuTemizle();
  };

  const kayitSil = async (id) => {
    const kalan = kayitlar.filter((k) => k.id !== id);
    const kaydedilen = await maasKayitlariniYaz(kalan);
    setKayitlar(kaydedilen);
    yedegeYaz({ maasKayitlari: kaydedilen });
    if (duzenlenenId === id) formuTemizle();
    setSecilenKayit(null);
    setDurum({ tone: 'success', mesaj: 'Kayıt silindi.' });
  };

  const duzenlemeyeAl = (kayit) => {
    setDuzenlenenId(kayit.id);
    setMaas(String(kayit.hamMaas || ''));
    const mevcut = kayittanAdetler(kayit);
    setAdetler(Object.fromEntries(Object.entries(mevcut).map(([k, v]) => [k, v ? String(v) : ''])));
    setSecilenKayit(null);
    setDurum({
      tone: 'info',
      mesaj: `${kayit.ay} düzenleniyor. Değişiklikleri kaydetmeyi unutmayın.`,
    });
  };

  return (
    <Screen>
      <PageHeader
        title="Maaş"
        subtitle={`${buAy} · hak ediş hesabı`}
        icon="wallet"
        accent={ACCENT}
        right={buAyKayitli ? <Badge label="Bu ay kayıtlı" accent={ACCENT} /> : null}
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

      {oturumHazir && !yedekAcik ? (
        <Banner
          tone="warning"
          title="Bulut yedeği kapalı"
          message="Verileriniz yalnızca bu cihazda. Profil ekranından hesap oluşturarak yedeklemeyi açabilirsiniz."
          style={{ marginBottom: spacing.lg }}
        />
      ) : null}

      {/* ---------------- Girdi ---------------- */}
      <Card>
        <CardHeader title="Ana maaş" subtitle="Prim oranları bu tutar üzerinden hesaplanır" />

        <Field
          value={rakamFormatla(maas)}
          onChangeText={(metin) => setMaas(sadeceRakam(metin))}
          keyboardType="number-pad"
          placeholder="Örn: 30.000"
          accent={ACCENT}
          ikon="cash-outline"
          sonEk="TL"
          style={{ marginBottom: spacing.sm }}
        />

        <Pressable
          onPress={() => hatirlaDegistir(!hatirla)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: spacing.sm,
          }}
        >
          <View style={{ flex: 1, marginRight: spacing.md }}>
            <Text variant="bodyStrong">Maaşımı hatırla</Text>
            <Text variant="caption" tone="faint" style={{ marginTop: 1 }}>
              Uygulamayı açtığında tutar hazır gelir
            </Text>
          </View>
          <Switch
            value={hatirla}
            onValueChange={hatirlaDegistir}
            trackColor={{ true: vurgu.base, false: color.borderStrong }}
            thumbColor="#FFFFFF"
          />
        </Pressable>
      </Card>

      {/* ---------------- Kalemler ---------------- */}
      <Card style={{ marginTop: spacing.md }}>
        <CardHeader
          title="Prim kalemleri"
          subtitle={hesap.anaMaas > 0 ? 'Birim değerler maaşa göre güncellendi' : 'Önce maaş girin'}
        />

        {PRIM_KALEMLERI.map((kalem, sira) => {
          const satir = hesap.kalemler[sira];
          return (
            <View key={kalem.key}>
              {sira > 0 ? <Divider style={{ marginVertical: spacing.xs }} /> : null}
              <Stepper
                label={kalem.etiket}
                ikon={kalem.ikon}
                accent={ACCENT}
                value={adetler[kalem.key]}
                onChange={(deger) => adetDegistir(kalem.key, deger)}
                yardim={
                  hesap.anaMaas > 0
                    ? `%${(satir.oran * 100).toLocaleString('tr-TR')} · birim ${paraKisa(satir.birim)} TL`
                    : `%${(satir.oran * 100).toLocaleString('tr-TR')}`
                }
              />
              {satir.tutar > 0 ? (
                <Animated.View entering={FadeIn.duration(200)} style={{ paddingLeft: 44 }}>
                  <Text variant="caption" color={vurgu.base} style={{ fontWeight: '700' }}>
                    + {paraKisa(satir.tutar)} TL
                  </Text>
                </Animated.View>
              ) : null}
            </View>
          );
        })}
      </Card>

      {/* ---------------- Toplam ---------------- */}
      <View style={{ marginTop: spacing.md }}>
        <TotalCard
          label="Bu ayki toplam hak ediş"
          value={hesap.toplam}
          accent={ACCENT}
          hint={
            hesap.primToplam > 0
              ? `${paraKisa(hesap.anaMaas)} TL maaş + ${paraKisa(hesap.primToplam)} TL prim`
              : 'Kalem ekledikçe toplam güncellenir'
          }
        />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        {duzenlenenId ? (
          <Button
            label="Vazgeç"
            variant="ghost"
            onPress={() => {
              formuTemizle();
              setDurum(null);
            }}
            full={false}
            style={{ flex: 1 }}
          />
        ) : null}
        <Button
          label={duzenlenenId ? 'Değişiklikleri kaydet' : 'Bu ayı kaydet'}
          icon={duzenlenenId ? 'checkmark-circle-outline' : 'save-outline'}
          accent={ACCENT}
          onPress={kaydet}
          disabled={hesap.anaMaas <= 0}
          full={false}
          style={{ flex: 2 }}
        />
      </View>

      {/* ---------------- Son kayıtlar ---------------- */}
      <SectionLabel label="Son kayıtlar" />

      {kayitlar.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon="albums-outline"
            accent={ACCENT}
            title="Henüz kayıt yok"
            description="Maaşını ve prim kalemlerini girip “Bu ayı kaydet” dediğinde ay burada listelenir."
          />
        </Card>
      ) : (
        kayitlar.slice(0, 3).map((kayit) => (
          <Animated.View key={kayit.id} layout={LinearTransition.springify()}>
            <Pressable onPress={() => setSecilenKayit(kayit)}>
              {({ pressed }) => (
                <Card
                  style={{
                    marginBottom: spacing.sm,
                    opacity: pressed ? 0.7 : 1,
                    borderColor: duzenlenenId === kayit.id ? vurgu.base : color.border,
                    borderWidth: duzenlenenId === kayit.id ? 1.5 : StyleSheet.hairlineWidth,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyStrong">{kayit.ay}</Text>
                      <Text variant="caption" tone="faint" style={{ marginTop: 2 }}>
                        {kayit.ozet || 'Kalem girilmemiş'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        variant="bodyStrong"
                        color={vurgu.base}
                        style={{ fontVariant: ['tabular-nums'] }}
                      >
                        {paraKisa(kayit.hamToplam)} TL
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={color.textFaint} />
                    </View>
                  </View>
                </Card>
              )}
            </Pressable>
          </Animated.View>
        ))
      )}

      {/* ---------------- Aksiyon paneli ---------------- */}
      <Sheet
        visible={Boolean(secilenKayit)}
        onClose={() => setSecilenKayit(null)}
        title={secilenKayit?.ay}
        subtitle={
          secilenKayit
            ? `${paraKisa(secilenKayit.hamToplam)} TL · ${secilenKayit.ozet}`
            : undefined
        }
      >
        {secilenKayit
          ? PRIM_KALEMLERI.map((kalem) => (
              <AmountRow
                key={kalem.key}
                label={`${kalem.etiket} (${secilenKayit[kalem.adetAlani] ?? 0})`}
                value={secilenKayit[kalem.paraAlani] ?? 0}
                muted
              />
            ))
          : null}

        <Divider />

        <SheetAction
          icon="create-outline"
          label="Düzenle"
          hint="Kalemleri forma yükler"
          onPress={() => secilenKayit && duzenlemeyeAl(secilenKayit)}
        />
        <SheetAction
          icon="trash-outline"
          label="Sil"
          hint="Bu ayın kaydı kalıcı olarak kaldırılır"
          tone="danger"
          onPress={() => secilenKayit && kayitSil(secilenKayit.id)}
        />
      </Sheet>
    </Screen>
  );
}
