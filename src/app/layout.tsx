// app/layout.tsx → %100 ÇALIŞACAK SON HALİ

import "./globals.css";

export const metadata = {
  title: "Hello World Miniapp",
  description: "Farcaster Miniapp Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* YOINK GİBİ – KESİN ÇALIŞIR JSON */}
        <meta
          name="fc:miniapp"
content={"{\"version\":\"1\",\"imageUrl\":\"https://helloworld-six-omega.vercel.app/frame_image.png\",\"button\":{\"title\":\"Miniapp'i Aç 🚀\",\"action\":{\"type\":\"launch_miniapp\",\"name\":\"Hello World Miniapp\",\"url\":\"https://helloworld-six-omega.vercel.app\",\"splashImageUrl\":\"https://helloworld-six-omega.vercel.app/frame_image.png\",\"splashBackgroundColor\":\"#1e1b4b\"}}}"}    
    />

        {/* Geriye uyumluluk – eski client’lar için */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://helloworld-six-omega.vercel.app/frame_image.png" />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

        {/* OG tags */}
        <meta property="og:image" content="https://helloworld-six-omega.vercel.app/frame_image.png" />
        <meta property="og:title" content="Hello World Miniapp" />
      </head>
      <body>{children}</body>
    </html>
  );
}