"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

// Email field for the Three Rings paper. When the PDF isn't on the site yet, the request
// still reaches David and he sends it himself.
export default function PaperDownloadForm({ pdfUrl }: { pdfUrl: string | null }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, hidden from real visitors
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMessage("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="text-white/70 leading-relaxed">
        {pdfUrl ? (
          <>
            <p className="mb-4">Thank you. Here it is:</p>
            <a
              href={pdfUrl}
              download
              className="inline-block bg-[#C9713D] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
            >
              Download the paper (PDF)
            </a>
          </>
        ) : (
          <p>Thank you. I&rsquo;ll send the paper to {email} shortly.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="relative flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <label htmlFor="paper-email" className="sr-only">
        Email
      </label>
      <input
        id="paper-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        autoComplete="email"
        className="flex-1 min-w-0 bg-[#0a0e17] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9713D]/60"
      />
      {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="paper-website">Website</label>
        <input
          id="paper-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="shrink-0 bg-[#C9713D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send me the paper"}
      </button>
      {status === "error" && (
        <p role="alert" className="sm:basis-full text-sm text-[#E0966A]">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
