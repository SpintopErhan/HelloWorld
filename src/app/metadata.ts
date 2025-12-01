import type { Metadata } from 'next';

// Uygulamanızın canlı URL'sini sabitleyelim
const appUrl = "https://helloworld-six-omega.vercel.app/";

export const metadata: Metadata = {
  // 1. Temel SEO ve Tarayıcı Etiketleri
  title: 'Hello World Farcaster Miniapp',
  description: 'Farcaster üzerinde "Hello World" mesajı paylaşın!',
  
  // 2. Open Graph Etiketleri (Genel Sosyal Medya Paylaşımı için)
  openGraph: {
    title: 'Hello World Farcaster Miniapp',
    description: 'Hemen aç ve ilk Cast’ini at!',
    images: [`${appUrl}frame_image.png`],
    url: appUrl,
  },

  // 3. Farcaster Frame Metadata Etiketleri (Embedding için KRİTİK)
 other: {
    // ...
    'fc:frame:button:1': 'Uygulamayı Başlat (Launch App)', 
    'fc:frame:button:1:action': 'post_redirect', // DEĞİŞTİRİLDİ: 'link' yerine 'post_redirect'
    'fc:frame:button:1:target': appUrl, 
    
    // Uygulamanın ana URL'sini post adresi olarak ekliyoruz
    // Bu, Farcaster'ı bu URL'yi dahili olarak işlemesi için zorlar.
    'fc:frame:post_url': appUrl, 
  }
};

export default metadata;