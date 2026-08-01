#!/usr/bin/env python3
"""
Expo web çıktısı için basit statik sunucu (SPA modu).

`app.json` içinde `web.output: "single"` olduğu için `expo export`
tek bir `index.html` üretir ve yönlendirme tamamen istemcide yapılır.
Bu sunucu, var olmayan yolları `index.html`'e düşürerek (SPA fallback)
`/expenses`, `/history` gibi derin bağlantıların çalışmasını sağlar.

Kullanım:  python3 docs/demo/serve.py <dizin> <port>
"""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SpaHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        yerel = super().translate_path(path)

        if os.path.isfile(yerel):
            return yerel

        # Dizin isteği → içindeki index.html
        if os.path.isdir(yerel):
            indeks = os.path.join(yerel, "index.html")
            if os.path.isfile(indeks):
                return indeks

        # `/expenses` → `expenses.html` (statik çıktıyla da uyumlu kalsın)
        adayi = yerel.rstrip("/") + ".html"
        if os.path.isfile(adayi):
            return adayi

        # SPA fallback — varlık dosyaları hariç her şey index.html'e düşer.
        if not os.path.splitext(yerel)[1]:
            kok = getattr(self, "directory", os.getcwd())
            return os.path.join(kok, "index.html")

        return yerel

    def log_message(self, *args):
        pass  # sessiz


def main():
    dizin = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8123

    handler = partial(SpaHandler, directory=dizin)
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as sunucu:
        print(f"http://127.0.0.1:{port} → {dizin}", flush=True)
        sunucu.serve_forever()


if __name__ == "__main__":
    main()
