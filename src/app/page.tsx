"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      if (!sdk) {
        console.log("SDK yok");
        return;
      }

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
        await sdk.actions.addMiniApp();

        // TÜM CONTEXT'İ GÖR!
        console.log("TAM CONTEXT:", sdk.context);
        console.log("sdk.context.user:", (sdk.context as any).user);
        console.log("Tüm sdk objesi:", sdk);

        const userData = (sdk.context as any).user;

        if (userData && userData.fid) {
          console.log("KULLANICI BULUNDU:", userData);
          setUser(userData);
        } else {
          console.log("Kullanıcı bilgisi YOK veya fid eksik");
          setUser({ fid: 0, username: "Bilinmiyor", displayName: "Misafir" });
        }
      } catch (err) {
        console.error("SDK hatası:", err);
      }
    };

    init();
  }, []);

  const handleCast = useCallback(async () => {
    if (!isSDKLoaded) return;

    const text = user?.username
      ? `Hello from @${user.username} (FID: ${user.fid})`
      : "Hello World from Farcaster Miniapp";

    try {
      await sdk.actions.composeCast({
        text,
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });
    } catch (err) {
      console.error("Cast hatası:", err);
    }
  }, [isSDKLoaded, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-8">

        {/* KESİNLİKLE GÖRÜNECEK BİLGİ */}
        <div className="bg-red-900 p-6 rounded-3xl border-4 border-red-500">
          <p className="text-2xl font-bold">Kullanıcı Bilgisi:</p>
          {user ? (
            <>
              <p className="text-xl">İsim: {user.displayName || "Yok"}</p>
              <p className="text-lg">@{user.username || "Yok"}</p>
              <p className="text-lg">FID: {user.fid || "Yok"}</p>
            </>
          ) : (
            <p className="text-xl text-red-300 animate-pulse">Yükleniyor...</p>
          )}
        </div>

        <h1 className="text-4xl font-bold">Miniapp Demo</h1>

        <button
          onClick={handleCast}
          disabled={!isSDKLoaded}
          className="w-full py-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl"
        >
          {isSDKLoaded ? "Share on Farcaster" : "Bağlanıyor..."}
        </button>
      </div>
    </main>
  );
}