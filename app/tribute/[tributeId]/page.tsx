"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Tribute = {
  tribute_id: string;
  fan_name: string;
  country_name: string;
  message: string;
  created_at: string;
};

export default function TributePage() {
  const params = useParams();
  const tributeId = params?.tributeId as string;

  const [tribute, setTribute] = useState<Tribute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTribute() {
      if (!tributeId) return;

      const { data, error } = await supabase
        .from("tributes")
        .select(
          "tribute_id, fan_name, country_name, message, created_at"
        )
        .eq("tribute_id", tributeId)
        .eq("status", "approved")
        .single();

      if (!error && data) {
        setTribute(data);
      }

      setLoading(false);
    }

    loadTribute();
  }, [tributeId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-white/50">Loading tribute...</p>
      </main>
    );
  }

  if (!tribute) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute not found
          </p>

          <h1 className="mt-4 text-5xl font-black">
            This memory does not exist.
          </h1>

          <a
            href="/"
            className="mt-8 inline-block rounded-full bg-[#d6ff00] px-6 py-3 font-black text-black"
          >
            Back to TributeToMessi
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center sm:p-14">
          {/* HEADER */}

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute to Messi
          </p>

          <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">
            {tribute.fan_name}
          </h1>

          <p className="mt-3 text-white/50">
            {tribute.country_name}
          </p>

          {/* MESSAGE */}

          <div className="mx-auto mt-12 max-w-2xl">
            <p className="text-2xl font-bold leading-relaxed sm:text-4xl">
              “{tribute.message}”
            </p>
          </div>

          {/* TRIBUTE ID */}

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
              Tribute ID
            </p>

            <p className="mt-2 font-bold text-[#d6ff00]">
              {tribute.tribute_id}
            </p>
          </div>

          {/* ACTIONS */}

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {/* LEAVE YOUR OWN MESSAGE */}

            <a
              href="/"
              className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-7 text-center transition hover:border-[#d6ff00]/40 hover:bg-white/[0.06]"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
                Join the Wall
              </p>

              <p className="mt-3 text-xl font-black">
                Leave Your Own Message →
              </p>

              <p className="mt-2 text-sm text-white/40">
                Add your own tribute to Messi
              </p>
            </a>

            {/* PRODUCT 2 */}

            <a
              href={`/tribute-card?tributeId=${tribute.tribute_id}`}
              className="rounded-3xl bg-[#d6ff00] px-6 py-7 text-center text-black transition hover:scale-[1.01]"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] opacity-60">
                Your Personal Card
              </p>

              <p className="mt-3 text-xl font-black">
                Create My Tribute Card →
              </p>

              <p className="mt-2 text-sm font-semibold opacity-60">
                Download your personalized card
              </p>

              <div className="mt-4 flex items-center justify-center gap-4 text-sm font-black">
                <span>₹299 · UPI</span>
                <span className="opacity-40">|</span>
                <span>$4.99 · PayPal</span>
              </div>
            </a>
          </div>

          {/* SHARING */}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* X */}

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `I left my Messi tribute on TributeToMessi.online ❤️⚽\n\nhttps://tributetomessi.online/tribute/${tribute.tribute_id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-lg font-black text-white transition hover:border-[#d6ff00]/50 hover:text-[#d6ff00]"
            >
              𝕏
            </a>

            {/* INSTAGRAM */}

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-lg font-black text-white transition hover:border-[#d6ff00]/50 hover:text-[#d6ff00]"
            >
              ◎
            </a>

            {/* WHATSAPP */}

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `I left my Messi tribute ❤️⚽\n\nhttps://tributetomessi.online/tribute/${tribute.tribute_id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-lg font-black text-white transition hover:border-[#d6ff00]/50 hover:text-[#d6ff00]"
            >
              ◉
            </a>

            {/* COPY LINK */}

            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://tributetomessi.online/tribute/${tribute.tribute_id}`
                );

                alert("Tribute link copied!");
              }}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:border-[#d6ff00]/50"
            >
              COPY LINK
            </button>
          </div>

          {/* FOOTER */}

          <p className="mt-8 text-xs text-white/20">
            This tribute was created on TributeToMessi.online.
          </p>
        </div>
      </div>
    </main>
  );
}