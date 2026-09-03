/** Helpers shared by the API proxy routes. */

export const UPSTREAM = process.env.FOODGENOME_API;

/** The caller's anonymous session id, if they sent one — there are no accounts. */
export function forwardAuth(request: Request, extra: HeadersInit = {}): Headers {
  const headers = new Headers(extra);
  const session = request.headers.get("x-session-id");
  if (session) headers.set("X-Session-Id", session);
  return headers;
}

/** Turn an upstream response into a JSON response. */
export async function relay(res: Response, label: string) {
  if (res.status === 401 || res.status === 403) {
    const body = await res.json().catch(() => ({}));
    return Response.json(
      { error: body.detail ?? "Not permitted." },
      { status: res.status },
    );
  }
  if (!res.ok) {
    return Response.json({ error: `${label} returned ${res.status}.` }, { status: 502 });
  }
  return Response.json(await res.json());
}
