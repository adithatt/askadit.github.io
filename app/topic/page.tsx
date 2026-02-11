"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import type { Topic, Quote } from "@/lib/supabase";

const SECTIONS = ["countries", "outdoors", "guides", "quotes"];

function TopicContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const id = searchParams.get("id");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!section || !id || !supabase) {
      setLoading(false);
      if (section && id && !supabase) setNotFound(true);
      return;
    }
    if (!SECTIONS.includes(section)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    if (section === "quotes") {
      void supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          setLoading(false);
          if (error || !data) setNotFound(true);
          else setQuote(data as Quote);
        })
        .then(undefined, () => {
          setLoading(false);
          setNotFound(true);
        });
    } else {
      void supabase
        .from("topics")
        .select("*")
        .eq("section", section)
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          setLoading(false);
          if (error || !data) setNotFound(true);
          else setTopic(data as Topic);
        })
        .then(undefined, () => {
          setLoading(false);
          setNotFound(true);
        });
    }
  }, [section, id]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container">
          <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
            Loading…
          </p>
        </div>
      </>
    );
  }

  if (notFound || (!topic && !quote)) {
    return (
      <>
        <Nav />
        <div className="container">
          <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
            Not found.
          </p>
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link href="/" style={{ color: "var(--text-forest-light)" }}>
              ← Home
            </Link>
          </p>
        </div>
      </>
    );
  }

  if (quote) {
    return (
      <>
        <Nav />
        <div className="topic-detail">
          <div className="back-link">
            <Link href="/quotes/">← Back</Link>
          </div>
          <div
            className="quote-card"
            style={{
              borderLeft: "3px solid var(--text-forest)",
              padding: "2rem",
            }}
          >
            <div className="quote-text">&ldquo;{quote.quote_text}&rdquo;</div>
            <div className="quote-attribution">— {quote.author}</div>
            {quote.reflection ? (
              <div className="quote-reflection">{quote.reflection}</div>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  if (topic) {
    const backHref = `/${topic.section}/`;
    return (
      <>
        <Nav />
        <div className="topic-detail">
          <div className="back-link">
            <Link href={backHref}>← Back</Link>
          </div>
          {topic.photo ? (
            <img
              src={topic.photo}
              alt={topic.title}
              className="topic-detail-image"
            />
          ) : null}
          <h1 className="topic-detail-title">{topic.title}</h1>
          <div className="topic-detail-content">
            {topic.content || topic.preview || ""}
          </div>
        </div>
      </>
    );
  }

  return null;
}

export default function TopicPage() {
  return (
    <Suspense fallback={
      <>
        <Nav />
        <div className="container">
          <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>Loading…</p>
        </div>
      </>
    }>
      <TopicContent />
    </Suspense>
  );
}
