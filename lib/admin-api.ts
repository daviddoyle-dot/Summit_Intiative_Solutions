import { NextResponse } from "next/server";
import { GitHubError } from "./github";

/** Turns a failure into a friendly JSON response without leaking technical details. */
export function apiError(error: unknown): NextResponse {
  if (error instanceof GitHubError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Admin API error", error);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
