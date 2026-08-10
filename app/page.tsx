"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <main style={{ minHeight: "100vh", padding: "28px 6vw", background: "radial-gradient(circle at top, #18213d 0, #070a12 45%)" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <strong style={{ fontSize: 22 }}>📚 BookFinder AI</strong>
        <button style={{ border: "1px solid #334155", background: "#111827", color: "white", borderRadius: 10, padding: "10px 16px" }}>Sign in</button>
      </nav>

      <section style={{ maxWidth: 900, margin: "110px auto 0", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "7px 12px", borderRadius: 999, background: "#172554", color: "#93c5fd", fontSize: 13, marginBottom: 18 }}>AI-powered learning library</div>
        <h1 style={{ fontSize: "clamp(44px, 8vw, 78px)", lineHeight: 1.02, margin: 0 }}>Find. Read. <span style={{ color: "#60a5fa" }}>Learn.</span></h1>
        <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 650, margin: "22px auto 34px" }}>Search books and trusted public resources, read supported documents in-site, and use AI to study across your sources.</p>

        <div style={{ display: "flex", gap: 10, maxWidth: 720, margin: "0 auto", background: "#0f172a", padding: 8, border: "1px solid #334155", borderRadius: 16 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a book, author, ISBN, or topic..." style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", color: "white", padding: "14px 16px" }} />
          <button onClick={() => alert(query ? `Searching for: ${query}` : "Enter a book or topic first") } style={{ border: 0, background: "#2563eb", color: "white", borderRadius: 11, padding: "0 22px", fontWeight: 700, cursor: "pointer" }}>Search</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 60, textAlign: "left" }}>
          {[['🔎','Smart Search','Search across supported legal and open-access sources.'],['📖','In-site Reader','Read supported PDFs and documents without leaving the platform.'],['✨','AI Study','Summarize, explain, compare, and organize your study material.']].map(([icon,title,text]) => <div key={title} style={{ background: "rgba(15,23,42,.72)", border: "1px solid #1e293b", borderRadius: 18, padding: 22 }}><div style={{ fontSize: 28 }}>{icon}</div><h3>{title}</h3><p style={{ color: "#94a3b8", lineHeight: 1.6 }}>{text}</p></div>)}
        </div>
      </section>
    </main>
  );
}
