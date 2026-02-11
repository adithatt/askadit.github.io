"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

type Topic = {
  id: string;
  title?: string;
  preview?: string;
  photo?: string;
  content?: string;
  quote?: string;
  quote_text?: string;
  attribution?: string;
  author?: string;
  reflection?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [section, setSection] = useState<"countries" | "outdoors" | "quotes" | "guides">("countries");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    image: "",
    preview: "",
    content: "",
    quote: "",
    attribution: "",
    reflection: "",
  });

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((data) => {
        const ok = !!data?.authenticated;
        setAuthenticated(ok);
        if (!ok) router.replace("/login/");
      })
      .catch(() => setAuthenticated(false));
  }, [router]);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    if (section === "quotes") {
      fetch("/api/quotes")
        .then((r) => r.json())
        .then((data) => setTopics(Array.isArray(data) ? data : []))
        .catch(() => setTopics([]))
        .finally(() => setLoading(false));
    } else {
      fetch(`/api/topics?section=${section}`)
        .then((r) => r.json())
        .then((data) => setTopics(Array.isArray(data) ? data : []))
        .catch(() => setTopics([]))
        .finally(() => setLoading(false));
    }
  }, [authenticated, section]);

  async function loadSection(s: typeof section) {
    setSection(s);
    setFormVisible(false);
    setEditingId(null);
  }

  function showForm() {
    setForm({
      title: "",
      image: "",
      preview: "",
      content: "",
      quote: "",
      attribution: "",
      reflection: "",
    });
    setEditingId(null);
    setFormVisible(true);
  }

  function hideForm() {
    setFormVisible(false);
    setEditingId(null);
    setLoading(true);
    if (section === "quotes") {
      fetch("/api/quotes").then((r) => r.json()).then((data) => setTopics(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
    } else {
      fetch(`/api/topics?section=${section}`).then((r) => r.json()).then((data) => setTopics(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
    }
  }

  async function editTopic(id: string) {
    if (section === "quotes") {
      const res = await fetch(`/api/quotes/${id}`);
      const q = await res.json();
      setForm({
        title: "",
        image: "",
        preview: "",
        content: "",
        quote: q.quote_text || "",
        attribution: q.author || "",
        reflection: q.reflection || "",
      });
    } else {
      const res = await fetch(`/api/topics/${section}/${id}`);
      const t = await res.json();
      setForm({
        title: t.title || "",
        image: t.photo || "",
        preview: t.preview || "",
        content: t.content || "",
        quote: "",
        attribution: "",
        reflection: "",
      });
    }
    setEditingId(id);
    setFormVisible(true);
  }

  async function saveTopic(e: React.FormEvent) {
    e.preventDefault();
    if (section === "quotes") {
      const payload = editingId
        ? { id: editingId, quote_text: form.quote, author: form.attribution, reflection: form.reflection }
        : { quote_text: form.quote, author: form.attribution, reflection: form.reflection };
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/quotes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      if (!res.ok) {
        alert("Failed to save.");
        return;
      }
    } else {
      const payload = editingId
        ? { section, id: editingId, title: form.title, photo: form.image, preview: form.preview, content: form.content }
        : { section, title: form.title, photo: form.image, preview: form.preview, content: form.content };
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/topics", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        alert("Failed to save.");
        return;
      }
    }
    hideForm();
  }

  async function deleteTopic(id: string) {
    if (!confirm("Are you sure you want to delete this?")) return;
    if (section === "quotes") {
      await fetch(`/api/admin/quotes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } else {
      await fetch(`/api/admin/topics?section=${encodeURIComponent(section)}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    }
    hideForm();
  }

  async function logout() {
    if (!confirm("Log out?")) return;
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (authenticated === null) {
    return (
      <>
        <Nav />
        <div className="container">
          <p>Loading…</p>
        </div>
      </>
    );
  }

  if (!authenticated) return null;

  return (
    <>
      <Nav showAdmin />
      <div className="container" style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-soft)" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Admin Panel</h1>
          <div>
            <Link href="/" style={{ marginRight: "1rem", color: "var(--text-forest-light)", textDecoration: "none" }}>View Site</Link>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                color: "var(--text-forest)",
                border: "1px solid var(--border-soft)",
                borderRadius: "4px",
                fontFamily: "inherit",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {(["countries", "outdoors", "quotes", "guides"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => loadSection(s)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid var(--border-soft)",
                borderRadius: "4px",
                background: section === s ? "var(--hover-bg)" : "transparent",
                color: section === s ? "var(--text-forest)" : "var(--text-forest-light)",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {!formVisible && (
          <div style={{ marginBottom: "2rem" }}>
            <button
              type="button"
              onClick={showForm}
              style={{
                padding: "0.75rem 1.5rem",
                background: "var(--text-forest)",
                color: "var(--bg-cream)",
                border: "none",
                borderRadius: "4px",
                fontFamily: "inherit",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Add {section === "quotes" ? "Quote" : "Topic"}
            </button>
          </div>
        )}

        {formVisible && (
          <form
            onSubmit={saveTopic}
            style={{
              border: "1px solid var(--border-soft)",
              borderRadius: "4px",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>{editingId ? "Edit" : "Add"} {section === "quotes" ? "Quote" : "Topic"}</h2>
            {section === "quotes" ? (
              <>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Quote</label>
                  <textarea
                    value={form.quote}
                    onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "100px" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Attribution</label>
                  <input
                    type="text"
                    value={form.attribution}
                    onChange={(e) => setForm((f) => ({ ...f, attribution: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Reflection</label>
                  <textarea
                    value={form.reflection}
                    onChange={(e) => setForm((f) => ({ ...f, reflection: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "100px" }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Preview</label>
                  <textarea
                    value={form.preview}
                    onChange={(e) => setForm((f) => ({ ...f, preview: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "80px" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "120px" }}
                  />
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={hideForm} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button type="submit" style={{ padding: "0.75rem 1.5rem", background: "var(--text-forest)", color: "var(--bg-cream)", border: "none", borderRadius: "4px", fontFamily: "inherit", cursor: "pointer" }}>Save</button>
            </div>
          </form>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>Loading…</p>
        ) : topics.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>No items yet. Click Add to create one.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {topics.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.5rem",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "4px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                    {section === "quotes" ? (t.quote || t.quote_text || "").slice(0, 60) + "…" : t.title}
                  </h3>
                  <p style={{ color: "var(--text-forest-light)", fontSize: "0.9rem" }}>
                    {section === "quotes" ? `— ${t.attribution || t.author}` : t.preview}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" onClick={() => editTopic(t.id)} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border-soft)", borderRadius: "4px", background: "transparent", fontFamily: "inherit", cursor: "pointer" }}>Edit</button>
                  <button type="button" onClick={() => deleteTopic(t.id)} style={{ padding: "0.5rem 1rem", border: "1px solid rgba(211,47,47,0.3)", borderRadius: "4px", background: "transparent", color: "#d32f2f", fontFamily: "inherit", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
