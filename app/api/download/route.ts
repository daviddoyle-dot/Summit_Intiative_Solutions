import { NextResponse } from "next/server";

const DEFAULT_TO = "daviddoyle@summitinitiativesolutions.com";
const DEFAULT_FROM = "The Summit Initiative <contact@summitinitiativesolutions.com>";

const MAX_EMAIL = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DownloadBody = {
  email?: unknown;
  website?: unknown; // honeypot: real visitors never fill this in
};

// Someone asked for the Three Rings paper. Let David know who, so he can follow up.
export async function POST(request: Request) {
  let body: DownloadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots tend to fill every field. Pretend success so they don't retry.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().slice(0, MAX_EMAIL) : "";
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Paper download: RESEND_API_KEY is not set.");
    return NextResponse.json({ error: "Please try again later." }, { status: 500 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: email,
      subject: `Three Rings paper requested by ${email}`,
      text: `${email} asked for The Three Rings of Organizational Effectiveness.\n\n---\nSent from The Summit Initiative website.`,
    }),
  });

  if (!response.ok) {
    console.error("Paper download: Resend rejected the message", response.status, await response.text());
    return NextResponse.json({ error: "We couldn't take your request right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
