"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Reader() {
  const params = useSearchParams();
  const archiveId = params.get("archive");
  const title = params.get("title") || "Book reader";

  if (!archiveId) {
    return <main className="reader-shell"><div className="reader-message"><h1>Reader link unavailable</h1><p>This book does not currently have a verified in-site reading source.</p><a href="/">← Back to BookFinder</a></div></main>;
  }

  const embedUrl = `https://archive.org/embed/${encodeURIComponent(archiveId)}`;

  return <main className="reader-shell">
    <header className="reader-header"><a className="reader-brand" href="/">📚 BookFinder <span>AI</span></a><div className="reader-title">{title}</div><a className="reader-back" href="/#results">← Back to results</a></header>
    <section className="reader-wrap">
      <div className="reader-notice">Verified library/archive reader · availability and lending rules are controlled by the source.</div>
      <iframe className="pdf-reader" src={embedUrl} title={title} allow="fullscreen" />
    </section>
  </main>;
}

export default function ReaderPage() {
  return <Suspense fallback={<main className="reader-shell"><div className="reader-message">Loading reader…</div></main>}><Reader /></Suspense>;
}
