export function GET(req) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 }); // Replace res.status(401).end("Unauthorized") with new Response()
  } else {
    return new Response("Hello Cron!");
  }
}
