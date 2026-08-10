"use client";

import { useMemo, useState } from "react";

type Source = { title: string; type: string; author?: string; year?: number };

const demoSources: Source[] = [
  { title: "Your selected books and library sources", type: "Books" },
  { title: "Reports, articles and open-access material", type: "Research" },
  { title: "Notes and summaries you add", type: "Your notes" },
];

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const sources = useMemo(() => demoSources, []);

  async function research() {
    if (!topic.trim() && !question.trim()) return;
    setLoading(true); setAnswer("");
    try {
      const res = await fetch("/api/research", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ topic, question }) });
      const data = await res.json();
      setAnswer(data.answer || data.message || "No result returned.");
    } catch { setAnswer("Research service is not configured yet. Add the AI provider key in production to enable live synthesis."); }
    finally { setLoading(false); }
  }

  return <main className="research-page">
    <nav className="nav"><a className="brand" href="/">📚 BookFinder <span>AI</span></a><div className="nav-links"><a href="/">Search</a><a href="/pricing">Pro</a></div></nav>
    <section className="research-hero"><p className="eyebrow">PRO RESEARCH LAB</p><h1>Turn many sources into <span>clear thinking.</span></h1><p>Build a source-grounded study workspace for books, reports, articles and your own notes. The assistant is designed to explain and organize—not replace your thinking.</p></section>
    <section className="research-grid">
      <aside className="source-panel"><p className="eyebrow">SOURCE STACK</p><h2>Your research shelf</h2>{sources.map((s) => <div className="source-item" key={s.type}><div className="source-icon">{s.type === "Books" ? "📚" : s.type === "Research" ? "⌁" : "✎"}</div><div><b>{s.title}</b><small>{s.type}</small></div></div>)}<a className="add-source" href="/">+ Find a book to add</a></aside>
      <section className="workspace"><label>Research topic</label><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Causes of climate change" /><label>What do you need to understand?</label><textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask for an explanation, comparison, outline, study notes, or source synthesis…" rows={6}/><button className="research-btn" onClick={research} disabled={loading}>{loading ? "Synthesizing…" : "Start research →"}</button>{answer && <article className="answer"><div className="answer-label">AI RESEARCH NOTE</div><p>{answer}</p></article>}</section>
    </section>
    <footer>BookFinder AI · Pro research tools should be used with source checking and your school's academic-integrity rules.</footer>
  </main>;
}
