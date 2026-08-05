"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = `mailto:contact@summitinitiativesolutions.com?subject=${encodeURIComponent(
    `Website inquiry from ${name || "a visitor"}`
  )}&body=${encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;

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

        {/* TODO: swap this href for your real Calendly scheduling link */}
        <a
          href="https://calendly.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors mb-14"
        >
          Schedule a Call
        </a>

        <form
          action={mailtoHref}
          method="get"
          className="space-y-5 bg-[#141b2c] border border-white/[0.1] rounded-2xl p-8"
        >
          <div>
            <label htmlFor="name" className="block text-sm text-white/60 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0e17] border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9713D]/60"
              placeholder="Your name"
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
              className="w-full bg-[#0a0e17] border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9713D]/60"
              placeholder="you@company.com"
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
              className="w-full bg-[#0a0e17] border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9713D]/60"
              placeholder="Tell us a bit about your organization."
            />
          </div>
          <button
            type="submit"
            className="bg-[#C9713D] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
          >
            Send Message
          </button>
        </form>

        <p className="text-white/35 text-sm mt-6">
          Or connect on{" "}
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          .
        </p>
      </div>
    </div>
  );
}
