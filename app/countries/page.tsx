"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import type { Topic } from "@/lib/supabase";

export default function CountriesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    void supabase
      .from("topics")
      .select("id, section, title, photo, preview, content")
      .eq("section", "countries")
      .then(({ data }) => {
        setTopics(data ?? []);
        setLoading(false);
      })
      .then(undefined, () => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <div className="container">
        <div className="section-header">
          <h2>Countries</h2>
          <p className="section-description">
            Places I&apos;ve visited, studied, or simply found fascinating. Each
            entry is a snapshot of culture, history, food, or an insight that
            stuck with me.
          </p>
        </div>
        <div className="entries-grid">
          {loading ? (
            <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
              Loading…
            </p>
          ) : topics.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
              No topics yet.
            </p>
          ) : (
            topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topic?section=countries&id=${encodeURIComponent(topic.id)}`}
                className="entry-card"
              >
                {topic.photo ? (
                  <img
                    src={topic.photo}
                    alt={topic.title}
                    className="entry-image"
                  />
                ) : null}
                <div className="entry-content">
                  <h3 className="entry-title">{topic.title}</h3>
                  {topic.preview ? (
                    <p className="entry-preview">{topic.preview}</p>
                  ) : null}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
