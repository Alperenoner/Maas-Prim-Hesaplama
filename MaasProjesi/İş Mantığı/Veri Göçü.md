---
tags: [is-mantigi, veri, goc]
dosya: lib/storage.js
---

# Veri Göçü

Mevcut kullanıcıların verisi eski şemadaydı. `veriGocunuCalistir()` açılışta
bir kez çalışır ve v0 → v2 dönüşümünü yapar.

## Ne değişti

| v0 | v2 | Neden |
|---|---|---|
| `toplam: "42.150,00"` (metin) | `hamToplam: 42150` (sayı) | Metinden hesap yapılamıyordu |
| `rawMaas: "30000"` (metin) | `hamMaas: 30000` (sayı) | Aynı |
| `id: Math.random()...` | `id: <zaman>-<sayaç>-<rastgele>` | Çakışma riski |
| `seciliTema` | `temaTercihi` | `system` seçeneği eklendi |
| `saklananMaas` | `hatirlananMaas` | Adlandırma tutarlılığı |
| Harcamada saat isme gömülü | Ayrı `saat` alanı | Sıralama ve gösterim |

## Nasıl çalışıyor

```js
const surum = await AsyncStorage.getItem(STORAGE_KEYS.gocSurumu);
if (surum === GUNCEL_GOC_SURUMU) return { calisti: false };
```

Sürüm damgası sayesinde **birden çok kez çağrılması güvenli**.

Adımlar:

1. Eski tema tercihi yeni anahtara taşınır
2. Maaş hatırlama ayarı taşınır
3. Kayıtlar normalleştirilir (`maasKaydiniNormallestir`)
4. **Kimlik çakışmaları çözülür** — aynı kimlikli kayıtlara yenisi verilir
5. Eski anahtarlar silinir
6. Sürüm damgası yazılır

## Normalleştirme her okumada da çalışır

```js
export async function maasKayitlariniOku() {
  const ham = await jsonOku(STORAGE_KEYS.maasKayitlari, []);
  return ayaGoreSirala(listeNormallestir(ham, maasKaydiniNormallestir));
}
```

Yani göç çalışmasa bile eski biçimli bir kayıt okunduğunda doğru şemaya
çevrilir. Bu, buluttan gelen eski yedekler için de geçerli.

> [!success] Neden bu tasarım
> Göç tek seferlik bir betik olsaydı, buluttan gelen eski veri veya
> yarım kalmış bir göç uygulamayı bozardı. Normalleştirmeyi okuma yoluna
> koymak bu senaryoları da kapsıyor.

İlgili: [[Veri Modeli]] · [[Veri Akışı]]
