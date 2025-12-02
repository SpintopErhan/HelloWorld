"use client";

import { useEffect, useState, useCallback } from "react";
// @farcaster/frame-sdk kütüphanesinin istemci tarafında yüklendiğinden emin olmak için
// import'u burada tutmak doğru. Sunucu tarafında hata vermemesi için "use client" önemli.
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // SDK'yı SADECE BİR KEZ Başlat (Initialize)
   // SDK'yı SADECE BİR KEZ Başlat (Initialize)
  useEffect(() => {
    const initSDK = async () => {
      if (!sdk) {
        console.warn("Farcaster SDK yüklenemedi.");
        return;
      }

      try {
        await sdk.actions.ready();     // BU SATIRA AWAIT EKLE!
        setIsSDKLoaded(true);
      } catch (err) {
        console.error("Farcaster SDK ready hatası:", err);
      }
    };

    initSDK();
  }, []);

  // src/app/page.tsx içinde
const handleCastButton = useCallback(async () => {
  if (!isSDKLoaded) return;

  try {
    // Manuel compose URL – text + embed URL
    const castText = "Hello World! Farcaster Miniapp’i dene!";
    const encodedCastText = encodeURIComponent(castText);
    
    const embedUrl = "https://helloworld-six-omega.vercel.app/";  // Senin domain'in
    const encodedEmbedUrl = encodeURIComponent(embedUrl);
    
    const finalComposeUrl = `https://farcaster.xyz/~/compose?text=${encodedCastText}&embeds[]=${encodedEmbedUrl}`;
    
    // SDK ile pencereyi aç
    await sdk.actions.openUrl(finalComposeUrl);
    
  //  alert("Cast hazırlandı! Embed ile birlikte atıldı 🎉");
  } catch (err) {
    console.error("Cast hatası:", err);
    alert("Cast açılamadı.");
  }
}, [isSDKLoaded]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-6">
        
        <h1 className="text-3xl font-bold tracking-tighter">
          Miniapp Demo
        </h1>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <p className="mb-6 text-slate-300">
            Aşağıdaki butona basarak Farcaster&apos;da bir selam gönderin!
          </p>

          <button
            onClick={handleCastButton}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold rounded-xl transition-all transform active:scale-95 text-lg"
            disabled={!isSDKLoaded} // SDK yüklenene kadar butonu devre dışı bırak.
          >
            📢 &quot;Hello World&quot; Cast At 
          </button>
        </div>

        {!isSDKLoaded && (
          <p className="text-xs text-gray-500 animate-pulse">
            Farcaster Bağlantısı Bekleniyor...
          </p>
        )}
        
      </div>
    </main>
  );
}