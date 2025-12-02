"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      if (!sdk) return;

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
        await sdk.actions.addMiniApp();

        // YENİ YÖNTEM: user_loaded event’ini dinle
        const onUserLoaded = (event: any) => {
          console.log("user_loaded event geldi:", event.detail);
          const userData = event.detail?.user;
          if (userData?.fid) {
            setUser({
              fid: userData.fid,
              username: userData.username || "anonymous",
              displayName: userData.displayName || userData.username || "User",
            });
          }
        };

        // Event dinleyicisi ekle
        window.addEventListener("user_loaded", onUserLoaded as EventListener);

        // Eğer event zaten atıldıysa hemen çek
        const contextUser = (sdk.context as any)?.user;
        if (contextUser?.fid) {
          onUserLoaded({ detail: { user: contextUser } } as any);
        }

        return () => {
          window.removeEventListener("user_loaded", onUserLoaded as EventListener);
        };
      } catch (err) {
        console.error("SDK init error:", err);
      }
    };

    init();
  }, []);

  const handleCast = useCallback(async () => {
    if (!isSDKLoaded) return;

    const text = user
      ? `Hello from @${user.username}! (FID: ${user.fid})`
      : "Hello World from Farcaster Miniapp";

    try {
      await sdk.actions.composeCast({
        text,
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });
    } catch (err) {
      console.error("Cast error:", err);
    }
  }, [isSDKLoaded, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-8">

        {/* PROFİL – KESİNLİKLE ÇIKACAK */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-8 rounded-3xl shadow-2xl border-4 border-purple-500">
          {user ? (
            <>
              <p className="text-3xl font-bold mb-2">{user.displayName}</p>
              <p className="text-xl text-purple-200">@{user.username}</p>
              <p className="text-lg text-purple-300">FID: {user.fid}</p>
            </>
          ) : (
            <p className="text-2xl animate-pulse">Profil yükleniyor...</p>
          )}
        </div>

        <h1 className="text-4xl font-bold">Miniapp Demo</h1>

        <button
          onClick={handleCast}
          disabled={!isSDKLoaded}
          className="w-full py-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl shadow-lg"
        >
          {isSDKLoaded ? "Share on Farcaster" : "Bağlanıyor..."}
        </button>
      </div>
    </main>
  );
}