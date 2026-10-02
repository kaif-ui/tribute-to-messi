"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Commentary = {
  id: string;
  commentary_number: number;
  title: string;
  body: string;
  opponent: string | null;
  competition: string | null;
  match_date: string | null;
  published: boolean;
};

const CARDS_PER_PAGE = 3;

export default function CommentariesSection() {
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCommentaries() {
      const { data, error } = await supabase
        .from("commentaries")
        .select(
          "id, commentary_number, title, body, opponent, competition, match_date, published"
        )
        .eq("published", true)
        .order("commentary_number", { ascending: true });

      if (error) {
        console.error("Commentaries error:", error);
        setError("Unable to load commentaries.");
        setLoading(false);
        return;
      }

      setCommentaries(data || []);
      setLoading(false);
    }

    loadCommentaries();
  }, []);

  const totalPages = Math.ceil(commentaries.length / CARDS_PER_PAGE);

  const startIndex = currentPage * CARDS_PER_PAGE;

  const visibleCommentaries = commentaries.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const previousPage = () => {
    setCurrentPage((page) => Math.max(0, page - 1));
  };

  const nextPage = () => {
    setCurrentPage((page) => Math.min(totalPages - 1, page + 1));
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section
      id="commentaries"
      className="w-full bg-black text-white py-24 px-6 md:px-10"
    >
      <div className="max-w-[1700px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-5">
              100 Special Stories
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              THE COMMENTARIES.
            </h2>

            <p className="mt-5 max-w-2xl text-base md:text-lg text-white/50 leading-relaxed">
              A collection of moments, memories and words written for the
              journey of Lionel Messi.
            </p>
          </div>

          <div className="text-xs uppercase tracking-[0.25em] text-white/40">
            {commentaries.length > 0
              ? `${startIndex + 1} — ${Math.min(
                  startIndex + CARDS_PER_PAGE,
                  commentaries.length
                )} / ${commentaries.length}`
              : "0 / 100"}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Loading stories...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-white/50">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && commentaries.length === 0 && (
          <div className="border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-white/40">
              No commentaries published yet.
            </p>
          </div>
        )}

        {/* CARDS */}
        {!loading && !error && visibleCommentaries.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {visibleCommentaries.map((commentary) => (
                <article
                  key={commentary.id}
                  className="group relative min-h-[500px] rounded-3xl border border-white/10 bg-white/[0.025] p-8 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
                >

                  {/* NUMBER */}
                  <div className="absolute top-6 right-7">
                    <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-xs font-mono tracking-[0.15em] text-white/50">
                      #{String(commentary.commentary_number).padStart(3, "0")}
                    </span>
                  </div>

                  <div>

                    {/* META */}
                    <div className="pr-16 mb-8">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                        {commentary.competition || "MESSI"}
                        {commentary.match_date
                          ? ` • ${formatDate(commentary.match_date)}`
                          : ""}
                      </p>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-2xl md:text-3xl font-semibold leading-tight mb-7">
                      {commentary.title}
                    </h3>

                    {/* BODY */}
                    <p className="text-base leading-8 text-white/55">
                      {commentary.body}
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">
                        MATCH
                      </p>

                      <p className="text-sm text-white/65">
                        {commentary.opponent || "Messi"}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:border-white/30 transition">
                      →
                    </div>

                  </div>

                </article>
              ))}

            </div>

            {/* NAVIGATION */}
            <div className="mt-12 flex items-center gap-5">

              <button
                onClick={previousPage}
                disabled={currentPage === 0}
                className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs font-mono text-white/30">
                {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : "0 / 0"}
              </span>

              <div className="h-px flex-1 bg-white/10" />

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>

            </div>
          </>
        )}

      </div>
    </section>
  );
}