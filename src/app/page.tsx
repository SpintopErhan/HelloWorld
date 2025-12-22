// app/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useFarcasterMiniApp } from "@/hooks/useFarcasterMiniApp"; // Hook'unuzu import edin

export default function Home() {
  const { user, status, error, composeCast } = useFarcasterMiniApp();

  const [castText, setCastText] = useState<string>("");
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [castError, setCastError] = useState<string | null>(null);
  const [castSuccess, setCastSuccess] = useState<boolean>(false);

  // Sayfa yüklendiğinde veya kullanıcı oturumu açıldığında otomatik olarak bir cast atmak isterseniz:
  /*
  useEffect(() => {
    if (status === "loaded" && user.fid !== ANONYMOUS_USER.fid && !hasCastedOnce.current) {
      hasCastedOnce.current = true; // Sadece bir kez atmak için
      composeCast("Merhaba Farcaster! #miniapp").catch(console.error);
    }
  }, [status, user.fid, composeCast]);
  */

  const handleComposeCast = async (e: FormEvent) => {
    e.preventDefault();
    if (!castText.trim()) {
      setCastError("Lütfen bir metin girin.");
      return;
    }

    setCastError(null);
    setCastSuccess(false);
    setIsCasting(true);

    try {
      // composeCast fonksiyonunu kullanıyoruz
      await composeCast(castText);
      setCastText(""); // Başarılı olursa metni temizle
      setCastSuccess(true);
      console.log("Cast başarıyla atıldı!");
    } catch (err: unknown) { // Hata düzeltme: 'any' yerine 'unknown' kullanıldı
      console.error("Cast atılırken hata oluştu:", err);
      // Hata nesnesini kontrol ederek mesajına erişiyoruz
      if (err instanceof Error) {
        setCastError(err.message);
      } else {
        setCastError("Cast atılırken bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsCasting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Farcaster MiniApp</h1>

      <div className="mb-6 text-lg text-center">
        {status === "loading" && <p className="text-yellow-400">Farcaster SDK yükleniyor...</p>}
        {status === "error" && <p className="text-red-500">Hata: {error?.message || "Bilinmeyen bir hata oluştu."}</p>}
        {status === "loaded" && (
          <p>
            Hoş geldin,{" "}
            <span className="font-semibold text-green-400">
              {user.displayName}
            </span>{" "}
            (FID: {user.fid})
          </p>
        )}
        {user.fid === 0 && ( // ANONYMOUS_USER.fid varsayılan olarak 0 veya benzeri bir değerse
          <p className="text-red-300 mt-2">
            MiniApp&apos;i kullanabilmek için Farcaster&apos;da oturum açmanız gerekebilir. {/* Hata düzeltme: Tek tırnaklar kaçıldı */}
          </p>
        )}
      </div>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Yeni Cast Oluştur</h2>
        <form onSubmit={handleComposeCast} className="flex flex-col gap-4">
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            rows={4}
            placeholder="Ne düşünüyorsun?"
            value={castText}
            onChange={(e) => setCastText(e.target.value)}
            disabled={status !== "loaded" || user.fid === 0 || isCasting}
          ></textarea>
          <button
            type="submit"
            className={`py-3 px-6 rounded-md font-bold text-white transition-colors duration-200 ${
              status !== "loaded" || user.fid === 0 || isCasting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={status !== "loaded" || user.fid === 0 || isCasting}
          >
            {isCasting ? "Gönderiliyor..." : "Cast At"}
          </button>
        </form>

        {castError && (
          <p className="mt-4 text-red-400 text-center">{castError}</p>
        )}
        {castSuccess && (
          <p className="mt-4 text-green-400 text-center">Cast başarıyla gönderildi!</p>
        )}
      </div>
    </div>
  );
}