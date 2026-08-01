import * as Crypto from 'expo-crypto';

/**
 * Çakışmaya kapalı kayıt kimliği.
 * Önceki sürüm `Math.random().toString()` kullanıyordu; aynı milisaniyede
 * üretilen iki kayıt aynı kimliği alabiliyordu ve kimlikler sıralanabilir değildi.
 */
export function yeniId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return Crypto.randomUUID();
}
