import PayPalButton from "../../components/PayPalButton";
import { supabase } from "../../lib/supabase";

export default async function FeaturedTributePage({
  params,
}: {
  params: Promise<{ tributeId: string }>;
}) {
  const { tributeId } = await params;

  const { data: tribute, error } = await supabase
    .from("tributes")
    .select("tribute_id, fan_name, country_name, message")
    .eq("tribute_id", tributeId)
    .eq("status", "approved")
    .single();

  if (error || !tribute) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute not found
          </p>

          <h1 className="mt-4 text-4xl font-black">
            We couldn't find this tribute.
          </h1>

          <a
            href="/"
            className="mt-8 inline-block rounded-full bg-[#d6ff00] px-6 py-3 font-bold text-black"
          >
            Back Home →
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d6ff00]">
          Featured Tribute
        </p>

        <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
          MAKE YOUR
          <br />
          MESSAGE STAND OUT.
        </h1>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Your tribute
          </p>

          <p className="mt-5 text-2xl font-bold">
            “{tribute.message}”
          </p>

          <div className="mt-6 text-sm text-white/50">
            {tribute.fan_name} · {tribute.country_name}
          </div>

          <div className="mt-2 text-xs text-white/30">
            {tribute.tribute_id}
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-[#d6ff00] p-7 text-black">
          <p className="text-sm font-black uppercase tracking-[0.2em]">
            Featured Tribute
          </p>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-black">₹499</p>
              <p className="mt-1 text-sm font-semibold opacity-60">
                India · UPI
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-black">$6.99</p>
              <p className="mt-1 text-sm font-semibold opacity-60">
                International · PayPal
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
  href={`/featured/${tribute.tribute_id}/upi`}
  className="rounded-full bg-white px-6 py-4 text-center font-black text-black transition hover:scale-[1.02]"
>
  🇮🇳 Pay ₹499 with UPI
</a>

 <PayPalButton tributeId={tributeId} />
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-white/30">
          Your tribute remains free. Featured status is optional.
        </p>
      </div>
    </main>
  );
}