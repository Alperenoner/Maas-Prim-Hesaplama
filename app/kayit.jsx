import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  Banner,
  Button,
  Card,
  Field,
  IconTile,
  Screen,
  Text,
} from '../components/ui';
import {
  harcamalariYaz,
  maasKayitlariniOku,
  maasKayitlariniYaz,
  harcamalariOku,
  profilYaz,
} from '../lib/storage';
import { girisYap, hatayiCevir, hesapOlustur } from '../services/auth';
import { listeleriBirlestir, yedegeYaz, yedegiOku } from '../services/backup';
import { profiliGetir, profiliSenkronla } from '../services/users';
import { useTheme } from '../theme';

const ACCENT = 'maas';
const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIFRE_MIN = 6;

const MODLAR = [
  { key: 'yeni', etiket: 'Yeni başla' },
  { key: 'giris', etiket: 'Hesabım var' },
];

export default function KayitEkrani() {
  const { spacing, radius, color, accent } = useTheme();
  const vurgu = accent[ACCENT];
  const router = useRouter();

  const [mod, setMod] = useState('yeni');
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [yedekIstiyor, setYedekIstiyor] = useState(true);
  const [hatalar, setHatalar] = useState({});
  const [genelHata, setGenelHata] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const sifreGerekli = mod === 'giris' || yedekIstiyor;

  const dogrula = () => {
    const yeni = {};
    if (mod === 'yeni') {
      if (!isim.trim()) yeni.isim = 'İsim gerekli.';
      if (!soyisim.trim()) yeni.soyisim = 'Soyisim gerekli.';
    }
    if (!EPOSTA_DESENI.test(eposta.trim())) yeni.eposta = 'Geçerli bir e-posta girin.';
    if (sifreGerekli && sifre.length < SIFRE_MIN) {
      yeni.sifre = `Şifre en az ${SIFRE_MIN} karakter olmalı.`;
    }
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  };

  /** Buluttaki yedeği yerel veriyle birleştirir — hiçbir kayıt kaybolmaz. */
  const yedegiGeriYukle = async () => {
    const yedek = await yedegiOku();
    if (!yedek) return;

    const [yerelMaas, yerelHarcama] = await Promise.all([maasKayitlariniOku(), harcamalariOku()]);

    await maasKayitlariniYaz(listeleriBirlestir(yerelMaas, yedek.maasKayitlari));
    await harcamalariYaz(listeleriBirlestir(yerelHarcama, yedek.harcamaKayitlari));
  };

  const devamEt = async () => {
    setGenelHata(null);
    if (!dogrula()) return;

    setYukleniyor(true);
    try {
      let profil = {
        isim: isim.trim(),
        soyisim: soyisim.trim(),
        eposta: eposta.trim().toLowerCase(),
      };

      if (mod === 'giris') {
        await girisYap({ eposta: profil.eposta, sifre });
        // İsim/soyisim eski cihazda kalmış olabilir — bulut profilinden getir.
        const bulut = await profiliGetir();
        if (bulut?.isim) profil = bulut;
        await yedegiGeriYukle();
      } else if (yedekIstiyor) {
        await hesapOlustur({ ...profil, sifre });
        await profiliSenkronla(profil);
        await yedegiGeriYukle();
        // Yeni hesapta yerel veri varsa hemen yukarı taşı.
        const [maaslar, harcamalar] = await Promise.all([maasKayitlariniOku(), harcamalariOku()]);
        await yedegeYaz({ maasKayitlari: maaslar, harcamaKayitlari: harcamalar });
      }

      await profilYaz(profil);
      router.replace('/');
    } catch (hata) {
      setGenelHata(hatayiCevir(hata));
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <Screen edges={{ top: true, bottom: true }} contentStyle={{ justifyContent: 'center', flexGrow: 1 }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <IconTile icon="wallet" accent={ACCENT} size={56} />
        <Text variant="title" style={{ marginTop: spacing.md }}>
          Prim Hesaplama
        </Text>
        <Text variant="body" tone="muted" style={{ textAlign: 'center', marginTop: spacing.xs }}>
          Maaşını, primlerini ve harcamalarını tek yerde takip et.
        </Text>
      </View>

      {/* Mod seçici */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: color.surfaceAlt,
          borderRadius: radius.md,
          padding: 4,
          marginBottom: spacing.lg,
        }}
      >
        {MODLAR.map((secenek) => {
          const seciliMi = mod === secenek.key;
          return (
            <Pressable
              key={secenek.key}
              onPress={() => {
                setMod(secenek.key);
                setHatalar({});
                setGenelHata(null);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: spacing.sm + 2,
                borderRadius: radius.sm,
                backgroundColor: seciliMi ? color.surface : 'transparent',
              }}
            >
              <Text
                variant="label"
                color={seciliMi ? color.text : color.textMuted}
                style={{ fontWeight: '700' }}
              >
                {secenek.etiket}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        {mod === 'yeni' ? (
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Field
              label="İsim"
              value={isim}
              onChangeText={setIsim}
              placeholder="Alperen"
              accent={ACCENT}
              hata={hatalar.isim}
              autoCapitalize="words"
              style={{ flex: 1 }}
            />
            <Field
              label="Soyisim"
              value={soyisim}
              onChangeText={setSoyisim}
              placeholder="Öner"
              accent={ACCENT}
              hata={hatalar.soyisim}
              autoCapitalize="words"
              style={{ flex: 1 }}
            />
          </View>
        ) : null}

        <Field
          label="E-posta"
          value={eposta}
          onChangeText={setEposta}
          placeholder="ornek@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          accent={ACCENT}
          ikon="mail-outline"
          hata={hatalar.eposta}
        />

        {mod === 'yeni' ? (
          <Pressable
            onPress={() => setYedekIstiyor((onceki) => !onceki)}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: spacing.md,
              paddingVertical: spacing.sm,
              marginBottom: spacing.sm,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: yedekIstiyor ? vurgu.base : color.borderStrong,
                backgroundColor: yedekIstiyor ? vurgu.base : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
              }}
            >
              {yedekIstiyor ? (
                <Text variant="caption" color={vurgu.on} style={{ fontWeight: '900' }}>
                  ✓
                </Text>
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">Bulut yedeğini aç</Text>
              <Text variant="caption" tone="muted" style={{ marginTop: 2, lineHeight: 17 }}>
                Şifre belirlersen verilerin hesabına bağlanır ve yeni bir cihazda giriş
                yaparak geri yükleyebilirsin. Kapalı bırakırsan uygulama tamamen bu
                cihazda çalışır.
              </Text>
            </View>
          </Pressable>
        ) : null}

        {sifreGerekli ? (
          <Animated.View entering={FadeIn.duration(200)}>
            <Field
              label="Şifre"
              value={sifre}
              onChangeText={setSifre}
              placeholder="En az 6 karakter"
              secureTextEntry
              autoCapitalize="none"
              autoComplete={mod === 'giris' ? 'current-password' : 'new-password'}
              accent={ACCENT}
              ikon="lock-closed-outline"
              hata={hatalar.sifre}
            />
          </Animated.View>
        ) : null}

        {genelHata ? (
          <Banner tone="danger" message={genelHata} style={{ marginBottom: spacing.md }} />
        ) : null}

        <Button
          label={mod === 'giris' ? 'Giriş yap ve geri yükle' : 'Başla'}
          icon={mod === 'giris' ? 'cloud-download-outline' : 'arrow-forward-circle-outline'}
          accent={ACCENT}
          loading={yukleniyor}
          onPress={devamEt}
        />
      </Card>

      <Text variant="caption" tone="faint" style={{ textAlign: 'center', marginTop: spacing.lg }}>
        Verilerin öncelikle cihazında saklanır. Bulut yedeği yalnızca senin
        hesabınla erişilebilir.
      </Text>
    </Screen>
  );
}
