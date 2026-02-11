"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import type { Quote } from "@/lib/supabase";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    void supabase
      .from("quotes")
      .select("id, quote_text, author, reflection")
      .then(({ data }) => {
        setQuotes(data ?? []);
        setLoading(false);
      })
      .then(undefined, () => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <div className="container">
        <div className="section-header">
          <h2>Quotes</h2>
          <p className="section-description">
            A curated collection of meaningful, clever, or motivating quotes
            that have stuck with me, along with brief reflections on why they
            matter.
          </p>
        </div>
        <div className="entries-grid" style={{ gridTemplateColumns: "1fr" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
              Loading…
            </p>
          ) : quotes.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
              No quotes yet.
            </p>
          ) : (
            quotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/topic?section=quotes&id=${encodeURIComponent(quote.id)}`}
                className="quote-card"
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="quote-text">&ldquo;{quote.quote_text}&rdquo;</div>
                <div className="quote-attribution">— {quote.author}</div>
                {quote.reflection ? (
                  <div className="quote-reflection">
                    {quote.reflection.length > 150
                      ? quote.reflection.slice(0, 150) + "..."
                      : quote.reflection}
                  </div>
                ) : null}
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
