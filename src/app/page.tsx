// app/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useFarcasterMiniApp } from "@/hooks/useFarcasterMiniApp"; // Import your hook

export default function Home() {
  const { user, status, error, composeCast } = useFarcasterMiniApp();

  const [castText, setCastText] = useState<string>("");
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [castError, setCastError] = useState<string | null>(null);
  const [castSuccess, setCastSuccess] = useState<boolean>(false);

  // If you want to automatically cast on page load or user login, uncomment this:
  /*
  useEffect(() => {
    if (status === "loaded" && user.fid !== ANONYMOUS_USER.fid && !hasCastedOnce.current) {
      hasCastedOnce.current = true; // To cast only once
      composeCast("Hello Farcaster! #miniapp").catch(console.error);
    }
  }, [status, user.fid, composeCast]);
  */

  const handleComposeCast = async (e: FormEvent) => {
    e.preventDefault();
    if (!castText.trim()) {
      setCastError("Please enter some text."); // Translated
      return;
    }

    setCastError(null);
    setCastSuccess(false);
    setIsCasting(true);

    try {
      // Using the composeCast function
      await composeCast(castText);
      setCastText(""); // Clear text on success
      setCastSuccess(true);
      console.log("Cast sent successfully!"); // Translated (for console)
    } catch (err: unknown) {
      console.error("Error casting:", err); // Translated (for console)
      if (err instanceof Error) {
        setCastError(err.message);
      } else {
        setCastError("An unknown error occurred while casting."); // Translated
      }
    } finally {
      setIsCasting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Farcaster MiniApp</h1>

      <div className="mb-6 text-lg text-center">
        {status === "loading" && <p className="text-yellow-400">Loading Farcaster SDK...</p>} {/* Translated */}
        {status === "error" && <p className="text-red-500">Error: {error?.message || "An unknown error occurred."}</p>} {/* Translated */}
        {status === "loaded" && (
          <p>
            Welcome,{" "} {/* Translated */}
            <span className="font-semibold text-green-400">
              {user.displayName}
            </span>{" "}
            (FID: {user.fid})
          </p>
        )}
        {user.fid === 0 && ( // Assuming ANONYMOUS_USER.fid is 0 or similar by default
          <p className="text-red-300 mt-2">
            You might need to log in to Farcaster to use the MiniApp. {/* Translated */}
          </p>
        )}
      </div>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create New Cast</h2> {/* Translated */}
        <form onSubmit={handleComposeCast} className="flex flex-col gap-4">
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            rows={4}
            placeholder="What's on your mind?" // Translated
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
            {isCasting ? "Sending..." : "Cast"} {/* Translated */}
          </button>
        </form>

        {castError && (
          <p className="mt-4 text-red-400 text-center">{castError}</p>
        )}
        {castSuccess && // Parantezler kaldırıldı
          <p className="mt-4 text-green-400 text-center">Cast sent successfully!</p>
        }
      </div>
    </div>
  );
}