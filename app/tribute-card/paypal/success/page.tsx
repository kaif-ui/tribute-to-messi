"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TributeCardPayPalSuccessPage() {
  const searchParams = useSearchParams();

  const tributeId = searchParams.get("tributeId") || "";
  const [status, setStatus] = useState(
    "Verifying your PayPal payment..."
  );

  useEffect(() => {
    async function capturePayment() {
      try {
        const orderId = searchParams.get("token");

        if (!orderId || !tributeId) {
          setStatus("PayPal order information was not found.");
          return;
        }

        const response = await fetch(
          "/api/paypal/capture-card-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId,
              tributeId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus(
            data.error || "Payment verification failed."
          );
          return;
        }

        setStatus(
          data.status === "COMPLETED"
            ? "Payment successful! Your Tribute Card is ready."
            : "Payment received. Your Tribute Card is being verified."
        );
      } catch (error) {
        console.error(
          "TRIBUTE CARD PAYPAL SUCCESS ERROR:",
          error
        );

        setStatus(
          "Something went wrong while verifying your payment."
        );
      }
    }

    capturePayment();
  }, [searchParams, tributeId]);

  return (
    <main className="min-h-screen bg-black px-5 py-24 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d6ff00]">
          Tribute to Messi
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Tribute Card Payment
        </h1>

        <p className="mt-6 text-white/60">
          {status}
        </p>

        {tributeId && (
          <p className="mt-8 text-xs text-white/30">
            Tribute ID: {tributeId}
          </p>
        )}

        <a
          href={
            tributeId
              ? `/tribute-card?tributeId=${tributeId}`
              : "/"
          }
          className="mt-8 inline-block rounded-full bg-[#d6ff00] px-6 py-3 font-black text-black"
        >
          View My Tribute Card →
        </a>
      </div>
    </main>
  );
}