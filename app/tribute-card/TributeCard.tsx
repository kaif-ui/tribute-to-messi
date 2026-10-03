"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
type TributeCardProps = {
  fanName: string;
  countryName: string;
  message: string;
  tributeId: string;
};

export default function TributeCard({
  fanName,
  countryName,
  message,
  tributeId,
}: TributeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
const [downloading, setDownloading] = useState(false);

async function downloadCard() {
  if (!cardRef.current) return;

  setDownloading(true);

  try {
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#050505",
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `messi-tribute-${tributeId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("CARD DOWNLOAD ERROR:", error);
    alert("Unable to download the card. Please try again.");
  } finally {
    setDownloading(false);
  }
}
  return (
    <div className="w-full">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[2rem] border border-[#d6ff00]/30 bg-black p-8 text-white shadow-2xl sm:p-12"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d6ff00]/10 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#d6ff00]/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d6ff00]">
                Tribute to Messi
              </p>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                One World. One Legend.
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black italic">
                MESSI
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                Tribute Card
              </p>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
              A message from
            </p>

            <h2 className="mt-3 text-4xl font-black leading-none sm:text-6xl">
              {fanName}
            </h2>

            <p className="mt-3 text-sm font-bold text-[#d6ff00]">
              {countryName}
            </p>
          </div>

          <div className="my-12 h-px bg-white/10" />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
              My message to Messi
            </p>

            <p className="mt-6 text-2xl font-bold leading-relaxed sm:text-4xl">
              “{message}”
            </p>
          </div>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                Tribute ID
              </p>

              <p className="mt-1 text-sm font-black text-[#d6ff00]">
                {tributeId}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                TributeToMessi.online
              </p>

              <p className="mt-1 text-xs font-bold text-white/40">
                Made by a fan. For a legend.
              </p>
            </div>
          </div>
                </div>
      </div>

      <button
        type="button"
        onClick={downloadCard}
        disabled={downloading}
        className="mt-6 w-full rounded-full bg-[#d6ff00] px-6 py-4 font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading ? "Creating Your Card..." : "↓ Download My Tribute Card"}
      </button>
    </div>
  );
}