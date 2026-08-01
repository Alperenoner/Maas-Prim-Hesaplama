import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

/**
 * Firebase istemci yapılandırması ortam değişkenlerinden okunur.
 * `EXPO_PUBLIC_` önekli değişkenler pakete gömülür — bu değerler zaten
 * gizli değildir (istemci Firebase yapılandırması herkese açıktır);
 * verinin korunması `firestore.rules` dosyasındaki kurallarla sağlanır.
 * Ayrı dosyada tutulmalarının nedeni, projenin farklı Firebase ortamlarına
 * (geliştirme / üretim) kod değişikliği olmadan bağlanabilmesidir.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const eksikAlanlar = Object.entries(firebaseConfig)
  .filter(([, deger]) => !deger)
  .map(([alan]) => alan);

if (eksikAlanlar.length > 0) {
  throw new Error(
    `Firebase yapılandırması eksik: ${eksikAlanlar.join(', ')}.\n` +
      '`.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun, ' +
      'ardından geliştirme sunucusunu yeniden başlatın.'
  );
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * React Native'de oturumun uygulama yeniden açıldığında korunması için
 * AsyncStorage tabanlı kalıcılık şarttır. `getAuth()` varsayılan olarak
 * belleği kullanır — o durumda her açılışta yeni bir anonim UID üretilir
 * ve UID ile anahtarlanan bulut yedeğine erişilemez.
 */
function authOlustur() {
  if (Platform.OS === 'web') return getAuth(app);

  try {
    // `getReactNativePersistence` yalnızca react-native derlemesinde bulunur,
    // bu yüzden statik import yerine koşullu require kullanılıyor.
    const { getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (hata) {
    // Fast Refresh sırasında initializeAuth ikinci kez çağrılırsa buraya düşer.
    return getAuth(app);
  }
}

export const auth = authOlustur();
export const db = getFirestore(app);
