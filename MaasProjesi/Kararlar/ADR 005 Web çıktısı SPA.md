---
tags: [karar, web]
durum: uygulandi
tarih: 2026-08-01
---

# ADR 005 — Web çıktısı SPA

## Bağlam

`app.json` içinde `web.output: "static"` vardı. Bu ayar her rota için ayrı bir
HTML üretiyor ve React ağacını sunucuda ön-render ediyor.

Ancak uygulama açılışta yerel veriyi okuyup bir yükleme kapısı gösteriyor.
`useEffect` sunucuda çalışmadığı için ön-render edilen 13 sayfanın hepsi
**boş yükleme göstergesinden** ibaretti. Üstelik istemci hidrasyonu bu ön-render
ile uyuşmuyordu:

```
Minified React error #418 — Hydration failed
```

## Karar

```json
"web": { "output": "single", "bundler": "metro" }
```

Tek `index.html`, yönlendirme tamamen istemcide.

## Gerekçe

- Uygulama kullanıcıya özel ve kimlik doğrulaması gerektiriyor — SEO faydası yok
- Ön-render edilen içerik zaten boştu
- Hidrasyon uyuşmazlığı ortadan kalktı

## Sonuç

Sunum için SPA fallback gerekiyor: var olmayan yollar `index.html`'e düşmeli.
`docs/demo/serve.py` bunu yapıyor.

İlgili: [[Yönlendirme]] · [[Ekran Görüntüsü Üretimi]]
