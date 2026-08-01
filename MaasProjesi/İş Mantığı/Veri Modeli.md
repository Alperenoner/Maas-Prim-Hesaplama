---
tags: [is-mantigi, veri]
---

# Veri Modeli

## Cihazda — AsyncStorage

| Anahtar | Tür | İçerik |
|---|---|---|
| `maasKayitlari` | JSON dizi | Aylık maaş + prim kayıtları |
| `harcamaKayitlari` | JSON dizi | Harcama kalemleri |
| `kullaniciProfili` | JSON nesne | isim, soyisim, eposta |
| `temaTercihi` | metin | `system` / `light` / `dark` |
| `hatirlananMaas` | metin | Hatırlanan maaş tutarı |
| `maasiHatirla` | metin | `true` / `false` |
| `veriGocSurumu` | metin | Göç sürümü → [[Veri Göçü]] |

## Maaş kaydı şeması

```json
{
  "id": "msa9bao5-3-f7q2wd8a",
  "ay": "Temmuz 2026",
  "hamMaas": 42000,
  "hamToplam": 71190,
  "kurulumAdet": 12,  "kurulumPara": 12600,
  "haftaIciAdet": 6,  "haftaIciPara": 6300,
  "haftaSonuAdet": 4, "haftaSonuPara": 5880,
  "aracAdet": 3,      "aracPara": 4410,
  "ozet": "Kurulum: 12 · H. İçi: 6 · H. Sonu: 4 · Araç: 3"
}
```

## Harcama kaydı şeması

```json
{
  "id": "msa9bap1-7-k1h8hzrg",
  "ay": "Temmuz 2026",
  "isim": "Taksi",
  "tutar": 385,
  "gun": 26,
  "tarih": "26 Temmuz 2026",
  "saat": "23:40"
}
```

## Bulutta — Firestore

| Koleksiyon | Kimlik | Erişim |
|---|---|---|
| `yedekler/{uid}` | oturum UID'si | yalnızca sahibi |
| `kullanicilar/{uid}` | oturum UID'si | sahibi yazar, yönetici okur |
| `geribildirimler/{autoId}` | otomatik | herkes kendi adına yazar, yönetici okur |

Tanımlı olmayan her yol kapalı. Ayrıntı: [[Firestore Kuralları]]

## Kimlik üretimi

```
<zaman b36>-<sayaç b36>-<rastgele b36>
msa9bao5-3-f7q2wd8a
```

Üç katmanlı çakışma koruması ve kronolojik sıralanabilirlik.
Ayrıntı: [[ADR 002 expo-crypto kaldırıldı]]

İlgili: [[Veri Göçü]] · [[Veri Akışı]]
