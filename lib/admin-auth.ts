// Next.js glue around the pure helpers in admin-session.ts.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_SECONDS,
  createSessionToken,
  isSameOrigin,
  verifySessionToken,
} from "./admin-session";

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

export const MIN_PASSWORD_LENGTH = 12;

/** Sign-in needs a long-enough password and a secret for signing the session cookie. */
export function adminAuthConfigured(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length >= MIN_PASSWORD_LENGTH && sessionSecret().length >= 16;
}

/** Publishing needs a GitHub token that can write to the repository. */
export function githubConfigured(): boolean {
  return Boolean(process.env.BLOG_GITHUB_TOKEN);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value, sessionSecret());
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(sessionSecret()), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Gate for admin API routes. Returns an error response to send back, or null when the
 * request is allowed to continue.
 */
export async function guardAdminApi(request: Request): Promise<NextResponse | null> {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ error: "The editor isn't set up yet." }, { status: 503 });
  }
  if (request.method !== "GET") {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (!isSameOrigin(request.headers.get("origin"), host)) {
      return NextResponse.json({ error: "Request blocked." }, { status: 403 });
    }
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  return null;
}
