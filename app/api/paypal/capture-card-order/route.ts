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

    // 1. Get PayPal access token
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

    // 2. Capture PayPal order
    const captureResponse = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(
        orderId
      )}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `card-capture-${orderId}`,
        },
        body: JSON.stringify({}),
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error(
        "PAYPAL CARD CAPTURE ERROR:",
        captureData
      );

      return Response.json(
        {
          error:
            captureData?.message ||
            captureData?.details?.[0]?.description ||
            "Unable to capture PayPal payment.",
        },
        { status: 500 }
      );
    }

    // 3. Verify PayPal order status
    if (captureData.status !== "COMPLETED") {
      return Response.json(
        {
          success: false,
          status: captureData.status,
          error: "PayPal payment was not completed.",
        },
        { status: 400 }
      );
    }

    // 4. Verify purchase unit
    const purchaseUnit = captureData.purchase_units?.[0];

    if (!purchaseUnit) {
      console.error(
        "PAYPAL PURCHASE UNIT MISSING:",
        captureData
      );

      return Response.json(
        { error: "PayPal purchase information was not found." },
        { status: 400 }
      );
    }

    // 5. Verify tribute ID from PayPal custom_id
    const expectedCustomId = `TRIBUTE_CARD:${tributeId}`;

    if (purchaseUnit.custom_id !== expectedCustomId) {
      console.error("PAYPAL TRIBUTE ID MISMATCH:", {
        expected: expectedCustomId,
        received: purchaseUnit.custom_id,
      });

      return Response.json(
        {
          error:
            "This PayPal payment does not belong to this tribute card.",
        },
        { status: 400 }
      );
    }

    // 6. Verify captured amount
    const capture =
      purchaseUnit.payments?.captures?.[0];

    const capturedAmount =
      capture?.amount?.value;

    const capturedCurrency =
      capture?.amount?.currency_code;

    if (
      capturedAmount !== "4.99" ||
      capturedCurrency !== "USD"
    ) {
      console.error("PAYPAL AMOUNT MISMATCH:", {
        expectedAmount: "4.99",
        expectedCurrency: "USD",
        receivedAmount: capturedAmount,
        receivedCurrency: capturedCurrency,
      });

      return Response.json(
        {
          error:
            "PayPal payment amount or currency could not be verified.",
        },
        { status: 400 }
      );
    }

    // 7. Prevent duplicate payment records
    const { data: existingPayment } = await supabaseAdmin
      .from("tribute_card_payments")
      .select("id")
      .eq("payment_reference", orderId)
      .maybeSingle();

    if (existingPayment) {
      return Response.json({
        success: true,
        status: "COMPLETED",
        orderId,
        tributeId,
        alreadyProcessed: true,
      });
    }

    // 8. Save verified payment
    const { error: paymentInsertError } =
      await supabaseAdmin
        .from("tribute_card_payments")
        .insert({
          tribute_id: tributeId,
          amount: 4.99,
          currency: "USD",
          payment_method: "paypal",
          payment_reference: orderId,
          status: "paid",
          paid_at: new Date().toISOString(),
        });

    if (paymentInsertError) {
      console.error(
        "TRIBUTE CARD PAYMENT RECORD ERROR:",
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

    console.log("TRIBUTE CARD PAYPAL PAYMENT VERIFIED:", {
      orderId,
      tributeId,
      amount: capturedAmount,
      currency: capturedCurrency,
    });

    return Response.json({
      success: true,
      status: "COMPLETED",
      orderId,
      tributeId,
    });
  } catch (error) {
    console.error(
      "PAYPAL CARD CAPTURE ERROR:",
      error
    );

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}