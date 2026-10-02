export async function POST(request: Request) {
  const body = await request.text();

  console.log("PAYPAL WEBHOOK RECEIVED:", body);

  return new Response("OK", {
    status: 200,
  });
}