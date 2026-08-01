import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  Badge,
  Banner,
  Button,
  Card,
  CardHeader,
  Divider,
  Field,
  IconButton,
  PageHeader,
  Screen,
  Sheet,
  SheetAction,
  Text,
} from '../components/ui';
import { paraKisa } from '../lib/format';
import {
  harcamalariOku,
  maasKayitlariniOku,
  profilOku,
  profilYaz,
  yerelVeriyiTemizle,
} from '../lib/storage';
import {
  cikisYap,
  hatayiCevir,
  hesapOlustur,
  sifreSifirlamaGonder,
  useOturum,
} from '../services/auth';
import { yedegeYaz } from '../services/backup';
import { profiliSenkronla } from '../services/users';
import { useTheme } from '../theme';

const ACCENT = 'maas';
const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIFRE_MIN = 6;

export default function ProfilEkrani() {
  const { spacing, radius, accent } = useTheme();
  const vurgu = accent[ACCENT];
  const router = useRouter();
  const { yedekAcik } = useOturum();

  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hatalar, setHatalar] = useState({});
  const [durum, setDurum] = useState(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hesapAcilyor, setHesapAciliyor] = useState(false);
  const [istatistik, setIstatistik] = useState({ ay: 0, harcama: 0, toplam: 0 });
  const [cikisPaneli, setCikisPaneli] = useState(false);
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    (async () => {
      const [profil, maaslar, harcamalar] = await Promise.all([
        profilOku(),
        maasKayitlariniOku(),
        harcamalariOku(),
      ]);

      if (profil) {
        setIsim(profil.isim);
        setSoyisim(profil.soyisim);
        setEposta(profil.eposta);
      }
      setIstatistik({
        ay: maaslar.length,
        harcama: harcamalar.length,
        toplam: maaslar.reduce((t, k) => t + (k.hamToplam || 0), 0),
      });
      setHazir(true);
    })();
  }, []);

  const profilDogrula = () => {
    const yeni = {};
    if (!isim.trim()) yeni.isim = 'İsim gerekli.';
    if (!soyisim.trim()) yeni.soyisim = 'Soyisim gerekli.';
    if (!EPOSTA_DESENI.test(eposta.trim())) yeni.eposta = 'Geçerli bir e-posta girin.';
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  };

  const kaydet = async () => {
    setDurum(null);
    if (!profilDogrula()) return;

    setKaydediliyor(true);
    try {
      const profil = await profilYaz({ isim, soyisim, eposta });
      await profiliSenkronla(profil);
      setDurum({ tone: 'success', mesaj: 'Bilgilerin güncellendi.' });
    } catch (hata) {
      setDurum({ tone: 'danger', mesaj: hatayiCevir(hata) });
    } finally {
      setKaydediliyor(false);
    }
  };

  const yedeklemeyiAc = async () => {
    setDurum(null);
    const yeni = {};
    if (!EPOSTA_DESENI.test(eposta.trim())) yeni.eposta = 'Geçerli bir e-posta girin.';
    if (sifre.length < SIFRE_MIN) yeni.sifre = `Şifre en az ${SIFRE_MIN} karakter olmalı.`;
    setHatalar(yeni);
    if (Object.keys(yeni).length > 0) return;

    setHesapAciliyor(true);
    try {
      const profil = { isim: isim.trim(), soyisim: soyisim.trim(), eposta: eposta.trim() };
      await hesapOlustur({ ...profil, sifre });
      await profilYaz(profil);
      await profiliSenkronla(profil);

      const [maaslar, harcamalar] = await Promise.all([maasKayitlariniOku(), harcamalariOku()]);
      await yedegeYaz({ maasKayitlari: maaslar, harcamaKayitlari: harcamalar });

      setSifre('');
      setDurum({ tone: 'success', mesaj: 'Bulut yedeği açıldı ve mevcut verilerin yüklendi.' });
    } catch (hata) {
      setDurum({ tone: 'danger', mesaj: hatayiCevir(hata) });
    } finally {
      setHesapAciliyor(false);
    }
  };

  const sifreSifirla = async () => {
    try {
      await sifreSifirlamaGonder(eposta);
      setDurum({ tone: 'success', mesaj: 'Şifre sıfırlama bağlantısı e-postana gönderildi.' });
    } catch (hata) {
      setDurum({ tone: 'danger', mesaj: hatayiCevir(hata) });
    }
  };

  const cikisYapVeTemizle = async () => {
    setCikisPaneli(false);
    await yerelVeriyiTemizle();
    await cikisYap();
    router.replace('/kayit');
  };

  if (!hazir) return <Screen />;

  return (
    <Screen edges={{ top: true, bottom: true }}>
      <PageHeader
        title="Profil"
        subtitle={yedekAcik ? 'Hesabın bulut yedeğine bağlı' : 'Yalnızca bu cihazda'}
        icon="person-circle"
        accent={ACCENT}
        right={<IconButton icon="close" accessibilityLabel="Kapat" onPress={() => router.back()} />}
      />

      {durum ? (
        <Banner tone={durum.tone} message={durum.mesaj} style={{ marginBottom: spacing.lg }} />
      ) : null}

      {/* ---------------- Özet ---------------- */}
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: radius.lg,
              backgroundColor: vurgu.tint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="heading" color={vurgu.base}>
              {(isim[0] ?? '?').toLocaleUpperCase('tr-TR')}
              {(soyisim[0] ?? '').toLocaleUpperCase('tr-TR')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="heading" numberOfLines={1}>
              {[isim, soyisim].filter(Boolean).join(' ') || 'İsimsiz kullanıcı'}
            </Text>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {eposta || 'e-posta yok'}
            </Text>
          </View>
        </View>

        <Divider />

        <View style={{ flexDirection: 'row' }}>
          {[
            { etiket: 'Kayıtlı ay', deger: String(istatistik.ay) },
            { etiket: 'Harcama', deger: String(istatistik.harcama) },
            { etiket: 'Toplam kazanç', deger: `${paraKisa(istatistik.toplam)} TL` },
          ].map((kutu) => (
            <View key={kutu.etiket} style={{ flex: 1 }}>
              <Text variant="subheading" style={{ fontVariant: ['tabular-nums'] }}>
                {kutu.deger}
              </Text>
              <Text variant="caption" tone="faint">
                {kutu.etiket}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* ---------------- Bilgiler ---------------- */}
      <Card style={{ marginTop: spacing.md }}>
        <CardHeader title="Bilgilerim" />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Field
            label="İsim"
            value={isim}
            onChangeText={setIsim}
            accent={ACCENT}
            hata={hatalar.isim}
            autoCapitalize="words"
            style={{ flex: 1 }}
          />
          <Field
            label="Soyisim"
            value={soyisim}
            onChangeText={setSoyisim}
            accent={ACCENT}
            hata={hatalar.soyisim}
            autoCapitalize="words"
            style={{ flex: 1 }}
          />
        </View>

        <Field
          label="E-posta"
          value={eposta}
          onChangeText={setEposta}
          keyboardType="email-address"
          autoCapitalize="none"
          accent={ACCENT}
          ikon="mail-outline"
          hata={hatalar.eposta}
          editable={!yedekAcik}
          ipucu={yedekAcik ? 'Hesaba bağlı e-posta değiştirilemez.' : undefined}
        />

        <Button
          label="Kaydet"
          icon="checkmark-circle-outline"
          accent={ACCENT}
          loading={kaydediliyor}
          onPress={kaydet}
        />
      </Card>

      {/* ---------------- Yedekleme ---------------- */}
      <Card style={{ marginTop: spacing.md }}>
        <CardHeader
          title="Bulut yedeği"
          subtitle={
            yedekAcik
              ? 'Her kayıt otomatik olarak hesabına yedekleniyor'
              : 'Şu anda kapalı — veriler yalnızca bu cihazda'
          }
          right={
            <Badge
              label={yedekAcik ? 'Açık' : 'Kapalı'}
              tone={yedekAcik ? 'success' : 'warning'}
            />
          }
        />

        {yedekAcik ? (
          <>
            <Text variant="caption" tone="muted" style={{ lineHeight: 18 }}>
              Yedeğin hesabının kimliğiyle şifrelenmiş bir belgede tutulur. Yeni bir
              cihazda aynı e-posta ve şifreyle giriş yaptığında tüm kayıtların geri gelir.
            </Text>
            <Pressable onPress={sifreSifirla} style={{ paddingVertical: spacing.md }}>
              <Text variant="label" color={vurgu.base}>
                Şifremi değiştir
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text variant="caption" tone="muted" style={{ marginBottom: spacing.md, lineHeight: 18 }}>
              Bir şifre belirleyerek yedeklemeyi açabilirsin. Mevcut kayıtların hemen
              buluta taşınır ve başka bir cihazda giriş yaparak erişebilirsin.
            </Text>
            <Field
              label="Yeni şifre"
              value={sifre}
              onChangeText={setSifre}
              placeholder="En az 6 karakter"
              secureTextEntry
              autoCapitalize="none"
              accent={ACCENT}
              ikon="lock-closed-outline"
              hata={hatalar.sifre}
            />
            <Button
              label="Yedeklemeyi aç"
              icon="cloud-upload-outline"
              variant="secondary"
              accent={ACCENT}
              loading={hesapAcilyor}
              onPress={yedeklemeyiAc}
            />
          </>
        )}
      </Card>

      {/* ---------------- Tehlikeli bölge ---------------- */}
      <Card style={{ marginTop: spacing.md }}>
        <CardHeader title="Hesap" />
        <Button
          label="Çıkış yap"
          variant="danger"
          icon="log-out-outline"
          onPress={() => setCikisPaneli(true)}
        />
      </Card>

      <Sheet
        visible={cikisPaneli}
        onClose={() => setCikisPaneli(false)}
        title="Çıkış yapılsın mı?"
        subtitle={
          yedekAcik
            ? 'Bu cihazdaki veriler silinir. Tekrar giriş yaptığında bulut yedeğinden geri yüklenir.'
            : 'Yedekleme kapalı olduğu için bu cihazdaki veriler kalıcı olarak silinir.'
        }
      >
        <SheetAction
          icon="log-out-outline"
          label="Çıkış yap"
          tone="danger"
          hint={yedekAcik ? 'Yedeğinden geri yükleyebilirsin' : 'Bu işlem geri alınamaz'}
          onPress={cikisYapVeTemizle}
        />
        <SheetAction icon="close-outline" label="Vazgeç" onPress={() => setCikisPaneli(false)} />
      </Sheet>
    </Screen>
  );
}
