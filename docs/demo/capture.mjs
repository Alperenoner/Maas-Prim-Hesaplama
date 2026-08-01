#!/usr/bin/env node
/**
 * Dokümantasyon ekran görüntülerini üretir.
 *
 * Chrome'u başsız modda açar ve DevTools Protokolü üzerinden sürer.
 * `--screenshot` bayrağı yerine CDP kullanılmasının nedeni: bayrak,
 * uygulama paketi çalışmadan önce kareyi yakalıyor. Burada her ekran için
 * beklenen bir metnin DOM'a gelmesi bekleniyor, sonra kare alınıyor.
 *
 * Kullanım:
 *   node docs/demo/capture.mjs              # derler, sunar, yakalar
 *   node docs/demo/capture.mjs --skip-build # mevcut dist/ ile yakalar
 */

import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BURASI = dirname(fileURLToPath(import.meta.url));
const KOK = resolve(BURASI, '../..');
const CIKTI = join(BURASI, 'screens');
const PORT = Number(process.env.PORT ?? 8123);
const CDP_PORT = Number(process.env.CDP_PORT ?? 9333);
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const GENISLIK = 430;
const YUKSEKLIK = 932;
const OLCEK = 2;

/**
 * Erişilebilirlik etiketiyle bir düğmeye N kez tıklayan yardımcı betik.
 * Ekranların boş görünmemesi için demo verisini arayüz üzerinden dolduruyoruz.
 */
const tikla = (etiket, kez = 1) => `
  (async () => {
    for (let i = 0; i < ${kez}; i += 1) {
      // Düğme her turda yeniden sorgulanır ve React'in yeniden çizmesi beklenir;
      // aksi hâlde ardışık tıklamalar aynı durum üzerinde çalışıp tek artış yapar.
      const dugme = document.querySelector('[aria-label="${etiket}"]');
      if (!dugme) return 'bulunamadı: ${etiket}';
      dugme.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((c) => setTimeout(c, 110));
    }
    return 'ok';
  })()
`;

/** Maaş ekranını gerçekçi bir hesapla doldur. */
const MAAS_EYLEMI = [
  tikla('Kurulum artır', 12),
  tikla('Hafta İçi Nöbet artır', 6),
  tikla('Hafta Sonu Nöbet artır', 4),
  tikla('Araç Nöbeti artır', 3),
];

/** Yakalanacak ekranlar: [dosya adı, rota, tema, beklenen metin, eylemler?] */
const EKRANLAR = [
  ['01-maas-acik', '', 'light', 'Prim kalemleri', MAAS_EYLEMI],
  ['02-harcamalar-acik', 'expenses', 'light', 'Yeni harcama'],
  ['03-hizli-acik', 'explore', 'light', 'Hazır senaryolar'],
  ['04-gecmis-acik', 'history', 'light', 'AYLAR'],
  ['05-profil-acik', 'profil', 'light', 'Bulut yedeği'],
  ['06-geribildirim-acik', 'feedback', 'light', 'Konu nedir?', [tikla('Bir hata var')]],
  ['07-kayit-acik', 'kayit', 'light', 'Prim Hesaplama'],
  ['08-maas-koyu', '', 'dark', 'Prim kalemleri', MAAS_EYLEMI],
  ['09-harcamalar-koyu', 'expenses', 'dark', 'Yeni harcama'],
  ['10-gecmis-koyu', 'history', 'dark', 'AYLAR'],
  ['11-hizli-koyu', 'explore', 'dark', 'Hazır senaryolar'],
  ['12-profil-koyu', 'profil', 'dark', 'Bulut yedeği'],
  ['13-geribildirim-koyu', 'feedback', 'dark', 'Konu nedir?', [tikla('Bir hata var')]],
];

const bekle = (ms) => new Promise((c) => setTimeout(c, ms));

/* ------------------------------------------------------------------ *
 * Minimal CDP istemcisi (Node 22+ yerleşik WebSocket ile)
 * ------------------------------------------------------------------ */
class Cdp {
  constructor(soket) {
    this.soket = soket;
    this.sonId = 0;
    this.bekleyenler = new Map();
    this.konsolHatalari = [];

    soket.addEventListener('message', (olay) => {
      const veri = JSON.parse(olay.data);
      if (veri.id && this.bekleyenler.has(veri.id)) {
        const { coz, red } = this.bekleyenler.get(veri.id);
        this.bekleyenler.delete(veri.id);
        veri.error ? red(new Error(veri.error.message)) : coz(veri.result);
      }
      if (veri.method === 'Runtime.exceptionThrown') {
        const ayrinti = veri.params?.exceptionDetails;
        this.konsolHatalari.push(ayrinti?.exception?.description ?? ayrinti?.text ?? 'bilinmeyen');
      }
    });
  }

  static async bagla(hedefUrl) {
    const soket = new WebSocket(hedefUrl);
    await new Promise((coz, red) => {
      soket.addEventListener('open', coz, { once: true });
      soket.addEventListener('error', () => red(new Error('CDP bağlantısı kurulamadı')), { once: true });
    });
    return new Cdp(soket);
  }

  gonder(method, params = {}) {
    const id = ++this.sonId;
    this.soket.send(JSON.stringify({ id, method, params }));
    return new Promise((coz, red) => {
      this.bekleyenler.set(id, { coz, red });
      setTimeout(() => {
        if (this.bekleyenler.delete(id)) red(new Error(`${method} zaman aşımına uğradı`));
      }, 30000);
    });
  }

  async degerlendir(ifade) {
    const sonuc = await this.gonder('Runtime.evaluate', {
      expression: ifade,
      returnByValue: true,
      awaitPromise: true,
    });
    return sonuc?.result?.value;
  }

  kapat() {
    this.soket.close();
  }
}

/* ------------------------------------------------------------------ *
 * Akış
 * ------------------------------------------------------------------ */
async function main() {
  const derlemeyiAtla = process.argv.includes('--skip-build');

  if (!derlemeyiAtla) {
    console.log('→ Web sürümü derleniyor…');
    // `--clear`: Metro önbelleği bayat kaldığında `process.env.EXPO_PUBLIC_*`
    // değerleri pakete `undefined` olarak gömülüyor ve uygulama açılışta
    // "Firebase yapılandırması eksik" hatasıyla çöküyor.
    const sonuc = spawnSync('npx', ['expo', 'export', '--platform', 'web', '--clear'], {
      cwd: KOK,
      stdio: 'ignore',
    });
    if (sonuc.status !== 0) throw new Error('expo export başarısız oldu');
  }

  copyFileSync(join(BURASI, 'seed.html'), join(KOK, 'dist', '__seed.html'));
  mkdirSync(CIKTI, { recursive: true });

  console.log(`→ Sunucu :${PORT} üzerinde başlatılıyor…`);
  const sunucu = spawn('python3', [join(BURASI, 'serve.py'), join(KOK, 'dist'), String(PORT)], {
    stdio: 'ignore',
  });

  const profil = mkdtempSync(join(tmpdir(), 'ss-chrome-'));
  console.log('→ Chrome başlatılıyor…');
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-first-run',
      '--disable-extensions',
      `--user-data-dir=${profil}`,
      `--remote-debugging-port=${CDP_PORT}`,
      `--window-size=${GENISLIK},${YUKSEKLIK}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  const temizle = () => {
    chrome.kill();
    sunucu.kill();
    try {
      rmSync(join(KOK, 'dist', '__seed.html'), { force: true });
      rmSync(profil, { recursive: true, force: true });
    } catch {}
  };
  process.on('exit', temizle);

  // CDP hazır olana kadar bekle
  let hedef = null;
  for (let deneme = 0; deneme < 40; deneme += 1) {
    await bekle(300);
    try {
      const yanit = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const sayfalar = await yanit.json();
      hedef = sayfalar.find((s) => s.type === 'page');
      if (hedef) break;
    } catch {}
  }
  if (!hedef) throw new Error('Chrome DevTools uç noktası bulunamadı');

  const cdp = await Cdp.bagla(hedef.webSocketDebuggerUrl);
  await cdp.gonder('Page.enable');
  await cdp.gonder('Runtime.enable');
  await cdp.gonder('Emulation.setDeviceMetricsOverride', {
    width: GENISLIK,
    height: YUKSEKLIK,
    deviceScaleFactor: OLCEK,
    mobile: true,
  });

  console.log('→ Ekranlar yakalanıyor…');
  let basarili = 0;

  for (const [ad, rota, tema, beklenen, eylemler] of EKRANLAR) {
    process.stdout.write(`   · ${ad.padEnd(22)}`);
    cdp.konsolHatalari.length = 0;

    const url = `http://127.0.0.1:${PORT}/__seed.html?hedef=${rota}&tema=${tema}`;
    await cdp.gonder('Page.navigate', { url });

    // Beklenen metin DOM'a gelene kadar bekle (en fazla ~15 sn)
    let hazir = false;
    for (let deneme = 0; deneme < 60; deneme += 1) {
      await bekle(250);
      const bulundu = await cdp
        .degerlendir(`document.body && document.body.innerText.includes(${JSON.stringify(beklenen)})`)
        .catch(() => false);
      if (bulundu) {
        hazir = true;
        break;
      }
    }

    // Ekranı gerçekçi bir duruma getir (varsa)
    if (hazir && eylemler) {
      for (const betik of eylemler) {
        await cdp.degerlendir(betik).catch(() => {});
      }
      await bekle(500);
    }

    // Animasyonların oturması için kısa bir pay
    await bekle(700);

    const kare = await cdp.gonder('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(CIKTI, `${ad}.png`), Buffer.from(kare.data, 'base64'));

    if (hazir) {
      basarili += 1;
      console.log('✓');
    } else {
      console.log(`✗  ("${beklenen}" bulunamadı)`);
      if (cdp.konsolHatalari.length > 0) {
        console.log(`     hata: ${cdp.konsolHatalari[0].split('\n')[0]}`);
      }
    }
  }

  cdp.kapat();
  console.log(`\n${basarili}/${EKRANLAR.length} ekran yakalandı → ${CIKTI}`);
  temizle();
  process.exit(basarili === EKRANLAR.length ? 0 : 1);
}

main().catch((hata) => {
  console.error('Hata:', hata.message);
  process.exit(1);
});
