import { getStore } from "@netlify/blobs";

export default async (request) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") return new Response(null, { headers });

  const store = getStore("waine");

  if (request.method === "GET") {
    try {
      const wines = await store.get("wines") || "[]";
      const vineyard = await store.get("vineyard") || "[]";
      const memories = await store.get("memories") || "[]";
      return new Response(JSON.stringify({ wines: JSON.parse(wines), vineyard: JSON.parse(vineyard), memories: JSON.parse(memories) }), { headers });
    } catch(e) {
      return new Response(JSON.stringify({ wines: [], vineyard: [], memories: [] }), { headers });
    }
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();
      if (body.wines !== undefined) await store.set("wines", JSON.stringify(body.wines));
      if (body.vineyard !== undefined) await store.set("vineyard", JSON.stringify(body.vineyard));
      if (body.memories !== undefined) await store.set("memories", JSON.stringify(body.memories));
      return new Response(JSON.stringify({ ok: true }), { headers });
    } catch(e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
    }
  }
};

export const config = { path: "/api/save" };
