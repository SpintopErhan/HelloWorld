"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

type UserData = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
};

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!sdk) return;

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);

        // Otomatik app ekleme
        await sdk.actions.addMiniApp();

        // Kullanıcı bilgilerini çek
        const userData = await sdk.actions.getUserData();
        setUser({
          fid: userData.fid,
          username: userData.username,
          displayName: userData.displayName || userData.username,
          pfpUrl: userData.pfpUrl,
        });

        console.log("User loaded:", userData);
      } catch (err) {
        console.error("SDK init error:", err);
      }
    };

    init();
  }, []);

  const handleCast = useCallback(async () => {
    if (!isSDKLoaded || !user) return;

    try {
      await sdk.actions.composeCast({
        text: `Hello from @${user.username}! I'm using this Miniapp`,
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });
    } catch (err) {
      console.error("Cast error:", err);
    }
  }, [isSDKLoaded, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md">

        {/* Kullanıcı Profili */}
        {user && (
          <div className="flex items-center gap-4 mb-8 bg-slate-800 p-4 rounded-2xl">
            <img
              src={user.pfpUrl}
              alt={user.displayName}
              className="w-16 h-16 rounded-full border-4 border-purple-600"
            />
            <div>
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <p className="text-slate-400">@{user.username} • FID: {user.fid}</p>
            </div>
          </div>
        )}

        {/* Ana İçerik */}
        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 text-center">
          <h1 className="text-4xl font-bold mb-6">Miniapp Demo</h1>
          <p className="text-slate-300 mb-8 text-lg">
            Welcome {user ? user.displayName.split(" ")[0] : ""}! 
            Share this app with your friends
          </p>

          <button
            onClick={handleCast}
            disabled={!isSDKLoaded}
            className="w-full py-5 px-8 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isSDKLoaded ? "Share on Farcaster" : "Loading..."}
          </button>
        </div>

        {!isSDKLoaded && (
          <p className="text-sm text-slate-500 animate-pulse mt-6">
            Connecting to Farcaster...
          </p>
        )}
      </div>
    </main>
  );
}