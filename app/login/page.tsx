"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).catch(() => null);
    if (!res?.ok) {
      setError("Admin is only available when running locally (npm run dev).");
      return;
    }
    const data = await res.json();
    if (data.success) {
      router.push("/admin/");
      router.refresh();
    } else {
      setError("Invalid username or password");
    }
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
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-forest-light)",
                fontSize: "0.95rem",
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
