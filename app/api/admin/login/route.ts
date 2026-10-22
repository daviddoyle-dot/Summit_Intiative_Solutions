import { NextResponse } from "next/server";
import { adminAuthConfigured, startSession } from "@/lib/admin-auth";
import {
  clearAttempts,
  isSameOrigin,
  recordFailedAttempt,
  safeEqual,
  tooManyAttempts,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ error: "The editor isn't set up yet." }, { status: 503 });
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!isSameOrigin(request.headers.get("origin"), host)) {
    return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  }

  const key = clientKey(request);
  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password || !safeEqual(password, process.env.ADMIN_PASSWORD ?? "")) {
    recordFailedAttempt(key);
    await new Promise((resolve) => setTimeout(resolve, 700)); // slows down guessing
    return NextResponse.json({ error: "That password isn't right." }, { status: 401 });
  }

  clearAttempts(key);
  await startSession();
  return NextResponse.json({ ok: true });
}
