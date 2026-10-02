"use client";

import { useEffect, useState } from "react";

import MessageForm from "./components/MessageForm";
import TributeWall from "./components/TributeWall";
import MomentsSection from "./components/MomentsSection";
import CommentariesSection from "./components/CommentariesSection";
import CommunityStats from "./components/CommunityStats";
import FeaturedTributes from "./components/FeaturedTributes";
import XCountryCampaign from "./components/XCountryCampaign";

const stats = [
  {
    category: "UEFA CHAMPIONS LEAGUE",
    games: "163",
    goals: "129",
    assists: "40",
    note: "Barcelona + Paris Saint-Germain",
  },
  {
    category: "LA LIGA",
    games: "520",
    goals: "474",
    assists: "192",
    note: "FC Barcelona",
  },
  {
    category: "SPANISH SUPER CUP",
    games: "20",
    goals: "14",
    assists: "5",
    note: "FC Barcelona",
  },
  {
    category: "UEFA SUPER CUP",
    games: "4",
    goals: "3",
    assists: "2",
    note: "FC Barcelona",
  },
  {
    category: "COPA AMÉRICA",
    games: "39",
    goals: "14",
    assists: "—",
    note: "Argentina · 7 editions · 2 titles",
  },
  {
    category: "OLYMPICS",
    games: "5",
    goals: "2",
    assists: "—",
    note: "Beijing 2008 · Gold Medal",
  },
  {
    category: "INTERNATIONAL FRIENDLIES",
    games: "61",
    goals: "54",
    assists: "—",
    note: "Argentina",
  },
  {
    category: "WORLD CUP",
    games: "34",
    goals: "21",
    assists: "12",
    note: "6 editions · 2022 Champion",
  },
  {
    category: "ARGENTINA",
    games: "207",
    goals: "125",
    assists: "68",
    note: "Senior international career",
  },
];

const worldCupStats = [
  ["2006", "3", "1"],
  ["2010", "5", "0"],
  ["2014", "7", "4"],
  ["2018", "4", "1"],
  ["2022", "7", "7"],
  ["2026", "8", "8"],
];

const achievements = [
  ["Ballon d'Or", "8"],
  ["La Liga Titles", "10"],
  ["Champions League", "4"],
  ["Copa América", "2"],
  ["World Cup", "1"],
  ["Olympic Gold", "1"],
  ["Spanish Super Cup", "8"],
  ["UEFA Super Cup", "3"],
];

const challenges = [
  {
    title: "THE WORLD CUP",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi immediately after Argentina won the 2022 FIFA World Cup. Messi is holding the World Cup trophy, Argentina fans are celebrating around us, stadium lights, confetti, emotional faces, authentic football atmosphere, ultra realistic photography. Keep my face recognizable and natural. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "CAMP NOU MAGIC",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi at Camp Nou during his Barcelona era, with the stadium packed and glowing under the lights. Messi is wearing his classic Barcelona kit, football atmosphere, emotional crowd, realistic photography, natural faces. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "COPA AMÉRICA CHAMPION",
    prompt:
      "Create a cinematic realistic photo of me celebrating beside Lionel Messi after Argentina won the 2021 Copa América. Messi is holding the trophy, Argentina teammates celebrating behind us, stadium lights, emotional atmosphere, realistic sports photography. Keep my face recognizable. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "THE SHIRT LIFT",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi during his iconic shirt-lift celebration at the Santiago Bernabéu. Messi is holding his Barcelona shirt toward the crowd, huge stadium atmosphere, dramatic lights, realistic football photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "BALLON D'OR NIGHT",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi at a Ballon d'Or ceremony. Messi is holding the Ballon d'Or trophy, elegant formal atmosphere, cameras and lights around us, premium red-carpet photography, realistic faces. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "CHAMPIONS LEAGUE NIGHT",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi during a magical UEFA Champions League night. Messi is wearing his Barcelona kit, stadium lights shining behind us, roaring crowd, dramatic football atmosphere, realistic sports photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "MESSI & HIS YOUNGER SELF",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi and a younger version of Messi from his early Barcelona years. Show the contrast between his childhood dream and legendary career, emotional football atmosphere, stadium lights, realistic photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "THE FREE KICK",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi just after one of his iconic free-kick goals. Messi is celebrating while the stadium crowd erupts behind us, dramatic night lighting, football atmosphere, ultra realistic sports photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "THE TUNNEL",
    prompt:
      "Create a cinematic realistic photo of me walking beside Lionel Messi through a football stadium tunnel before a major match. Messi is wearing his match kit, focused expression, dramatic tunnel lighting, professional football atmosphere, realistic photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "THE RAIN",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi during a dramatic football match in heavy rain. Messi is wearing his Argentina kit, rain falling around us, stadium lights reflecting on the pitch, emotional cinematic atmosphere, ultra realistic photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "CHILDHOOD DREAM",
    prompt:
      "Create a cinematic realistic photo showing me standing beside Lionel Messi as if we are looking back at his childhood football dream. Messi appears in a nostalgic football setting with a younger version of himself playing in the background, emotional lighting, cinematic realism, powerful storytelling. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "ARGENTINA CELEBRATION",
    prompt:
      "Create a cinematic realistic photo of me celebrating with Lionel Messi in an Argentina dressing room after a major victory. Messi is wearing Argentina colors, teammates celebrating around us, trophy nearby, emotional smiles, confetti, realistic sports photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "THE STADIUM WALK",
    prompt:
      "Create a cinematic realistic photo of me walking onto a huge football stadium pitch beside Lionel Messi before kickoff. Thousands of fans are watching, stadium lights are glowing, Messi is wearing his Argentina kit, epic scale, realistic cinematic photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "THE TROPHY MOMENT",
    prompt:
      "Create a cinematic realistic photo of me standing beside Lionel Messi while he lifts a major football trophy above his head. Confetti fills the stadium, fans are celebrating, dramatic lights, emotional faces, legendary victory atmosphere, ultra realistic sports photography. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
  {
    title: "YOUR DREAM MESSI MOMENT",
    prompt:
      "Create your own dream photograph with Lionel Messi. Place yourself beside Messi in the most unforgettable football moment you can imagine, with cinematic stadium lighting, emotional atmosphere, realistic faces, authentic football details and ultra realistic photography. Make it feel like a real memory. Post it on Instagram, use #TributeToMessi, share https://tributetomessi.online, and invite another Messi fan to complete the challenge.",
  },
];

function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050505] text-white">
      {/* ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6ff00]/10 blur-[120px]" />

      {/* moving pitch line */}
      <div className="absolute left-0 top-1/2 h-px w-full bg-white/10">
        <div className="h-full w-1/3 animate-[loadingLine_1.8s_ease-in-out_infinite] bg-[#d6ff00]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">

        {/* DOTTED MESSI HOLDING WORLD CUP */}

<div className="relative mb-8 flex h-80 w-56 items-center justify-center">

  <svg
    viewBox="0 0 220 320"
    className="h-full w-full"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="messiDotsFinal"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="4"
          cy="4"
          r="1.7"
          fill="#ffffff"
          opacity="0.9"
        />
      </pattern>

      <pattern
        id="blueDotsFinal"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="4"
          cy="4"
          r="1.7"
          fill="#74ACDF"
          opacity="0.95"
        />
      </pattern>
    </defs>

    {/* WORLD CUP — CLEARLY ABOVE THE HEAD */}
    <g
      fill="none"
      stroke="#74ACDF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* trophy bowl */}
      <path d="M91 18 Q110 12 129 18 L125 48 Q110 62 95 48 Z" />

      {/* trophy handles */}
      <path d="M94 22 Q72 17 76 37 Q78 52 96 48" />
      <path d="M126 22 Q148 17 144 37 Q142 52 124 48" />

      {/* trophy stem */}
      <path d="M103 51 L103 65 L117 65 L117 51" />

      {/* trophy base */}
      <path d="M96 66 L124 66 L128 74 L92 74 Z" />
    </g>

    {/* LEFT HAND GRIPPING TROPHY */}
    <circle
      cx="76"
      cy="39"
      r="6"
      fill="url(#messiDotsFinal)"
    />

    {/* RIGHT HAND GRIPPING TROPHY */}
    <circle
      cx="144"
      cy="39"
      r="6"
      fill="url(#messiDotsFinal)"
    />

    {/* HEAD — BELOW TROPHY */}
    <circle
      cx="110"
      cy="103"
      r="20"
      fill="url(#messiDotsFinal)"
    />

    {/* short hair */}
    <path
      d="M91 100 Q94 79 110 80 Q126 79 129 100"
      fill="url(#messiDotsFinal)"
    />

    {/* LEFT ARM — HAND GOES TO TROPHY */}
    <path
      d="M88 130
         Q78 123 73 108
         L69 76
         Q68 67 75 66
         Q82 67 82 76
         L86 101
         L101 119
         Z"
      fill="url(#blueDotsFinal)"
    />

    {/* RIGHT ARM — HAND GOES TO TROPHY */}
    <path
      d="M132 130
         Q142 123 147 108
         L151 76
         Q152 67 145 66
         Q138 67 138 76
         L134 101
         L119 119
         Z"
      fill="url(#blueDotsFinal)"
    />

    {/* TORSO */}
    <path
      d="M88 126
         Q110 114 132 126
         L145 190
         Q110 205 75 190
         Z"
      fill="url(#messiDotsFinal)"
    />

    {/* ARGENTINA BLUE SHIRT SIDES */}
    <path
      d="M88 127 Q79 145 80 186"
      fill="none"
      stroke="#74ACDF"
      strokeWidth="4"
      opacity="0.9"
    />

    <path
      d="M132 127 Q141 145 140 186"
      fill="none"
      stroke="#74ACDF"
      strokeWidth="4"
      opacity="0.9"
    />

    {/* SHORTS */}
    <path
      d="M76 187
         L110 193
         L144 187
         L140 218
         L113 211
         L107 211
         L80 218
         Z"
      fill="url(#blueDotsFinal)"
    />

    {/* LEFT LEG */}
    <path
      d="M82 211
         L106 211
         L101 278
         L84 278
         Z"
      fill="url(#messiDotsFinal)"
    />

    {/* RIGHT LEG */}
    <path
      d="M114 211
         L138 211
         L136 278
         L119 278
         Z"
      fill="url(#messiDotsFinal)"
    />

    {/* LEFT FOOT */}
    <path
      d="M84 275
         Q74 278 76 285
         L101 285
         Q105 281 100 276
         Z"
      fill="url(#messiDotsFinal)"
    />

    {/* RIGHT FOOT */}
    <path
      d="M119 276
         Q115 281 120 285
         L145 285
         Q147 278 136 275
         Z"
      fill="url(#messiDotsFinal)"
    />

  </svg>

</div>

        {/* title */}
        <div className="overflow-hidden">
          <h1 className="animate-[titleReveal_1.2s_cubic-bezier(.16,1,.3,1)_forwards] text-6xl font-black tracking-[-0.07em] opacity-0 sm:text-8xl">
            <span className="text-white">TRIBUTE</span>
            <span className="text-[#d6ff00]">TO</span>
            <span className="text-white">MESSI</span>
          </h1>
        </div>

        <p className="mt-5 animate-[fadeUp_1s_.55s_ease-out_forwards] text-[10px] font-bold uppercase tracking-[0.45em] text-white/40 opacity-0">
          THE STORY CONTINUES.
        </p>

        <div className="mt-8 h-px w-24 overflow-hidden bg-white/10">
          <div className="h-full w-full origin-left animate-[progress_1.9s_ease-in-out_forwards] bg-[#d6ff00]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingLine {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(350%);
          }
        }

        @keyframes ballMove {
          0% {
            transform: translate(-50%, -50%) translateX(-80px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateX(80px) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) translateX(-80px) rotate(360deg);
          }
        }

        @keyframes ballPulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @keyframes titleReveal {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const scroll = () => {
      const element = document.getElementById(id);

      if (element) {
        const offset = 90;
        const top =
          element.getBoundingClientRect().top +
          window.scrollY -
          offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });

        return true;
      }

      return false;
    };

    if (scroll()) return;

    setTimeout(() => {
      scroll();
    }, 300);
  };

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-black tracking-tight"
          >
            TRIBUTE<span className="text-[#d6ff00]">TO</span>MESSI
          </button>

          <div className="hidden gap-5 text-xs text-white/70 md:flex">

            <button
              onClick={() => scrollToSection("moments")}
              className="transition hover:text-white"
            >
              Moments
            </button>

            <button
              onClick={() => scrollToSection("commentaries")}
              className="transition hover:text-white"
            >
              Stories
            </button>

            <button
              onClick={() => scrollToSection("stats")}
              className="transition hover:text-white"
            >
              Stats
            </button>

            <button
              onClick={() => scrollToSection("challenges")}
              className="transition hover:text-white"
            >
              Challenges
            </button>

          </div>

          <button
            onClick={() => scrollToSection("message")}
            className="hidden rounded-full bg-[#d6ff00] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-105 md:block"
          >
            Leave Your Message
          </button>
          <button
  onClick={() => setMenuOpen(!menuOpen)}
  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-xl text-white md:hidden"
  aria-label="Open menu"
>
  {menuOpen ? "✕" : "☰"}
</button>

        </div>
        {menuOpen && (
  <div className="border-t border-white/10 bg-black/95 px-5 py-5 md:hidden">
    <div className="flex flex-col gap-4 text-sm text-white/80">
      <button
        onClick={() => {
          scrollToSection("moments");
          setMenuOpen(false);
        }}
        className="text-left transition hover:text-white"
      >
        Moments
      </button>

      <button
        onClick={() => {
          scrollToSection("commentaries");
          setMenuOpen(false);
        }}
        className="text-left transition hover:text-white"
      >
        Stories
      </button>

      <button
        onClick={() => {
          scrollToSection("stats");
          setMenuOpen(false);
        }}
        className="text-left transition hover:text-white"
      >
        Stats
      </button>

      <button
        onClick={() => {
          scrollToSection("challenges");
          setMenuOpen(false);
        }}
        className="text-left transition hover:text-white"
      >
        Challenges
      </button>

      <button
        onClick={() => {
          scrollToSection("message");
          setMenuOpen(false);
        }}
        className="rounded-full bg-[#d6ff00] px-5 py-3 text-center font-bold text-black"
      >
        Leave Your Message
      </button>
    </div>
  </div>
)}
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-5 pt-24">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(214,255,0,0.12),transparent_35%)]" />

        <div className="relative mx-auto w-full max-w-6xl text-center">

          <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#d6ff00]">
            A global fan tribute
          </p>

          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl md:text-9xl">
            ONE WORLD.
            <br />
            <span className="text-[#d6ff00]">ONE LEGEND.</span>
            <br />
            ONE MESSAGE.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
            A fan-created tribute celebrating the moments, memories and
            emotions that Lionel Messi gave to millions around the world.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <button
              onClick={() => scrollToSection("message")}
              className="rounded-full bg-[#d6ff00] px-8 py-4 font-black text-black transition hover:scale-105"
            >
              Write Your Message →
            </button>

            <button
              onClick={() => scrollToSection("moments")}
              className="rounded-full border border-white/20 px-8 py-4 font-bold text-white transition hover:border-white/50"
            >
              Explore His Story
            </button>

          </div>

          {/* LIVE COMMUNITY STATS */}
          <div className="mx-auto mt-20 max-w-3xl border-y border-white/10">
            <CommunityStats />

<section className="mx-auto w-full max-w-6xl px-6 py-20">
  <div className="mb-10 text-center">
    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#d6ff00]">
      Fan Tributes
    </p>

    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
      FEATURED TRIBUTES.
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
      Messages from fans who chose to make their tribute part of the featured
      collection.
    </p>
  </div>

  <FeaturedTributes />
</section>
          </div>

        </div>
      </section>

      {/* INTRO */}
      <section className="border-y border-white/10 bg-white/[0.02] px-5 py-24">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            More than football
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Some players win trophies.
            <br />
            Some create memories.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl leading-7 text-white/50">
            This is a collection of the moments that made fans stop, scream,
            cry, celebrate and fall in love with football all over again.
          </p>

        </div>

      </section>

            {/* MOMENTS */}

      <section id="moments" className="scroll-mt-24">
        <MomentsSection />
      </section>

      {/* COMMENTARIES */}
      <CommentariesSection />

      {/* STATS */}
      <section
        id="stats"
        className="border-t border-white/10 bg-[#080808] px-5 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            The numbers
          </p>

          <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
            A CAREER
            <br />
            IN NUMBERS.
          </h2>

          <p className="mt-6 max-w-2xl leading-7 text-white/45">
            The numbers behind more than two decades of football across
            Barcelona, Argentina and the biggest international stages.
          </p>

          <div className="mt-16 grid gap-5 md:grid-cols-2">

            {stats.map((stat) => (
              <div
                key={stat.category}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:border-[#d6ff00]/40 hover:bg-white/[0.04] sm:p-9"
              >

                <div className="flex items-start justify-between gap-5">

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d6ff00]">
                      {stat.category}
                    </p>

                    <p className="mt-3 text-sm text-white/35">
                      {stat.note}
                    </p>
                  </div>

                  <span className="text-xs font-mono text-white/20">
                    CAREER
                  </span>

                </div>

                <div className="mt-10 grid grid-cols-3 border-t border-white/10 pt-7">

                  <div>
                    <p className="text-4xl font-black sm:text-5xl">
                      {stat.games}
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                      Games
                    </p>
                  </div>

                  <div className="border-x border-white/10 px-5">
                    <p className="text-4xl font-black text-[#d6ff00] sm:text-5xl">
                      {stat.goals}
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                      Goals
                    </p>
                  </div>

                  <div className="pl-5">
                    <p className="text-4xl font-black sm:text-5xl">
                      {stat.assists}
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                      Assists
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* WORLD CUP BREAKDOWN */}
          <div className="mt-20">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d6ff00]">
                  FIFA World Cup
                </p>

                <h3 className="mt-3 text-3xl font-black sm:text-5xl">
                  SIX TOURNAMENTS.
                </h3>
              </div>

              <p className="text-sm text-white/30">
                34 appearances · 21 goals
              </p>

            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">

              <div className="grid grid-cols-3 bg-white/[0.04] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <span>Edition</span>
                <span>Games</span>
                <span>Goals</span>
              </div>

              {worldCupStats.map(([year, games, goals]) => (
                <div
                  key={year}
                  className="grid grid-cols-3 border-t border-white/10 px-6 py-5 transition hover:bg-white/[0.03]"
                >

                  <span className="font-bold">
                    {year}
                  </span>

                  <span className="text-white/50">
                    {games}
                  </span>

                  <span className="font-black text-[#d6ff00]">
                    {goals}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* ACHIEVEMENTS */}
          <div className="mt-20">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d6ff00]">
              Major honours
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-4">

              {achievements.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-[#080808] p-6 sm:p-8"
                >

                  <p className="text-4xl font-black text-[#d6ff00] sm:text-5xl">
                    {value}
                  </p>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
                    {label}
                  </p>

                </div>
              ))}

            </div>

          </div>

          <p className="mt-10 text-[10px] leading-5 text-white/20">
            Statistics represent documented career figures through Messi's
            2026 international career. Competition definitions can vary
            between statistical databases.
          </p>

        </div>

      </section>

      {/* TRIBUTE WALL */}
      <TributeWall />

      <XCountryCampaign />

      {/* MESSAGE */}
      <section
        id="message"
        className="relative overflow-hidden bg-white px-5 py-28 text-black"
      >

        <div className="absolute right-[-10%] top-[-30%] h-[500px] w-[500px] rounded-full bg-[#d6ff00] blur-3xl opacity-40" />

        <div className="relative mx-auto max-w-5xl">

          <p className="text-sm font-black uppercase tracking-[0.3em]">
            Your turn
          </p>

          <h2 className="mt-4 max-w-4xl text-5xl font-black leading-none tracking-tight sm:text-8xl">
            WHAT WOULD
            <br />
            YOU SAY?
          </h2>

          <p className="mt-7 max-w-xl text-black/50">
            Leave your message for Messi and become part of this global fan
            tribute.
          </p>

          <div className="mt-10">
            <MessageForm />
          </div>

        </div>

      </section>

      {/* CHALLENGES */}
      <section
        id="challenges"
        className="px-5 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Instagram AI challenge
          </p>

          <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
            15 MESSI MOMENTS.
            <br />
            ONE PHOTO.
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {challenges.map((challenge, index) => (
              <div
                key={challenge.title}
                className="rounded-3xl border border-white/10 p-7 transition hover:border-[#d6ff00]/50"
              >

                <span className="text-xs font-black text-[#d6ff00]">
                  #{String(index + 1).padStart(2, "0")}
                </span>

                <p className="mt-8 text-sm font-bold">
                  {challenge.prompt}
                </p>

                <button
  onClick={async () => {
    try {
      await navigator.clipboard.writeText(challenge.prompt);
      alert(
        "Prompt copied! Create your Messi image, post it on Instagram, use #TributeToMessi, and share https://tributetomessi.online 🔥"
      );
    } catch {
      alert("Copy failed. Please copy the prompt manually.");
    }
  }}
  className="mt-7 rounded-full bg-[#d6ff00] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:scale-105"
>
  Copy Prompt →
</button>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 px-5 py-32 text-center">

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
          The world is watching
        </p>

        <h2 className="mx-auto mt-5 max-w-5xl text-5xl font-black leading-none tracking-tight sm:text-8xl">
          ONE FINAL
          <br />
          MESSAGE.
        </h2>

        <button
          onClick={() => scrollToSection("message")}
          className="mt-10 inline-block rounded-full bg-[#d6ff00] px-9 py-4 font-black text-black transition hover:scale-105"
        >
          ADD YOUR VOICE →
        </button>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs text-white/30 sm:flex-row">

          <p>© 2026 TributeToMessi.online</p>

          <p>
            An unofficial fan-created tribute. Not affiliated with Lionel
            Messi, FC Barcelona, AFA, FIFA or UEFA.
          </p>

          <div className="flex flex-wrap gap-4 pt-3 text-xs text-white/40">
  <a href="/disclaimer" className="transition hover:text-white">
    Disclaimer
  </a>
  <a href="/privacy" className="transition hover:text-white">
    Privacy
  </a>
  <a href="/terms" className="transition hover:text-white">
    Terms
  </a>
  <a href="/contact" className="transition hover:text-white">
    Contact
  </a>
</div>

        </div>

      </footer>

    </main>
  );
}