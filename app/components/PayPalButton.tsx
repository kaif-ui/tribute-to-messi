"use client";

type PayPalButtonProps = {
  tributeId: string;
};

export default function PayPalButton({
  tributeId,
}: PayPalButtonProps) {
  async function handlePayPalCheckout() {
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tributeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to start PayPal checkout.");
        return;
      }

      window.location.href = data.approvalUrl;
    } catch (error) {
      console.error("PAYPAL CHECKOUT ERROR:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayPalCheckout}
      className="rounded-full border border-white/20 px-6 py-4 text-center font-black transition hover:bg-white hover:text-black"
    >
      🌍 Pay $6.99 with PayPal
    </button>
  );
}