"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Moment = {
  id: string;
  moment_number: number;
  title: string;
  description: string | null;
  match_name: string | null;
  opponent: string | null;
  competition: string | null;
  venue: string | null;
  match_date: string | null;
  score: string | null;
  minute: string | null;
  image_url: string | null;
  image_credit: string | null;
  why_special: string | null;
  published: boolean;
};

type CommonsImage = {
  url: string;
  descriptionUrl: string;
  author: string;
  license: string;
};

const CARDS_PER_PAGE = 3;

export default function MomentsSection() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [commonsImages, setCommonsImages] = useState<
    Record<number, CommonsImage[]>
  >({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load moments from Supabase
   */
  useEffect(() => {
    async function loadMoments() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("moments")
        .select("*")
        .order("moment_number", {
          ascending: true,
        });

      if (error) {
        console.error("MOMENTS ERROR:", error);
        setError(error.message || "Could not load moments.");
        setLoading(false);
        return;
      }

      setMoments(data || []);
      setLoading(false);
    }

    loadMoments();
  }, []);

  /*
   * Get all years used by the 100 moments
   */
  const years = useMemo(() => {
    const uniqueYears = new Set<number>();

    moments.forEach((moment) => {
      if (moment.match_date) {
        const year = new Date(moment.match_date).getFullYear();

        if (!Number.isNaN(year)) {
          uniqueYears.add(year);
        }
      }
    });

    return Array.from(uniqueYears);
  }, [moments]);

  /*
   * Load Wikimedia Commons images for each year.
   *
   * We deliberately use Commons' API rather than hard-coding
   * random image URLs.
   */
  useEffect(() => {
    if (!years.length) return;

    async function loadCommonsImages() {
      setImagesLoading(true);

      const results: Record<number, CommonsImage[]> = {};

      await Promise.all(
        years.map(async (year) => {
          try {
            const category = `Category:Lionel Messi in ${year}`;

            const apiUrl =
              "https://commons.wikimedia.org/w/api.php" +
              `?action=query` +
              `&generator=categorymembers` +
              `&gcmtitle=${encodeURIComponent(category)}` +
              `&gcmtype=file` +
              `&gcmlimit=50` +
              `&prop=imageinfo` +
              `&iiprop=url|extmetadata` +
              `&iiurlwidth=1200` +
              `&format=json` +
              `&origin=*`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
              return;
            }

            const json = await response.json();

            const pages = json?.query?.pages
              ? Object.values(json.query.pages)
              : [];

            const images: CommonsImage[] = [];

            for (const page of pages as any[]) {
              const info = page?.imageinfo?.[0];

              if (!info?.thumburl && !info?.url) {
                continue;
              }

              const metadata = info.extmetadata || {};

              const author =
                metadata.Artist?.value ||
                metadata.Credit?.value ||
                "Wikimedia Commons contributor";

              const license =
                metadata.LicenseShortName?.value ||
                metadata.License?.value ||
                "License shown on Commons file page";

              const cleanAuthor = stripHtml(author);
              const cleanLicense = stripHtml(license);

              images.push({
                url: info.thumburl || info.url,
                descriptionUrl:
                  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(
                    page.title.replace("File:", "")
                  )}`,
                author: cleanAuthor,
                license: cleanLicense,
              });
            }

            results[year] = images;
          } catch (err) {
            console.error(
              `COMMONS IMAGE ERROR FOR ${year}:`,
              err
            );
          }
        })
      );

      setCommonsImages(results);
      setImagesLoading(false);
    }

    loadCommonsImages();
  }, [years]);

  /*
   * Strip HTML from Wikimedia metadata.
   */
  function stripHtml(value: string) {
    const temp = document.createElement("div");
    temp.innerHTML = value;

    return (
      temp.textContent ||
      temp.innerText ||
      value
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /*
   * Pick an image for a moment.
   *
   * The index is deterministic so the same moment doesn't
   * randomly change every render.
   */
  function getImageForMoment(
    moment: Moment
  ): CommonsImage | null {
    if (!moment.match_date) {
      return null;
    }

    const year = new Date(moment.match_date).getFullYear();

    const images = commonsImages[year];

    if (!images || images.length === 0) {
      return null;
    }

    const index =
      (moment.moment_number - 1) % images.length;

    return images[index];
  }

  const totalPages = Math.ceil(
    moments.length / CARDS_PER_PAGE
  );

  const startIndex =
    currentPage * CARDS_PER_PAGE;

  const visibleMoments = moments.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  function nextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage((page) => page + 1);
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      setCurrentPage((page) => page - 1);
    }
  }

  if (loading) {
    return (
      <section className="w-full px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            100 Moments
          </p>

          <h2 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
            THE MAGIC.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <div className="aspect-[16/10] animate-pulse bg-white/5" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                  <div className="h-8 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="h-12 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-red-300">
            Moments Error
          </p>

          <p className="mt-4 text-white/60">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:bg-white/10"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              100 Moments
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              THE MAGIC.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
              One hundred unforgettable moments from Messi&apos;s journey.
            </p>
          </div>

          {/* ARROWS */}
          <div className="flex items-center gap-3">

            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              aria-label="Previous moments"
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition ${
                currentPage === 0
                  ? "cursor-not-allowed border-white/5 text-white/15"
                  : "border-white/15 text-white hover:bg-white hover:text-black"
              }`}
            >
              ←
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Next moments"
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition ${
                currentPage === totalPages - 1
                  ? "cursor-not-allowed border-white/5 text-white/15"
                  : "border-white/15 text-white hover:bg-white hover:text-black"
              }`}
            >
              →
            </button>

          </div>
        </div>

        {/* COUNTER */}
        <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/30">
          <span>
            {moments.length
              ? `${startIndex + 1} — ${Math.min(
                  startIndex + CARDS_PER_PAGE,
                  moments.length
                )} / ${moments.length}`
              : "0 / 0"}
          </span>

          <span>
            Page {totalPages ? currentPage + 1 : 0} / {totalPages}
          </span>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {visibleMoments.map((moment) => {
            const image = getImageForMoment(moment);

            return (
              <article
                key={moment.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition duration-500 hover:border-white/20 hover:bg-white/[0.055]"
              >

                {/* IMAGE */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">

                  {image ? (
                    <>
                      <img
                        src={image.url}
                        alt={moment.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* CREDIT */}
                      <a
                        href={image.descriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 left-3 right-3 text-[9px] leading-4 text-white/50 transition hover:text-white/90"
                      >
                        Photo: {image.author} · {image.license}
                      </a>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">

                      <div className="text-center">

                        <div className="text-6xl font-semibold text-white/[0.07]">
                          {String(
                            moment.moment_number
                          ).padStart(2, "0")}
                        </div>

                        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/20">
                          {imagesLoading
                            ? "Loading image..."
                            : "Image unavailable"}
                        </p>

                      </div>

                    </div>
                  )}

                  {/* NUMBER */}
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs tracking-[0.2em] text-white/70 backdrop-blur">
                    #{String(
                      moment.moment_number
                    ).padStart(3, "0")}
                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-6">

                  {/* META */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/30">

                    {moment.competition && (
                      <span>
                        {moment.competition}
                      </span>
                    )}

                    {moment.match_date && (
                      <>
                        <span>•</span>

                        <span>
                          {new Date(
                            moment.match_date
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </>
                    )}

                  </div>

                  {/* TITLE */}
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                    {moment.title}
                  </h3>

                  {/* DESCRIPTION */}
                  {moment.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/50">
                      {moment.description}
                    </p>
                  )}

                  {/* MATCH */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">

                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Match
                    </p>

                    <p className="mt-2 text-sm text-white/75">
                      {moment.match_name || "—"}
                    </p>

                  </div>

                  {/* DETAILS */}
                  <div className="mt-3 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                        Score
                      </p>

                      <p className="mt-2 text-sm text-white/75">
                        {moment.score || "—"}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                        Minute
                      </p>

                      <p className="mt-2 text-sm text-white/75">
                        {moment.minute || "—"}
                      </p>

                    </div>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="mt-10 flex items-center justify-center gap-5">

          <button
            onClick={previousPage}
            disabled={currentPage === 0}
            className="text-xs uppercase tracking-[0.2em] text-white/40 transition hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            ← Previous
          </button>

          <div className="h-1 w-1 rounded-full bg-white/20" />

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="text-xs uppercase tracking-[0.2em] text-white/40 transition hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            Next →
          </button>

        </div>

      </div>
    </section>
  );
}