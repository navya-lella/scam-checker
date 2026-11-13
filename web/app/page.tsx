"use client";

import { useState } from "react";
import type { ScamCheckResult } from "@/lib/contract";

// The clickable web version (for the judge). Same /api/check brain as the extension.
export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  const icon = { safe: "✅", unsure: "⚠️", scam: "❌" };

  return (
    <main>
      <h1>Is this a scam?</h1>
      <p>Paste the suspicious text or email below and press Check.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <br />
      <button onClick={check} disabled={loading || !text.trim()}>
        {loading ? "Checking…" : "Check this message"}
      </button>

      {result && (
        <div className={`card ${result.verdict}`}>
          <div className={`verdict ${result.verdict}`}>
            {icon[result.verdict]} {result.headline}
          </div>
          <p><strong>Why:</strong></p>
          <ul>{result.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <p><strong>What to do:</strong></p>
          <ul>{result.advice.map((a, i) => <li key={i}>{a}</li>)}</ul>
          {result.shouldAlertFamily && (
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent("Can you check this message?")}&body=${encodeURIComponent(result.familyAlertMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>Alert a family member</button>
            </a>
          )}
        </div>
      )}
    </main>
  );
}
