import Link from "next/link";
import Nav from "@/components/Nav";
import { getTopics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function OutdoorsPage() {
  const topics = getTopics("outdoors");
  return (
    <>
      <Nav />
      <div className="container">
        <div className="section-header">
          <h2>Outdoors</h2>
          <p className="section-description">
            Thoughts on nature, hiking, landscapes, weather, and outdoor
            experiences. Emphasis on wonder, practical wisdom, and appreciation
            for the natural world.
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
                href={`/topic/outdoors/${topic.id}`}
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
