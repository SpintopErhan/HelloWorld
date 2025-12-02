"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // SDK hazır olunca otomatik olarak app ekleme isteği gönder
  useEffect(() => {
    const init = async () => {
      if (!sdk) return;

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);

        // SDK hazır olur olmaz otomatik olarak ekleme isteği gönder
        await sdk.actions.addMiniApp();
        console.log("addMiniApp called – prompt shown if not added yet");
      } catch (err) {
        console.error("SDK init or addMiniApp error:", err);
      }
    };

    init();
  }, []);

  const handleCast = useCallback(async () => {
    if (!isSDKLoaded) return;

    try {
      const result = await sdk.actions.composeCast({
        text: "Hello World from Farcaster Miniapp",
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });

      if (result?.cast) {
        console.log("Cast sent:", result.cast.hash);
      }
    } catch (err) {
      console.error("Cast error:", err);
    }
  }, [isSDKLoaded]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter">Miniapp Demo</h1>

        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
          <p className="mb-8 text-slate-300 text-lg">
            Welcome! Share this Miniapp with your friends
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
          <p className="text-sm text-slate-500 animate-pulse">
            Connecting to Farcaster...
          </p>
        )}
      </div>
    </main>
  );
}