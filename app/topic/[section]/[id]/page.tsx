import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { getTopic } from "@/lib/db";
import { getQuote } from "@/lib/db";

export const dynamic = "force-dynamic";

const SECTIONS: Record<string, string> = {
  countries: "countries",
  outdoors: "outdoors",
  guides: "guides",
  quotes: "quotes",
};

export default async function TopicPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  if (!SECTIONS[section]) notFound();

  if (section === "quotes") {
    const quote = getQuote(id);
    if (!quote) notFound();
    return (
      <>
        <Nav />
        <div className="topic-detail">
          <div className="back-link">
            <Link href="/quotes">← Back</Link>
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

  const topic = getTopic(section, id);
  if (!topic) notFound();

  const backHref = `/${section}`;
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
          {topic.content || topic.preview}
        </div>
      </div>
    </>
  );
}
