import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(request: Request) {
  try {
    const { tributeId } = await request.json();

    if (!tributeId) {
      return Response.json(
        { error: "Tribute ID is required." },
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

    const orderResponse = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: `FEATURED_TRIBUTE:${tributeId}`,
              description: "Featured Tribute",
              amount: {
                currency_code: "USD",
                value: "6.99",
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference:
                  "IMMEDIATE_PAYMENT_REQUIRED",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `https://tributetomessi.online/featured/${encodeURIComponent(
                  tributeId
                )}/paypal/success`,
                cancel_url: `https://tributetomessi.online/featured/${encodeURIComponent(
                  tributeId
                )}`,
              },
            },
          },
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("PAYPAL CREATE ORDER ERROR:", orderData);

      return Response.json(
        { error: "Unable to create PayPal order." },
        { status: 500 }
      );
    }

    const approvalLink = orderData.links?.find(
      (link: { rel: string }) =>
        link.rel === "payer-action" || link.rel === "approve"
    );

    if (!approvalLink) {
      return Response.json(
        { error: "PayPal approval link was not returned." },
        { status: 500 }
      );
    }

    return Response.json({
      orderId: orderData.id,
      approvalUrl: approvalLink.href,
    });
  } catch (error) {
    console.error("PAYPAL CREATE ORDER ERROR:", error);

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}