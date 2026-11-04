"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Please check your connection.");
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-sm space-y-5 bg-[#141b2c] border border-white/[0.1] rounded-2xl p-8"
    >
      <div>
        <label htmlFor="password" className="block text-sm text-white/60 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          className="w-full bg-[#0a0e17] border border-white/[0.12] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9713D]/60"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-[#E0966A]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !password}
        className="bg-[#C9713D] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
