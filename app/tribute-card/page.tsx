export const dynamic = "force-dynamic";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
import TributeCard from "./TributeCard";
import PayPalButton from "../components/PayPalButton";

export default async function TributeCardPage({
  searchParams,
}: {
  searchParams: Promise<{ tributeId?: string }>;
}) {
  const { tributeId } = await searchParams;

  if (!tributeId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute Card
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Tribute ID is required.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-[#d6ff00] px-6 py-3 font-bold text-black"
          >
            Back Home →
          </Link>
        </div>
      </main>
    );
  }

  const { data: tribute, error } = await supabase
    .from("tributes")
    .select("tribute_id, fan_name, country_name, message")
    .eq("tribute_id", tributeId)
    .eq("status", "approved")
    .single();
    const {
  data: paidCardPayment,
  error: paidCardPaymentError,
} = await supabaseAdmin
  .from("tribute_card_payments")
  .select("id")
  .eq("tribute_id", tributeId)
  .eq("status", "paid")
  .limit(1)
  .maybeSingle();

console.log("PAID CARD PAYMENT:", paidCardPayment);
console.log("PAID CARD PAYMENT ERROR:", paidCardPaymentError);

const isPaid = !!paidCardPayment;

  if (error || !tribute) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute Card
          </p>

          <h1 className="mt-4 text-4xl font-black">
            We couldn't find this tribute.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-[#d6ff00] px-6 py-3 font-bold text-black"
          >
            Back Home →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d6ff00]">
          Tribute to Messi
        </p>

        <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
          YOUR MESSAGE.
          <br />
          YOUR CARD.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-white/50">
          Turn your Messi tribute into a personalized digital card featuring
          your name, country, message and Tribute ID.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Personalized Tribute Card
          </p>

          <h2 className="mt-4 text-3xl font-black">
            A permanent digital memory of your message to Messi.
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/50">
            Your card will be created from the tribute you submitted on
            TributeToMessi.online.
          </p>

          <div className="mt-8 rounded-2xl bg-[#d6ff00] p-6 text-black">
            <p className="text-sm font-black uppercase tracking-[0.2em]">
              Price
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-black">₹299</p>
                <p className="text-sm font-semibold opacity-60">
                  India · UPI
                </p>
              </div>

              <div className="text-right">
                <p className="text-4xl font-black">$4.99</p>
                <p className="text-sm font-semibold opacity-60">
                  International · PayPal
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Your Tribute
            </p>

            <p className="mt-4 text-2xl font-bold">
              “{tribute.message}”
            </p>

            <p className="mt-5 text-sm text-white/50">
              {tribute.fan_name} · {tribute.country_name}
            </p>

            <p className="mt-2 text-xs text-white/30">
              Tribute {tribute.tribute_id}
            </p>
          </div>
{isPaid ? (
  <TributeCard
    fanName={tribute.fan_name}
    countryName={tribute.country_name}
    message={tribute.message}
    tributeId={tribute.tribute_id}
  />
) : (
  <div className="mt-8 rounded-3xl border border-[#d6ff00]/20 bg-white/[0.03] p-8 text-center">
    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d6ff00]">
      Your Card Is Ready
    </p>

    <h3 className="mt-4 text-3xl font-black">
      Unlock your personalized card.
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Complete your ₹299 UPI or $4.99 PayPal payment to unlock the
      downloadable Tribute Card.
    </p>
  </div>
)}
          <a
  href={`/tribute-card/upi?tributeId=${tribute.tribute_id}`}
  className="mt-8 block w-full rounded-full bg-[#d6ff00] px-6 py-4 text-center font-black text-black transition hover:scale-[1.01]"
>
  🇮🇳 Pay ₹299 with UPI →
</a>
<div className="mt-4">
  <PayPalButton
  tributeId={tribute.tribute_id}
  product="card"
/>
</div>
        </div>
      </div>
    </main>
  );
}