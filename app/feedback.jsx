import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import {
  Button,
  Card,
  Divider,
  IconTile,
  IconButton,
  PageHeader,
  Screen,
  Text,
} from '../components/ui';
import { profilOku } from '../lib/storage';
import { KATEGORILER, MESAJ_MAX, MESAJ_MIN, geriBildirimGonder } from '../services/feedback';
import { useTheme } from '../theme';

const ACCENT = 'maas';

export default function GeriBildirimEkrani() {
  const { color, spacing, radius, accent, status } = useTheme();
  const vurgu = accent[ACCENT];
  const router = useRouter();

  const [kategori, setKategori] = useState(null);
  const [mesaj, setMesaj] = useState('');
  const [profil, setProfil] = useState(null);
  const [hata, setHata] = useState(null);
  const [gonderildi, setGonderildi] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  useEffect(() => {
    profilOku().then(setProfil);
  }, []);

  const uzunluk = mesaj.trim().length;
  const yeterli = uzunluk >= MESAJ_MIN;
  const secilenKategori = KATEGORILER.find((k) => k.key === kategori);

  const gonder = async () => {
    setHata(null);
    setGonderiliyor(true);
    try {
      await geriBildirimGonder({ mesaj, kategori, profil });
      setGonderildi(true);
    } catch (e) {
      setHata(e?.message ?? 'Gönderilemedi. İnternet bağlantını kontrol edip tekrar dene.');
    } finally {
      setGonderiliyor(false);
    }
  };

  /* ---------------- Gönderildi ekranı ---------------- */
  if (gonderildi) {
    return (
      <Screen edges={{ top: true, bottom: true }}>
        <View style={{ alignItems: 'flex-end' }}>
          <IconButton icon="close" accessibilityLabel="Kapat" onPress={() => router.back()} />
        </View>

        <Animated.View entering={FadeInDown.duration(280)} style={{ alignItems: 'center', paddingTop: spacing.xxxl }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: status.successTint,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <Ionicons name="checkmark-circle" size={40} color={status.success} />
          </View>

          <Text variant="title" style={{ textAlign: 'center' }}>
            Mesajın ulaştı
          </Text>
          <Text
            variant="body"
            tone="muted"
            style={{ textAlign: 'center', marginTop: spacing.sm, maxWidth: 300 }}
          >
            Teşekkürler. Uygulamayı geliştiren kişi mesajını okuyacak.
          </Text>

          <Card style={{ marginTop: spacing.xxl, width: '100%' }}>
            <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
              <IconTile icon="mail-outline" accent={ACCENT} size={36} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">Yanıt gerekirse</Text>
                <Text variant="caption" tone="muted" style={{ marginTop: 3, lineHeight: 18 }}>
                  {profil?.eposta
                    ? `${profil.eposta} adresine e-posta gönderilir. Gelen kutunu kontrol etmeyi unutma.`
                    : 'Profilinde kayıtlı e-posta adresine dönüş yapılır.'}
                </Text>
              </View>
            </View>
          </Card>

          <Button
            label="Kapat"
            icon="arrow-back-outline"
            accent={ACCENT}
            onPress={() => router.back()}
            style={{ marginTop: spacing.xl }}
          />

          <Pressable
            onPress={() => {
              setGonderildi(false);
              setMesaj('');
              setKategori(null);
            }}
            style={{ paddingVertical: spacing.md }}
          >
            <Text variant="label" color={vurgu.base}>
              Bir mesaj daha yaz
            </Text>
          </Pressable>
        </Animated.View>
      </Screen>
    );
  }

  /* ---------------- Form ---------------- */
  return (
    <Screen edges={{ top: true, bottom: true }}>
      <PageHeader
        title="Geri bildirim"
        subtitle="Uygulamayı geliştirene doğrudan mesaj gönder"
        icon="chatbubble-ellipses"
        accent={ACCENT}
        right={<IconButton icon="close" accessibilityLabel="Kapat" onPress={() => router.back()} />}
      />

      {/* 1. Adım — konu seçimi */}
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: vurgu.base,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="caption" color={vurgu.on} style={{ fontWeight: '800' }}>
              1
            </Text>
          </View>
          <Text variant="subheading">Konu nedir?</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {KATEGORILER.map((k) => {
            const seciliMi = kategori === k.key;
            return (
              <Pressable
                key={k.key}
                onPress={() => setKategori(k.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: seciliMi }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: radius.md,
                  borderWidth: seciliMi ? 1.5 : 1,
                  borderColor: seciliMi ? vurgu.base : color.border,
                  backgroundColor: seciliMi ? vurgu.tint : 'transparent',
                }}
              >
                <IconTile icon={k.ikon} accent={ACCENT} size={34} filled={seciliMi} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong" color={seciliMi ? vurgu.base : color.text}>
                    {k.etiket}
                  </Text>
                  <Text variant="caption" tone="faint" style={{ marginTop: 1 }}>
                    {k.aciklama}
                  </Text>
                </View>
                {seciliMi ? <Ionicons name="checkmark-circle" size={20} color={vurgu.base} /> : null}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* 2. Adım — mesaj */}
      {kategori ? (
        <Animated.View entering={FadeIn.duration(220)}>
          <Card style={{ marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: vurgu.base,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text variant="caption" color={vurgu.on} style={{ fontWeight: '800' }}>
                  2
                </Text>
              </View>
              <Text variant="subheading">{secilenKategori?.soru}</Text>
            </View>

            <Text variant="caption" tone="muted" style={{ marginBottom: spacing.md, lineHeight: 18 }}>
              {secilenKategori?.ipucu}
            </Text>

            <MesajKutusu
              value={mesaj}
              onChangeText={(m) => setMesaj(m.slice(0, MESAJ_MAX))}
              placeholder={secilenKategori?.ornek}
            />

            {/* İlerleme göstergesi — neden gönderemediği açıkça yazıyor */}
            <View style={{ marginTop: spacing.md }}>
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: color.surfaceAlt,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: 4,
                    borderRadius: 2,
                    width: `${Math.min(100, (uzunluk / MESAJ_MIN) * 100)}%`,
                    backgroundColor: yeterli ? status.success : vurgu.base,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: spacing.sm,
                }}
              >
                <Text variant="caption" color={yeterli ? status.success : color.textMuted}>
                  {yeterli
                    ? '✓ Gönderilmeye hazır'
                    : `Biraz daha yaz — en az ${MESAJ_MIN} karakter (${uzunluk}/${MESAJ_MIN})`}
                </Text>
                <Text variant="caption" tone="faint" style={{ fontVariant: ['tabular-nums'] }}>
                  {uzunluk}/{MESAJ_MAX}
                </Text>
              </View>
            </View>

            {hata ? (
              <Text variant="caption" color={status.danger} style={{ marginTop: spacing.md }}>
                {hata}
              </Text>
            ) : null}

            <Button
              label={yeterli ? 'Gönder' : 'Önce mesajını yaz'}
              icon="send-outline"
              accent={ACCENT}
              loading={gonderiliyor}
              disabled={!yeterli}
              onPress={gonder}
              style={{ marginTop: spacing.lg }}
            />
          </Card>
        </Animated.View>
      ) : null}

      {/* Ne olacağı — belirsizliği kaldıran bölüm */}
      <Card style={{ marginTop: spacing.md }}>
        <Text variant="subheading" style={{ marginBottom: spacing.md }}>
          Gönderdikten sonra ne olur?
        </Text>

        {[
          {
            ikon: 'paper-plane-outline',
            baslik: 'Mesajın iletilir',
            metin: 'Uygulamayı geliştiren kişiye anında ulaşır.',
          },
          {
            ikon: 'mail-outline',
            baslik: 'Gerekirse yanıt gelir',
            metin: profil?.eposta
              ? `Yanıt ${profil.eposta} adresine e-posta olarak gönderilir.`
              : 'Yanıt, profilindeki e-posta adresine gönderilir.',
          },
          {
            ikon: 'lock-closed-outline',
            baslik: 'Maaş verilerin gönderilmez',
            metin: 'Yalnızca adın, e-postan ve mesajın iletilir. Kayıtların cihazında kalır.',
          },
        ].map((satir, i) => (
          <View key={satir.baslik}>
            {i > 0 ? <Divider style={{ marginVertical: spacing.sm }} /> : null}
            <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
              <IconTile icon={satir.ikon} accent={ACCENT} size={32} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">{satir.baslik}</Text>
                <Text variant="caption" tone="muted" style={{ marginTop: 2, lineHeight: 17 }}>
                  {satir.metin}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

/** Çok satırlı mesaj kutusu — odaklandığında vurgu rengine geçer. */
function MesajKutusu({ value, onChangeText, placeholder }) {
  const { color, radius, spacing, accent, type } = useTheme();
  const vurgu = accent[ACCENT];
  const [odakli, setOdakli] = useState(false);

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={color.textFaint}
      multiline
      textAlignVertical="top"
      onFocus={() => setOdakli(true)}
      onBlur={() => setOdakli(false)}
      accessibilityLabel="Geri bildirim mesajı"
      style={{
        minHeight: 130,
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: odakli ? 1.5 : 1,
        borderColor: odakli ? vurgu.base : color.border,
        backgroundColor: color.surfaceAlt,
        color: color.text,
        ...type.body,
      }}
    />
  );
}
