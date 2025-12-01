// app/layout.tsx → KOPYALA-YAPIŞTIR YAP, HİÇ DOKUNMA

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bu satırı en üste koy, JSON'u burada oluşturuyoruz
  const fcMiniAppContent = JSON.stringify({
    version: "1",
    imageUrl: "https://helloworld-six-omega.vercel.app/frame_image.png",
    button: {
      title: "Miniapp'i Aç",
      action: {
        type: "launch_miniapp",
        name: "Hello World Miniapp",
        url: "https://helloworld-six-omega.vercel.app",
      },
    },
  });

  return (
    <html lang="tr">
      <head>
        {/* JSON.stringify ile oluşturduk → JSX hatası yok, Farcaster geçerli kabul ediyor */}
        <meta name="fc:miniapp" content={fcMiniAppContent} />

        {/* Geriye uyumluluk */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://helloworld-six-omega.vercel.app/frame_image.png" />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="og:image" content="https://helloworld-six-omega.vercel.app/frame_image.png" />
        <meta property="og:title" content="Hello World Miniapp" />
      </head>
      <body>{children}</body>
    </html>
  );
}