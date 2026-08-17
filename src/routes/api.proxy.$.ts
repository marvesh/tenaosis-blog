import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "https://tenaosis-fastapi-production.up.railway.app";

async function forward({ request, params }: { request: Request; params: { _splat?: string } }) {
  const incoming = new URL(request.url);
  const target = `${UPSTREAM}/${params._splat ?? ""}${incoming.search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  if (auth) headers.set("authorization", auth);
  if (contentType) headers.set("content-type", contentType);
  headers.set("accept", request.headers.get("accept") ?? "application/json");

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
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
