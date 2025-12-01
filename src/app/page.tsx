"use client";

import { useEffect, useState, useCallback } from "react";
// @farcaster/frame-sdk kütüphanesinin istemci tarafında yüklendiğinden emin olmak için
// import'u burada tutmak doğru. Sunucu tarafında hata vermemesi için "use client" önemli.
import sdk from "@farcaster/frame-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // SDK'yı SADECE BİR KEZ Başlat (Initialize)
  useEffect(() => {
    // SDK'ya uygulamanın hazır olduğunu bildir
    // Bu işlem yalnızca client tarafında çalışmalıdır.
    // Next.js'de "use client" ile bu garanti edilir.
    if (sdk) { // SDK nesnesinin varlığını kontrol etmek her zaman iyi bir pratiktir.
      sdk.actions.ready(); 
      setIsSDKLoaded(true);
    } else {
      console.warn("Farcaster SDK yüklenemedi veya kullanıma hazır değil.");
      // Hata durumunu yönetmek için burada isSDKLoaded'ı false bırakabiliriz
      // veya bir error state'i tutabiliriz.
    }
    // Boş bağımlılık dizisi, bu efektin sadece bileşen mount edildiğinde bir kez çalışmasını sağlar.
  }, []); 

  // src/app/page.tsx içinde
const handleCastButton = useCallback(() => {
    
    // 1. Paylaşılacak Metin (URL Encode Edilmiş Hali)
    const castText = "Hello World";
    const encodedCastText = encodeURIComponent(castText);
    
    // 2. Uygulamanın Gömüleceği URL (Miniapp'in Kendi Adresi)
    // Bu, Cast altında görünecek uygulama penceresini temsil eder.
    const embedUrl = "https://helloworld-six-omega.vercel.app/";
    const encodedEmbedUrl = encodeURIComponent(embedUrl);
    
    // 3. İKİ BİLGİYİ İÇEREN Compose URL'si
    // a) text parametresi: Cast metni
    // b) embed parametresi: Cast altına gömülecek URL
    const finalComposeUrl = `https://farcaster.xyz/~/compose?text=${encodedCastText}&embeds[]=${encodedEmbedUrl}`; 
    
    // 4. Warpcast penceresini açar
    // Artık sadece bu tek URL'yi açmanız yeterli.
    if (sdk) { 
        sdk.actions.openUrl(finalComposeUrl);
    } else {
        console.error("Farcaster SDK henüz yüklenmedi.");
    }
}, []);

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