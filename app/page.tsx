import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="hero">
        <h1>Ask Adit</h1>
        <p className="tagline">
          A little repository of things I&apos;ve learned along the way
        </p>
      </div>
      <div className="nav-grid">
        <Link href="/countries" className="nav-card">
          <h2>Countries</h2>
        </Link>
        <Link href="/outdoors" className="nav-card">
          <h2>Outdoors</h2>
        </Link>
        <Link href="/quotes" className="nav-card">
          <h2>Quotes</h2>
        </Link>
        <Link href="/guides" className="nav-card">
          <h2>Guides</h2>
        </Link>
      </div>
    </>
  );
}
