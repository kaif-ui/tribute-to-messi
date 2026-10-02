"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function CommunityStats() {
  const [messageCount, setMessageCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [countryLeaderboard, setCountryLeaderboard] = useState<
    { country: string; count: number }[]
  >([]);

  useEffect(() => {
    async function loadStats() {
      const { count } = await supabase
        .from("tributes")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { data: countries } = await supabase
        .from("tributes")
        .select("country_code, country_name")
        .eq("status", "approved");

      setMessageCount(count ?? 0);

      const countryMap = new Map<string, number>();

      (countries ?? []).forEach((item) => {
        const country = item.country_name || item.country_code;

        if (country) {
          countryMap.set(
            country,
            (countryMap.get(country) ?? 0) + 1
          );
        }
      });

      const leaderboard = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

      setCountryCount(countryMap.size);
      setCountryLeaderboard(leaderboard);
    }

    loadStats();
  }, []);

  return (
    <div>
      {/* COMMUNITY STATS */}
      <div className="grid grid-cols-1 border-t border-white/10 md:grid-cols-3">
        <div className="py-8 text-center md:border-r md:py-10 border-white/10">
          <div className="text-5xl font-black tracking-tight text-white md:text-6xl">
            {messageCount.toLocaleString()}
          </div>

          <div className="mt-3 text-sm tracking-[0.18em] text-white/50">
            MESSAGES
          </div>
        </div>

        <div className="py-8 text-center md:border-r md:py-10 border-white/10">
          <div className="text-5xl font-black tracking-tight text-white md:text-6xl">
            {countryCount.toLocaleString()}
          </div>

          <div className="mt-3 text-sm tracking-[0.18em] text-white/50">
            COUNTRIES
          </div>
        </div>

        <div className="py-8 text-center md:py-10">
          <div className="text-5xl font-black tracking-tight text-white md:text-6xl">
            ∞
          </div>

          <div className="mt-3 text-sm tracking-[0.18em] text-white/50">
            MEMORIES
          </div>
        </div>
      </div>

      {/* COUNTRY LEADERBOARD */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
          Global participation
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
          COUNTRIES UNITED.
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {countryLeaderboard.map((item, index) => (
            <div
              key={item.country}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-white/10 px-5 py-4"
            >
              <span className="text-sm font-black text-[#d6ff00]">
                #{String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 font-bold text-white">
                {item.country}
              </span>

              <span className="whitespace-nowrap text-sm font-black text-white/60">
                {item.count}{" "}
                {item.count === 1 ? "MESSAGE" : "MESSAGES"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}