"use client";

import { FormEvent, useMemo, useState } from "react";

type Book = { key: string; title?: string; author_name?: string[]; first_publish_year?: number; cover_i?: number; ebook_access?: string; ia?: string[]; publisher?: string[] };

const coverUrl = (id?: number) => id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : "https://placehold.co/180x250/111827/93c5fd?text=No+Cover";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [access, setAccess] = useState("all");
  const [sort, setSort] = useState("relevance");

  async function searchBooks(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=30&fields=key,title,author_name,first_publish_year,cover_i,ebook_access,ia,publisher`);
      if (!response.ok) throw new Error("Search service is unavailable right now.");
      const data = await response.json();
      setResults(data.docs ?? []);
    } catch (err) { setResults([]); setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  const filteredResults = useMemo(() => {
    const filtered = results.filter((book) => access === "readable" ? book.ebook_access === "public" || (book.ia?.length ?? 0) > 0 : access === "borrow" ? book.ebook_access === "borrowable" : true);
    if (sort === "year") return [...filtered].sort((a,b) => (b.first_publish_year ?? 0) - (a.first_publish_year ?? 0));
    if (sort === "title") return [...filtered].sort((a,b) => (a.title ?? "").localeCompare(b.title ?? ""));
    return filtered;
  }, [results, access, sort]);

  return <main className="page-shell">
    <nav className="nav"><a className="brand" href="#">📚 BookFinder <span>AI</span></a><div className="nav-links"><a href="#results">Browse</a><a href="#how">How it works</a><button className="signin">Sign in</button></div></nav>
    <section className="hero">
      <div className="badge">✦ AI-powered learning library</div>
      <h1>Find books.<br /><span>Start learning.</span></h1>
      <p>Search millions of books and discover legitimate open-access and library resources in one simple place.</p>
      <form className="search-box" onSubmit={searchBooks}><span className="search-icon">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by book, author, ISBN, or topic..." aria-label="Book search" /><button type="submit">Search</button></form>
      <div className="quick-searches">Try: <button type="button" onClick={() => { setQuery("Atomic Habits"); }}>Atomic Habits</button><button type="button" onClick={() => { setQuery("physics"); }}>Physics</button><button type="button" onClick={() => { setQuery("Harry Potter"); }}>Harry Potter</button></div>
    </section>
    <section id="results" className="results-section">
      <div className="section-heading"><div><p className="eyebrow">DISCOVER</p><h2>{results.length ? `${filteredResults.length} books found` : "Your book search starts here"}</h2></div>{results.length > 0 && <div className="filters"><select value={access} onChange={(e) => setAccess(e.target.value)}><option value="all">All access</option><option value="readable">Read online</option><option value="borrow">Borrow</option></select><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="relevance">Relevance</option><option value="year">Newest</option><option value="title">Title</option></select></div>}</div>
      {loading && <div className="status">Searching the library…</div>}
      {error && <div className="status error">{error}</div>}
      {!loading && !error && results.length === 0 && <div className="empty"><div className="empty-icon">🔎</div><h3>Search for any book</h3><p>We’ll bring back titles, authors, publication details, covers, and available reading options.</p></div>}
      <div className="book-grid">{filteredResults.map((book) => { const readId = book.ia?.[0]; const openUrl = `https://openlibrary.org${book.key}`; return <article className="book-card" key={book.key}><img src={coverUrl(book.cover_i)} alt="" loading="lazy" /><div className="book-info"><div className="book-title">{book.title ?? "Untitled"}</div><div className="author">{book.author_name?.slice(0,2).join(", ") || "Unknown author"}</div><div className="meta">{book.first_publish_year || "Year unknown"}{book.publisher?.[0] ? ` · ${book.publisher[0]}` : ""}</div><div className="card-actions">{readId ? <a className="read-btn" href={`https://archive.org/details/${readId}`} target="_blank" rel="noreferrer">Read / borrow ↗</a> : <a className="outline-btn" href={openUrl} target="_blank" rel="noreferrer">View editions ↗</a>}</div></div></article>; })}</div>
    </section>
    <section id="how" className="features"><div><div className="feature-icon">🔎</div><h3>Smart discovery</h3><p>Search titles, authors, ISBNs and topics with fast library-powered results.</p></div><div><div className="feature-icon">📖</div><h3>Legal access</h3><p>Surface public-domain, open-access and library borrowing options instead of random pirate copies.</p></div><div><div className="feature-icon">✨</div><h3>AI study tools</h3><p>Next, we can add summaries, explanations, notes and source-based study assistance.</p></div></section>
    <footer>BookFinder AI · Built for students · Search powered by Open Library</footer>
  </main>;
}
