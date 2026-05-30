import { NextRequest } from "next/server";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/siliconbay/api";

const forward = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  const params = await context.params;
  const targetUrl = new URL(`${BACKEND_BASE_URL}/${(params.path ?? []).join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (["host", "content-length", "connection"].includes(key)) {
      return;
    }

    headers.set(key, value);
  });

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return Response.json(data, { status: response.status });
  }

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: contentType
      ? {
          "content-type": contentType,
        }
      : undefined,
  });
};

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;