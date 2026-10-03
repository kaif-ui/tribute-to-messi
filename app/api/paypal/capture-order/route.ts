import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { orderId, tributeId } = await request.json();

    if (!orderId || !tributeId) {
      return Response.json(
        { error: "Order ID and Tribute ID are required." },
        { status: 400 }
      );
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: "PayPal credentials are not configured." },
        { status: 500 }
      );
    }

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const tokenResponse = await fetch(
      "https://api-m.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("PAYPAL TOKEN ERROR:", tokenData);

      return Response.json(
        { error: "Unable to authenticate with PayPal." },
        { status: 500 }
      );
    }

    const captureResponse = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(
        orderId
      )}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `capture-${orderId}`,
        },
        body: JSON.stringify({}),
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error("PAYPAL CAPTURE ERROR:", captureData);

      return Response.json(
        { error: "Unable to capture PayPal payment." },
        { status: 500 }
      );
    }

    const paymentStatus = captureData.status;

    if (paymentStatus !== "COMPLETED") {
  return Response.json(
    {
      success: false,
      status: paymentStatus,
      error: "PayPal payment was not completed.",
    },
    { status: 400 }
  );
}
    console.log("PAYPAL CAPTURE SUCCESS:", {
      orderId,
      tributeId,
      status: paymentStatus,
    });

    if (paymentStatus === "COMPLETED") {
      console.log("PAYPAL PAYMENT VERIFIED:", {
        tributeId,
        orderId,
      });

      const { error: paymentInsertError } = await supabaseAdmin
        .from("featured_tribute_payments")
        .insert({
          tribute_id: tributeId,
          amount: 6.99,
          currency: "USD",
          payment_method: "paypal",
          payment_reference: orderId,
          status: "paid",
          paid_at: new Date().toISOString(),
        });

      if (paymentInsertError) {
        console.error(
          "PAYPAL PAYMENT RECORD ERROR:",
          paymentInsertError
        );

        return Response.json(
          {
            error:
              "Payment was captured, but the payment record could not be saved.",
          },
          { status: 500 }
        );
      }
      const { error: featureError } = await supabaseAdmin
  .from("tributes")
  .update({
    is_featured: true,
  })
  .eq("tribute_id", tributeId);

if (featureError) {
  console.error(
    "FEATURED TRIBUTE UPDATE ERROR:",
    featureError
  );

  return Response.json(
    {
      error:
        "Payment was saved, but the tribute could not be marked as featured.",
    },
    { status: 500 }
  );
}
    }

    return Response.json({
      success: paymentStatus === "COMPLETED",
      status: paymentStatus,
      orderId,
      tributeId,
    });
  } catch (error) {
    console.error("PAYPAL CAPTURE ERROR:", error);

    return Response.json(
      { error: "Something went wrong while capturing payment." },
      { status: 500 }
    );
  }
}