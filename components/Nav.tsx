"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Nav({ showAdmin: forceShowAdmin }: { showAdmin?: boolean } = {}) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
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
            <Link href="/countries/">Countries</Link>
          </li>
          <li>
            <Link href="/outdoors/">Outdoors</Link>
          </li>
          <li>
            <Link href="/quotes/">Quotes</Link>
          </li>
          <li>
            <Link href="/guides/">Guides</Link>
          </li>
          {showAdmin && (
            <li>
              <Link href="/admin/">Admin</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
