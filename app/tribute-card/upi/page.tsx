"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Tribute = {
  tribute_id: string;
  fan_name: string;
  country_name: string;
  message: string;
};

export default function TributeCardUPIPage() {
  const searchParams = useSearchParams();
  const tributeId = searchParams.get("tributeId") || "";

  const [tribute, setTribute] = useState<Tribute | null>(null);
  const [loading, setLoading] = useState(true);
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTribute() {
      if (!tributeId) return;

      const { data, error } = await supabase
        .from("tributes")
        .select("tribute_id, fan_name, country_name, message")
        .eq("tribute_id", tributeId)
        .eq("status", "approved")
        .single();

      if (!error && data) {
        setTribute(data);
      }

      setLoading(false);
    }

    loadTribute();
  }, [tributeId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!utr.trim()) {
      setError("Please enter your UTR / transaction reference.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase
      .from("tribute_card_payments")
      .insert({
        tribute_id: tributeId,
        amount: 299,
        currency: "INR",
        payment_method: "upi",
        payment_reference: utr.trim(),
        status: "pending",
      });

    if (insertError) {
      console.error("TRIBUTE CARD PAYMENT ERROR:", insertError);
      setError(
        insertError.message || "Unable to submit your payment."
      );
      setSubmitting(false);
      return;
    }

    setSuccess(
      "Payment submitted successfully. Your Tribute Card will be activated after verification."
    );

    setUtr("");
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-white/50">Loading tribute...</p>
      </main>
    );
  }

  if (!tribute) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
            Tribute Card
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Tribute not found.
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
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d6ff00]">
          Tribute to Messi
        </p>

        <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
          PAY WITH UPI.
          <br />
          KEEP THE MEMORY.
        </h1>

        <p className="mt-6 text-white/50">
          Create your personalized Messi Tribute Card.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">
              Amount
            </p>

            <p className="mt-2 text-5xl font-black text-[#d6ff00]">
              ₹299
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-5 text-center">
            <p className="text-sm font-bold text-black">
              Scan & Pay
            </p>

            <img
              src="/upi-qr.jpeg"
              alt="UPI payment QR code"
              className="mx-auto mt-5 w-full max-w-[280px] rounded-2xl"
            />

            <p className="mt-5 text-sm font-bold text-black">
              UPI ID
            </p>

            <p className="mt-1 text-lg font-black text-black">
              7289912252@ybl
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Your Tribute
            </p>

            <p className="mt-4 text-xl font-bold">
              “{tribute.message}”
            </p>

            <p className="mt-4 text-sm text-white/50">
              {tribute.fan_name} · {tribute.country_name}
            </p>

            <p className="mt-2 text-xs text-white/30">
              Tribute {tribute.tribute_id}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <label className="text-sm font-bold">
              UTR / Transaction Reference
            </label>

            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="Enter your UTR / transaction ID"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-[#d6ff00]"
            />

            {error && (
              <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-2xl bg-[#d6ff00] px-4 py-4 text-sm font-bold text-black">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-full bg-[#d6ff00] px-6 py-4 font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "I've Paid ₹299 — Submit UTR →"}
            </button>
          </form>

          <a
            href={`/tribute-card?tributeId=${tribute.tribute_id}`}
            className="mt-5 block text-center text-sm font-bold text-white/40 hover:text-white"
          >
            ← Back to Tribute Card
          </a>
        </div>
      </div>
    </main>
  );
}