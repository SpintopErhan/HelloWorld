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

  const handleCastButton = useCallback(() => {
    // Farcaster Compose Intent URL'si
    // Metni bir sabit değişkende tutmak veya dinamik hale getirmek daha iyi olabilir.
    const castText = "Hello World";
    const encodedCastText = encodeURIComponent(castText);
    const castUrl = `https://farcaster.xyz/~/compose?text=${encodedCastText}`; 
    
    // Warpcast penceresini açar.
    if (sdk) { // SDK'nın yüklenip yüklenmediğini tekrar kontrol etmek daha güvenli olabilir.
        sdk.actions.openUrl(castUrl);
    } else {
        console.error("Farcaster SDK henüz yüklenmedi, URL açılamıyor.");
        // Kullanıcıya bir hata mesajı gösterebiliriz.
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