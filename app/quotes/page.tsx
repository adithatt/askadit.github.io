import Link from "next/link";
import Nav from "@/components/Nav";
import { getQuotes } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function QuotesPage() {
  const quotes = getQuotes();
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
          {quotes.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
              No quotes yet.
            </p>
          ) : (
            quotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/topic/quotes/${quote.id}`}
                className="quote-card"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
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
