import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "https://tenaosis-fastapi-production.up.railway.app";

async function forward({ request, params }: { request: Request; params: { _splat?: string } }) {
  try {
  const incoming = new URL(request.url);
  const target = `${UPSTREAM}/${params._splat ?? ""}${incoming.search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  if (auth) headers.set("authorization", auth);
  if (contentType) headers.set("content-type", contentType);
  headers.set("accept", request.headers.get("accept") ?? "application/json");

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const init: RequestInit = { method: request.method, headers };
  if (hasBody) init.body = await request.arrayBuffer();
  const upstream = await fetch(target, init);


  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
  } catch (err) {
    return new Response(
      JSON.stringify({ detail: err instanceof Error ? err.message : "Upstream request failed" }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}

export const Route = createFileRoute("/api/proxy/$")({
  server: {
    handlers: {
      GET: forward,
      POST: forward,
      PUT: forward,
      PATCH: forward,
      DELETE: forward,
    },
  },
});
