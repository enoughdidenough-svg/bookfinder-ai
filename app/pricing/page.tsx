"use client";

import { FormEvent, useState } from "react";

const WALLET = "TLPJSxHjfkfANiv9BueXDhXtSXe9dpDDrn";

export default function Pricing() {
  const [tx, setTx] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/payment/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ txHash: tx.trim() }) });
      const data = await response.json();
      setStatus(data.message || "Verification failed.");
    } catch { setStatus("Could not verify this transaction right now."); }
    finally { setBusy(false); }
  }

  async function copy() { await navigator.clipboard.writeText(WALLET); setStatus("Wallet address copied."); }

  return <main className="pricing-page">
    <nav className="nav pricing-nav"><a className="brand" href="/">📚 BookFinder <span>AI</span></a><a className="back" href="/">← Back to search</a></nav>
    <section className="pricing-hero"><p className="eyebrow">BOOKFINDER PRO</p><h1>Study from more.<br /><span>Understand faster.</span></h1><p>Unlock the advanced research workspace for students who need to work across books, reports, magazines and other legitimate sources.</p></section>
    <section className="plan-wrap"><article className="plan-card"><div className="popular">STUDENT PRO</div><div className="price"><span>$</span>5 <small>/ month</small></div><p className="plan-copy">One simple monthly plan. Crypto only.</p><ul><li>Multi-source research workspace</li><li>AI explanations and study notes</li><li>Source-grounded assignment assistance</li><li>Saved research and reading lists</li><li>Priority access to new AI tools</li></ul><div className="payment-box"><h3>Pay with USDT on TRON</h3><p>Send exactly <b>5 USDT (TRC20)</b> to this wallet:</p><div className="wallet"><code>{WALLET}</code><button onClick={copy}>Copy</button></div><p className="warning">Only send USDT using the TRON / TRC20 network to avoid losing funds.</p><form onSubmit={verify}><label htmlFor="tx">Transaction hash</label><input id="tx" value={tx} onChange={(e) => setTx(e.target.value)} placeholder="Paste your TRON transaction hash" required /><button className="verify-btn" disabled={busy}>{busy ? "Verifying…" : "Verify payment →"}</button></form>{status && <div className="payment-status">{status}</div>}</div></article></section>
    <section className="trust-note"><h2>Built for real study, not answer dumping.</h2><p>BookFinder Pro is designed to help students understand sources, compare ideas, structure research and produce original work. Users remain responsible for checking sources and following their school's academic-integrity rules.</p></section>
    <footer>BookFinder AI · Payments are processed on-chain · Never share your wallet seed phrase or private key</footer>
  </main>;
}
