import { NextResponse } from "next/server";

const DEFAULT_TO = "daviddoyle@summitinitiativesolutions.com";
const DEFAULT_FROM = "Summit Initiative Solutions <contact@summitinitiativesolutions.com>";

const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot: real visitors never fill this in
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots tend to fill every field. Pretend success so they don't retry.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_NAME).replace(/[\r\n]+/g, " ");
  const email = clean(body.email, MAX_EMAIL);
  const message = clean(body.message, MAX_MESSAGE);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and message." },
      { status: 400 }
    );
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return NextResponse.json({ error: "Messaging is temporarily unavailable." }, { status: 500 });
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
      subject: `Website inquiry from ${name}`,
      text: `${message}\n\n---\nFrom: ${name}\nEmail: ${email}\nSent from the Summit Initiative Solutions website contact form.`,
    }),
  });

  if (!response.ok) {
    console.error("Contact form: Resend rejected the message", response.status, await response.text());
    return NextResponse.json(
      { error: "We couldn't send your message right now." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
