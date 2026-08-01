import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import {
  Banner,
  Button,
  Card,
  Field,
  IconButton,
  PageHeader,
  Screen,
  Text,
} from '../components/ui';
import { profilOku } from '../lib/storage';
import { MESAJ_MAX, MESAJ_MIN, geriBildirimGonder } from '../services/feedback';
import { useTheme } from '../theme';

const ACCENT = 'maas';

export default function GeriBildirimEkrani() {
  const { spacing, color, status } = useTheme();
  const router = useRouter();

  const [mesaj, setMesaj] = useState('');
  const [profil, setProfil] = useState(null);
  const [durum, setDurum] = useState(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  useEffect(() => {
    profilOku().then(setProfil);
  }, []);

  const kalan = MESAJ_MAX - mesaj.length;
  const yeterli = mesaj.trim().length >= MESAJ_MIN;

  const gonder = async () => {
    setDurum(null);
    if (!yeterli) {
      setDurum({ tone: 'danger', mesaj: `Mesaj en az ${MESAJ_MIN} karakter olmalı.` });
      return;
    }

    setGonderiliyor(true);
    try {
      await geriBildirimGonder({ mesaj, profil });
      setMesaj('');
      setDurum({
        tone: 'success',
        mesaj: 'Geri bildirimin alındı, teşekkürler. Yanıt gerekirse e-postandan dönüş yapılacak.',
      });
    } catch (hata) {
      setDurum({
        tone: 'danger',
        mesaj: hata?.message ?? 'Gönderilemedi. İnternet bağlantını kontrol edip tekrar dene.',
      });
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <Screen edges={{ top: true, bottom: true }}>
      <PageHeader
        title="Geri bildirim"
        subtitle="Fikirlerin uygulamanın yönünü belirliyor"
        icon="chatbubble-ellipses"
        accent={ACCENT}
        right={<IconButton icon="close" accessibilityLabel="Kapat" onPress={() => router.back()} />}
      />

      {durum ? (
        <Banner tone={durum.tone} message={durum.mesaj} style={{ marginBottom: spacing.lg }} />
      ) : null}

      <Card>
        <Field
          label="Mesajın"
          value={mesaj}
          onChangeText={(metin) => setMesaj(metin.slice(0, MESAJ_MAX))}
          placeholder="Eksik bulduğun bir şey, bir hata ya da eklenmesini istediğin bir özellik…"
          multiline
          numberOfLines={6}
          accent={ACCENT}
          inputStyle={{ minHeight: 130, textAlignVertical: 'top', paddingTop: 12 }}
          style={{ marginBottom: spacing.sm }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: spacing.md,
          }}
        >
          <Text variant="caption" tone="faint">
            {yeterli ? 'Gönderilmeye hazır' : `En az ${MESAJ_MIN} karakter`}
          </Text>
          <Text
            variant="caption"
            color={kalan < 100 ? status.warning : color.textFaint}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {kalan}
          </Text>
        </View>

        <Button
          label="Gönder"
          icon="send-outline"
          accent={ACCENT}
          loading={gonderiliyor}
          disabled={!yeterli}
          onPress={gonder}
        />
      </Card>

      <Text
        variant="caption"
        tone="faint"
        style={{ textAlign: 'center', marginTop: spacing.lg, lineHeight: 17 }}
      >
        Mesajınla birlikte adın, e-postan ve kullandığın platform iletilir.
        Maaş veya harcama verilerin gönderilmez.
      </Text>
    </Screen>
  );
}
