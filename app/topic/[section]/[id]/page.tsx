import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { getTopic, getTopics, getQuotes } from "@/lib/db";
import { getQuote } from "@/lib/db";

const SECTIONS = ["countries", "outdoors", "guides", "quotes"] as const;

export function generateStaticParams() {
  const params: { section: string; id: string }[] = [];
  for (const section of SECTIONS) {
    if (section === "quotes") {
      const quotes = getQuotes();
      quotes.forEach((q) => params.push({ section: "quotes", id: q.id }));
    } else {
      const topics = getTopics(section);
      topics.forEach((t) => params.push({ section, id: t.id }));
    }
  }
  return params;
}

const SECTIONS_MAP: Record<string, string> = {
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
  if (!SECTIONS_MAP[section]) notFound();

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
