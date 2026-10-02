"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

export default function MessageForm() {
  const [fanName, setFanName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fanName.trim() || !countryName.trim() || !message.trim()) {
      setError("Please fill in your name, country and message.");
      return;
    }

    setLoading(true);

    const tributeId =
      "TM-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error: insertError } = await supabase
      .from("tributes")
      .insert({
        tribute_id: tributeId,
        fan_name: fanName.trim(),
        country_name: countryName.trim(),
        country_code: countryCode.trim().toUpperCase(),
        message: message.trim(),
        status: "approved",
      });

    if (insertError) {
      const errorMessage = [
        insertError.message,
        insertError.code ? `Code: ${insertError.code}` : "",
        insertError.details ? `Details: ${insertError.details}` : "",
        insertError.hint ? `Hint: ${insertError.hint}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      console.error("SUPABASE INSERT ERROR:", errorMessage);

      setError(errorMessage || "Unknown Supabase error");
      setLoading(false);
      return;
    }

    setSuccess(
  `Your tribute is ready — ${tributeId} — /tribute/${tributeId}`
);

    setFanName("");
    setCountryName("");
    setCountryCode("");
    setMessage("");

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Your name
        </label>

        <input
          type="text"
          value={fanName}
          onChange={(e) => setFanName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Country
        </label>

        <input
          type="text"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          placeholder="e.g. Argentina"
          maxLength={80}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Country code
        </label>

        <input
          type="text"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          placeholder="e.g. AR"
          maxLength={3}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 uppercase outline-none focus:border-lime-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Your message to Messi
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message to Messi..."
          maxLength={500}
          rows={6}
          className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
        />

        <div className="mt-1 text-right text-xs text-zinc-500">
          {message.length}/500
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
  <div className="rounded-xl bg-lime-100 px-4 py-4 text-sm font-semibold text-black">
    <div>
      {success}
    </div>

    <div className="mt-4 flex flex-wrap gap-3">
      <a
        href={`/tribute/${success.split("—")[1]?.trim()}`}
        className="rounded-full bg-black px-4 py-2 font-black text-white"
      >
        View Tribute →
      </a>

      <a
        href={`/featured/${success.split("—")[1]?.trim()}`}
        className="rounded-full bg-lime-400 px-4 py-2 font-black text-black"
      >
        Make This Tribute Featured — ₹499 / $6.99
      </a>
    </div>
  </div>
)}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-lime-400 px-6 py-4 font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send My Message →"}
      </button>
    </form>
  );
}