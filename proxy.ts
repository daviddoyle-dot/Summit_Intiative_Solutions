import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCountryAllowed } from "@/lib/geo";

export function proxy(request: NextRequest) {
  // Emergency switch: set GEO_BLOCK_DISABLED=1 in Vercel and redeploy to let everyone in.
  if (process.env.GEO_BLOCK_DISABLED === "1") return NextResponse.next();

  if (!isCountryAllowed(request.headers.get("x-vercel-ip-country"))) {
    return new NextResponse("This site is not available in your region.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return NextResponse.next();
}
