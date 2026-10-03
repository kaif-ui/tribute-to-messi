"use client";

type PayPalButtonProps = {
  tributeId: string;
  product?: "featured" | "card";
};

export default function PayPalButton({
  tributeId,
  product = "featured",
}: PayPalButtonProps) {
  async function handlePayPalCheckout() {
    try {
      const endpoint =
        product === "card"
          ? "/api/paypal/create-card-order"
          : "/api/paypal/create-order";

      const response = await fetch(endpoint, {
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
        alert(
          data.error || "Unable to start PayPal checkout."
        );
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
      className="w-full rounded-full border border-white/20 px-6 py-4 text-center font-black transition hover:bg-white hover:text-black"
    >
      {product === "card"
        ? "🌍 Pay $4.99 with PayPal"
        : "🌍 Pay $6.99 with PayPal"}
    </button>
  );
}