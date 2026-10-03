"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Tribute = {
  id: string;
  tribute_id: string;
  fan_name: string;
  country_name: string;
  country_code: string | null;
  message: string;
  status: string;
};

export default function TributeWall() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTributes() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("tributes")
      .select(
        "id, tribute_id, fan_name, country_name, country_code, message, status"
      )
      .eq("status", "approved")
      .order("id", { ascending: false })
      .limit(50);

    if (error) {
      console.error("TRIBUTE WALL ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setError("Unable to load tributes right now.");
      setLoading(false);
      return;
    }

    setTributes(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTributes();
  }, []);

  return (
    <section className="border-y border-white/10 bg-[#080808] px-5 py-28">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
              From around the world
            </p>

            <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
              THE TRIBUTE
              <br />
              WALL.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/40">
            Messages from fans around the world celebrating the career,
            memories and legacy of Lionel Messi.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              Loading tributes...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-400">
              {error}
            </p>

            <button
              onClick={loadTributes}
              className="mt-5 rounded-full border border-white/20 px-6 py-3 text-sm font-bold transition hover:border-[#d6ff00] hover:text-[#d6ff00]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && tributes.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">

            <p className="text-4xl font-black text-[#d6ff00]">
              Be the first.
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/40">
              The first approved message will appear here.
              Leave your message and become part of the tribute.
            </p>

            <a
              href="#message"
              className="mt-7 inline-block rounded-full bg-[#d6ff00] px-7 py-3 text-sm font-black text-black transition hover:scale-105"
            >
              Leave Your Message →
            </a>

          </div>
        )}

        {/* TRIBUTES */}
        {!loading && !error && tributes.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {tributes.map((tribute) => (
              <article
                key={tribute.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-[#d6ff00]/40"
              >

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-black">
                      {tribute.fan_name}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-widest text-white/30">
                      {tribute.country_name}
                      {tribute.country_code
                        ? ` • ${tribute.country_code}`
                        : ""}
                    </p>
                  </div>

                  <Link
  href={`/tribute/${tribute.tribute_id}`}
  className="text-xs font-black text-[#d6ff00] hover:underline"
>
  {tribute.tribute_id} →
</Link>

                </div>

                <div className="my-6 h-px bg-white/10" />

                <p className="text-sm leading-7 text-white/60">
                  “{tribute.message}”
                </p>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}