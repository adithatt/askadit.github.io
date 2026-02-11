import Link from "next/link";
import Nav from "@/components/Nav";
import { getTopics } from "@/lib/db";

export default function CountriesPage() {
  const topics = getTopics("countries");
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
          {topics.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>
              No topics yet.
            </p>
          ) : (
            topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topic/countries/${topic.id}/`}
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
