"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function UpiPaymentPage() {
  const params = useParams();
  const tributeId = params.tributeId as string;

  const [fanName, setFanName] = useState("");
  const [message, setMessage] = useState("");
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTribute() {
      const { data, error } = await supabase
        .from("tributes")
        .select("fan_name, message")
        .eq("tribute_id", tributeId)
        .eq("status", "approved")
        .single();

      if (error || !data) {
        setError("Tribute not found.");
      } else {
        setFanName(data.fan_name);
        setMessage(data.message);
      }

      setLoading(false);
    }

    loadTribute();
  }, [tributeId]);

  async function handlePaymentSubmit() {
    setError("");
    setSuccess("");

    if (!utr.trim()) {
      setError("Please enter your UPI transaction/reference number.");
      return;
    }

    setSubmitting(true);

    const { error: paymentError } = await supabase
      .from("featured_tribute_payments")
      .insert({
        tribute_id: tributeId,
        amount: 499,
        currency: "INR",
        payment_method: "upi",
        payment_reference: utr.trim(),
        status: "pending",
      });

    if (paymentError) {
      console.error("PAYMENT INSERT ERROR:", paymentError);
      setError(paymentError.message || "Something went wrong.");
      setSubmitting(false);
      return;
    }

    setSuccess(
      "Payment submitted successfully. Your Featured Tribute will be activated after payment verification."
    );

    setUtr("");
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d6ff00]">
          India · UPI
        </p>

        <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
          FEATURE YOUR
          <br />
          TRIBUTE.
        </h1>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Tribute
          </p>

          <p className="mt-4 text-lg font-bold">
            {fanName}
          </p>

          <p className="mt-3 text-white/60">
            “{message}”
          </p>

          <p className="mt-4 text-xs text-white/30">
            Tribute ID: {tributeId}
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-[#d6ff00] p-6 text-center text-black">
          <p className="text-sm font-black uppercase tracking-[0.2em]">
            Amount
          </p>

          <p className="mt-2 text-5xl font-black">
            ₹499
          </p>

          <p className="mt-2 text-sm font-semibold opacity-60">
            Featured Tribute
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 text-center text-black">
          <p className="text-sm font-black uppercase tracking-[0.2em]">
            Scan & Pay
          </p>

          <img
            src="/upi-qr.jpeg"
            alt="UPI payment QR code"
            className="mx-auto mt-5 w-full max-w-sm rounded-2xl"
          />

          <p className="mt-5 text-sm font-bold">
            UPI ID
          </p>

          <p className="mt-1 text-lg font-black">
            7289912252@ybl
          </p>

          <p className="mt-3 text-xs text-black/50">
            Pay exactly ₹499 using your UPI app.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 p-6">
          <label className="block text-sm font-bold">
            UPI Transaction / UTR Number
          </label>

          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="Enter your UTR / transaction reference"
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-[#d6ff00]"
          />

          <p className="mt-3 text-xs leading-5 text-white/40">
            After paying ₹499, enter the transaction/reference number shown
            in your UPI app.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl bg-[#d6ff00] px-4 py-4 text-sm font-bold text-black">
            {success}
          </div>
        )}

        <button
          onClick={handlePaymentSubmit}
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-[#d6ff00] px-6 py-4 font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "I've Paid ₹499 →"}
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-white/30">
          Featured status is activated after payment verification.
        </p>
      </div>
    </main>
  );
}