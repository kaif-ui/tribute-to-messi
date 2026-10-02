"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Tribute = {
  id: string;
  tribute_id: string;
  fan_name: string;
  country_name: string;
  message: string;
};

export default function FeaturedTributes() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedTributes() {
      const { data, error } = await supabase
        .from("tributes")
        .select(
          "id, tribute_id, fan_name, country_name, message"
        )
        .eq("status", "approved")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (!error) {
        setTributes(data ?? []);
      }

      setLoading(false);
    }

    loadFeaturedTributes();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-zinc-500">
        Loading featured tributes...
      </div>
    );
  }

  if (tributes.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-10 text-center">
        <p className="text-lg font-bold">
          No featured tributes yet.
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Be one of the first fans to feature your message.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {tributes.map((tribute) => (
        <a
          key={tribute.id}
          href={`/tribute/${tribute.tribute_id}`}
          className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-[#d6ff00] px-3 py-1 text-xs font-black text-black">
              FEATURED
            </span>

            <span className="text-xs font-semibold text-zinc-400">
              {tribute.country_name}
            </span>
          </div>

          <p className="text-lg font-semibold leading-relaxed text-zinc-900">
            “{tribute.message}”
          </p>

          <div className="mt-6">
            <p className="font-black text-black">
              {tribute.fan_name}
            </p>

            <p className="mt-1 text-xs font-medium text-zinc-400">
              Tribute {tribute.tribute_id}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}