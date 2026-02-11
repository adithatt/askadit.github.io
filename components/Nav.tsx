"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav({ showAdmin: forceShowAdmin }: { showAdmin?: boolean } = {}) {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((data) => setAuthenticated(!!data?.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);
  const showAdmin = forceShowAdmin ?? authenticated;
  return (
    <nav>
      <div className="nav-container">
        <Link href="/" className="logo">
          Ask Adit
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/countries">Countries</Link>
          </li>
          <li>
            <Link href="/outdoors">Outdoors</Link>
          </li>
          <li>
            <Link href="/quotes">Quotes</Link>
          </li>
          <li>
            <Link href="/guides">Guides</Link>
          </li>
          {showAdmin && (
            <li>
              <Link href="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
