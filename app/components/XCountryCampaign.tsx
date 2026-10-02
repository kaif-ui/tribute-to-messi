"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Campaign = {
  id: string;
  country_name: string;
  country_code: string;
  hashtag: string;
  target_count: number;
  current_count: number;
  click_count: number;
  status: string;
};

export default function XCountryCampaign() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      const { data, error } = await supabase
        .from("x_country_campaigns")
        .select("*")
        .eq("status", "active")
        .order("click_count", { ascending: false });

      if (!error) {
        setCampaigns(data ?? []);
      }

      setLoading(false);
    }

    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <section className="px-5 py-28">
        <div className="mx-auto max-w-7xl text-center text-white/40">
          Loading global campaign...
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
          Global fan campaign
        </p>

        <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
          15 COUNTRIES.
          <br />
          <span className="text-[#d6ff00]">ONE MESSI.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-white/50">
          Fifteen countries. Fifteen hashtags. One global farewell.
          Let the fans show where Messi's love runs deepest.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => {
            const progress =
              campaign.target_count > 0
                ? Math.min(
                    100,
                    (campaign.click_count / campaign.target_count) * 100
                  )
                : 0;

            return (
              <div
                key={campaign.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-[#d6ff00]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#d6ff00]">
                    #{String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-xs text-white/30">
                    {campaign.country_code}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black">
                  {campaign.country_name}
                </h3>

                <p className="mt-2 text-lg font-bold text-[#d6ff00]">
                  {campaign.hashtag}
                </p>

                <div className="mt-8">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>
                      {campaign.click_count.toLocaleString()} campaign actions
                    </span>

                    <span>
                      {campaign.target_count.toLocaleString()} target
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#d6ff00] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-3 text-right text-xs font-bold text-white/30">
  {progress.toFixed(3)}%
</p>

<a
  onClick={async (event) => {
  event.preventDefault();
const xUrl = event.currentTarget.href;

  await supabase.rpc("increment_x_campaign_click", {
    p_campaign_id: campaign.id,
  });

  window.open(xUrl, "_blank", "noopener,noreferrer");
}}
  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${
      {
        AR: "Gracias por cada recuerdo, cada gol, cada lágrima and every moment you gave us. 🇦🇷❤️",
        IN: "From India to Argentina, millions of us grew up watching your magic. Thank you, Leo. 🇮🇳❤️",
        BD: "Bangladesh stands with Messi. Your football gave us memories that will never disappear. 🇧🇩❤️",
        ID: "Indonesia says thank you, Messi. Your magic crossed every border and reached our hearts. 🇮🇩❤️",
        US: "From the United States, thank you Messi for redefining what football can look like. 🇺🇸❤️",
        MX: "Mexico sends one message to Messi: thank you for the memories, the magic and the impossible moments. 🇲🇽❤️",
        BR: "Brasil says obrigado, Messi. Rivalries aside, football history will always remember your magic. 🇧🇷❤️",
        ES: "Barcelona, Spain and football will never forget what Messi created. Gracias por todo, Leo. 🇪🇸❤️",
        CO: "Colombia thanks Messi for giving football some of its most unforgettable moments. 🇨🇴❤️",
        PE: "Peru joins the farewell. Gracias, Messi, for a lifetime of football memories. 🇵🇪❤️",
        MY: "Malaysia joins the world in saying thank you, Messi. Your magic belongs to every football fan. 🇲🇾❤️",
        TH: "Thailand remembers the magic. Thank you, Messi, for making football feel like art. 🇹🇭❤️",
        KR: "South Korea sends its tribute to Messi. One career, countless unforgettable moments. 🇰🇷❤️",
        JP: "Japan says thank you, Messi. Your left foot created moments football will remember forever. 🇯🇵❤️",
        FR: "France pays tribute to Messi. Thank you for the moments that became football history. 🇫🇷❤️"
      }[campaign.country_code]
    }\n\n${campaign.hashtag}\n\ntributetomessi.online`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 block rounded-full bg-[#d6ff00] px-5 py-3 text-center text-sm font-black text-black transition hover:scale-[1.02]"
>
  POST ON X →
</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}