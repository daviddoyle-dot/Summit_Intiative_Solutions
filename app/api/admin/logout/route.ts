import { NextResponse } from "next/server";
import { endSession } from "@/lib/admin-auth";
import { isSameOrigin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!isSameOrigin(request.headers.get("origin"), host)) {
    return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  }
  await endSession();
  return NextResponse.json({ ok: true });
}
