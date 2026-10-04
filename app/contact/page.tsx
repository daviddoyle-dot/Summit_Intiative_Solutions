"use client";

import { useState } from "react";

const CONTACT_EMAIL = "daviddoyle@summitinitiativesolutions.com";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, hidden from real visitors
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setShowValidation(true);
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatus("sent");
    } catch {
      setErrorMessage("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-[#0a0e17] border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9713D]/60";

  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">Contact</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Let&apos;s talk about your organization.
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-xl">
          The fastest way to get started is to schedule a call. Prefer email? Send a message
          below.
        </p>

        <a
          href="https://calendly.com/daviddoyle-summitinitiativesolutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors mb-14"
        >
          Schedule a Call
        </a>

        {status === "sent" ? (
          <div
            role="status"
            className="bg-[#141b2c] border border-white/[0.1] rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-2">Message sent</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Thank you. David will get back to you at the email address you provided.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="border border-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <div className="space-y-5 bg-[#141b2c] border border-white/[0.1] rounded-2xl p-8">
            <div>
              <label htmlFor="name" className="block text-sm text-white/60 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-white/60 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-white/60 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={inputClass}
                placeholder="Tell us a bit about your organization."
              />
            </div>

            {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {status === "error" && (
              <p role="alert" className="text-sm text-[#E0966A] leading-relaxed">
                {errorMessage} You can also email David directly at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={status === "sending"}
              className="inline-block bg-[#C9713D] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </div>
        )}

        <p className="text-white/35 text-sm mt-6">
          Or connect on{" "}
          <a
            href="https://www.linkedin.com/company/summit-initiative-solutions/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          .
        </p>
      </div>

      {showValidation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6"
          onClick={() => setShowValidation(false)}
        >
          <div
            className="max-w-sm w-full rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white mb-2">Almost there</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Please fill in your name, email, and message before sending.
            </p>
            <button
              type="button"
              onClick={() => setShowValidation(false)}
              className="bg-[#C9713D] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
