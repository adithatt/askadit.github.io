"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";
import type { Topic, Quote } from "@/lib/supabase";

type TopicRow = (Topic | Quote) & { quote_text?: string; preview?: string };

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
}

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [section, setSection] = useState<"countries" | "outdoors" | "quotes" | "guides">("countries");
  const [items, setItems] = useState<TopicRow[]>([]);
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
    if (!supabase) {
      setAuthenticated(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      if (!session) router.replace("/login/");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      if (!session) router.replace("/login/");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authenticated || !supabase) return;
    setLoading(true);
    if (section === "quotes") {
      supabase
        .from("quotes")
        .select("*")
        .then(({ data }) => {
          setItems((data ?? []) as TopicRow[]);
          setLoading(false);
        })
        .then(undefined, () => setLoading(false));
    } else {
      supabase
        .from("topics")
        .select("*")
        .eq("section", section)
        .then(({ data }) => {
          setItems((data ?? []) as TopicRow[]);
          setLoading(false);
        })
        .then(undefined, () => setLoading(false));
    }
  }, [authenticated, section]);

  function loadSection(s: typeof section) {
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
    if (!supabase) return;
    setLoading(true);
    if (section === "quotes") {
      void supabase.from("quotes").select("*").then(({ data }) => {
        setItems((data ?? []) as TopicRow[]);
        setLoading(false);
      });
    } else {
      void supabase.from("topics").select("*").eq("section", section).then(({ data }) => {
        setItems((data ?? []) as TopicRow[]);
        setLoading(false);
      });
    }
  }

  async function editItem(id: string) {
    if (section === "quotes") {
      const { data: q } = await supabase!.from("quotes").select("*").eq("id", id).single();
      if (q) setForm({ title: "", image: "", preview: "", content: "", quote: (q as Quote).quote_text || "", attribution: (q as Quote).author || "", reflection: (q as Quote).reflection || "" });
    } else {
      const { data: t } = await supabase!.from("topics").select("*").eq("section", section).eq("id", id).single();
      if (t) setForm({ title: (t as Topic).title || "", image: (t as Topic).photo || "", preview: (t as Topic).preview || "", content: (t as Topic).content || "", quote: "", attribution: "", reflection: "" });
    }
    setEditingId(id);
    setFormVisible(true);
  }

  async function saveTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (section === "quotes") {
      const payload = { id: editingId || generateId(), quote_text: form.quote, author: form.attribution, reflection: form.reflection || null };
      if (editingId) {
        const { error } = await supabase.from("quotes").update({ quote_text: payload.quote_text, author: payload.author, reflection: payload.reflection }).eq("id", editingId);
        if (error) { alert(error.message); return; }
      } else {
        const { error } = await supabase.from("quotes").insert(payload);
        if (error) { alert(error.message); return; }
      }
    } else {
      const payload = { id: editingId || generateId(), section, title: form.title, photo: form.image || null, preview: form.preview || null, content: form.content || null };
      if (editingId) {
        const { error } = await supabase.from("topics").update({ title: payload.title, photo: payload.photo, preview: payload.preview, content: payload.content }).eq("section", section).eq("id", editingId);
        if (error) { alert(error.message); return; }
      } else {
        const { error } = await supabase.from("topics").insert(payload);
        if (error) { alert(error.message); return; }
      }
    }
    hideForm();
  }

  async function deleteItem(id: string) {
    if (!confirm("Are you sure you want to delete this?")) return;
    if (!supabase) return;
    if (section === "quotes") {
      await supabase.from("quotes").delete().eq("id", id);
    } else {
      await supabase.from("topics").delete().eq("section", section).eq("id", id);
    }
    hideForm();
  }

  async function logout() {
    if (!confirm("Log out?")) return;
    await supabase?.auth.signOut();
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
            <button type="button" onClick={logout} style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "var(--text-forest)", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", fontSize: "1rem", cursor: "pointer" }}>Logout</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {(["countries", "outdoors", "quotes", "guides"] as const).map((s) => (
            <button key={s} type="button" onClick={() => loadSection(s)} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border-soft)", borderRadius: "4px", background: section === s ? "var(--hover-bg)" : "transparent", color: section === s ? "var(--text-forest)" : "var(--text-forest-light)", fontFamily: "inherit", cursor: "pointer" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {!formVisible && (
          <div style={{ marginBottom: "2rem" }}>
            <button type="button" onClick={showForm} style={{ padding: "0.75rem 1.5rem", background: "var(--text-forest)", color: "var(--bg-cream)", border: "none", borderRadius: "4px", fontFamily: "inherit", fontSize: "1rem", cursor: "pointer" }}>
              Add {section === "quotes" ? "Quote" : "Topic"}
            </button>
          </div>
        )}

        {formVisible && (
          <form onSubmit={saveTopic} style={{ border: "1px solid var(--border-soft)", borderRadius: "4px", padding: "2rem", marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>{editingId ? "Edit" : "Add"} {section === "quotes" ? "Quote" : "Topic"}</h2>
            {section === "quotes" ? (
              <>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Quote</label>
                  <textarea value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} required style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "100px" }} />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Attribution</label>
                  <input type="text" value={form.attribution} onChange={(e) => setForm((f) => ({ ...f, attribution: e.target.value }))} required style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit" }} />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Reflection</label>
                  <textarea value={form.reflection} onChange={(e) => setForm((f) => ({ ...f, reflection: e.target.value }))} style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "100px" }} />
                </div>
              </>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit" }} />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit" }} />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Preview</label>
                  <textarea value={form.preview} onChange={(e) => setForm((f) => ({ ...f, preview: e.target.value }))} style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "80px" }} />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-forest-light)" }}>Content</label>
                  <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-soft)", borderRadius: "4px", fontFamily: "inherit", minHeight: "120px" }} />
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
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-forest-light)" }}>No items yet. Click Add to create one.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", border: "1px solid var(--border-soft)", borderRadius: "4px" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                    {section === "quotes" ? (t.quote_text || "").slice(0, 60) + "…" : (t as Topic).title}
                  </h3>
                  <p style={{ color: "var(--text-forest-light)", fontSize: "0.9rem" }}>
                    {section === "quotes" ? `— ${(t as Quote).author}` : (t as Topic).preview}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" onClick={() => editItem(t.id)} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border-soft)", borderRadius: "4px", background: "transparent", fontFamily: "inherit", cursor: "pointer" }}>Edit</button>
                  <button type="button" onClick={() => deleteItem(t.id)} style={{ padding: "0.5rem 1rem", border: "1px solid rgba(211,47,47,0.3)", borderRadius: "4px", background: "transparent", color: "#d32f2f", fontFamily: "inherit", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
