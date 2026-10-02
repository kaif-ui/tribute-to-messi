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
        .select("tribute_id, fan_name, country_name, message, created_at")
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
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/50">Loading tribute...</p>
      </main>
    );
  }

  if (!tribute) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
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
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center sm:p-14">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute to Messi
          </p>

          <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">
            {tribute.fan_name}
          </h1>

          <p className="mt-3 text-white/50">
            {tribute.country_name}
          </p>

          <div className="mx-auto mt-12 max-w-2xl">
            <p className="text-2xl font-bold leading-relaxed sm:text-4xl">
              “{tribute.message}”
            </p>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
              Tribute ID
            </p>

            <p className="mt-2 font-bold text-[#d6ff00]">
              {tribute.tribute_id}
            </p>
          </div>

          <a
            href="/"
            className="mt-10 inline-block rounded-full bg-[#d6ff00] px-7 py-4 text-sm font-black text-black transition hover:scale-105"
          >
            Leave Your Own Message →
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
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

<a
  href="https://www.instagram.com/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Share on Instagram"
  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-lg font-black text-white transition hover:border-[#d6ff00]/50 hover:text-[#d6ff00]"
>
  ◎
</a>

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

  <button
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
        </div>
      </div>
    </main>
  );
}