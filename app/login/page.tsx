"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and one of: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY. Restart the dev server after changing .env.local."
      );
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message || "Invalid email or password");
      return;
    }
    router.push("/admin/");
    router.refresh();
  }

  return (
    <>
      <Nav />
      <div
        className="login-container"
        style={{
          maxWidth: "400px",
          margin: "8rem auto",
          padding: "3rem 2rem",
          border: "1px solid var(--border-soft)",
          borderRadius: "4px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem" }}>
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-forest-light)",
                fontSize: "0.95rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border-soft)",
                borderRadius: "4px",
                background: "var(--bg-cream)",
                color: "var(--text-forest)",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-forest-light)",
                fontSize: "0.95rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border-soft)",
                borderRadius: "4px",
                background: "var(--bg-cream)",
                color: "var(--text-forest)",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--text-forest)",
              color: "var(--bg-cream)",
              border: "none",
              borderRadius: "4px",
              fontFamily: "inherit",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          {error ? (
            <p
              style={{
                color: "#d32f2f",
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </p>
          ) : null}
        </form>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--text-forest-light)",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
