import Link from "next/link";
import Nav from "@/components/Nav";
import { getTopics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function GuidesPage() {
  const topics = getTopics("guides");
  return (
    <>
      <Nav />
      <div className="container">
        <div className="section-header">
          <h2>Guides</h2>
          <p className="section-description">
            Informal guides and explainers on topics I know well or find
            fascinating. Written like advice from a friend, not a
            textbook—clear, approachable, and concise.
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
                href={`/topic/guides/${topic.id}`}
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
