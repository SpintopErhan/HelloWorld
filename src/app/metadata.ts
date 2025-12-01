import type { Metadata } from 'next';

const appUrl = "https://helloworld-six-omega.vercel.app";

export const metadata: Metadata = {
  title: "Hello World Miniapp",
  description: "Farcaster'da ilk Miniapp deneyimin!",

  openGraph: {
    title: "Hello World Miniapp",
    description: "Tıkla ve Miniapp'i Farcaster içinde aç!",
    images: [`${appUrl}/frame_image.png`],
    url: appUrl,
  },

  // YENİ ve ZORUNLU: Miniapp embed için
  other: {
    // Miniapp olduğunu bildir
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${appUrl}/frame_image.png`,        // Embed'de görünecek büyük resim
      button: {
        title: "Miniapp'i Aç 🚀",                    // Cast altındaki buton yazısı
        action: {
          type: "launch_miniapp",                    // Bu çok önemli! Client içinde açar
          name: "Hello World Miniapp",
          // url: otomatik current page olur, yazmasan da olur
          splashImageUrl: `${appUrl}/frame_image.png`, // Açılırken splash ekranı (isteğe bağlı)
          splashBackgroundColor: "#1e1b4b"            // Mor tonu örnek (isteğe bağlı)
        }
      }
    }),

    // Geriye uyumluluk için eski frame tag'ini de bırak (zarar vermez)
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/frame_image.png`,
    // Buton eklemiyoruz çünkü Miniapp butonu fc:miniapp üstünden geliyor
  },
};