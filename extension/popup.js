// ============================================================
// Chrome extension popup. Opens when the user clicks the icon
// AFTER highlighting a suspicious message on any page.
// ============================================================

// Navya (integrator): after you deploy, swap this for your Vercel URL.
const API_BASE = "http://localhost:3000";

// Person C: set this to true to design the UI without the backend running.
const USE_MOCK = false;

const MOCK = {
  verdict: "scam",
  riskScore: 88,
  headline: "This looks like a scam. Don't reply, click, or pay anything.",
  reasons: ["Creates urgency.", "Asks for gift-card payment.", "Sender address is wrong."],
  advice: ["Don't click any links.", "Contact the company through their real number.", "Talk to family before paying."],
  shouldAlertFamily: true,
  familyAlertMessage: "Hi — a scam checker flagged a message I got. I haven't replied. Can you look with me?",
};

const app = document.getElementById("app");
const say = (html) => (app.innerHTML = html);

// ---------- SLOT: PERSON B (plumbing) ----------
// Grabs whatever text the user highlighted on the current page.
async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString(),
  });
  return (result || "").trim();
}

// Sends the text to the brain and returns a ScamCheckResult.
async function checkText(text) {
  if (USE_MOCK) return MOCK;
  const res = await fetch(`${API_BASE}/api/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

// ---------- SLOT: PERSON C (UI) ----------
// Render a ScamCheckResult. Make this the nice traffic-light screen.
function renderResult(r) {
  const icon = { safe: "✅", unsure: "⚠️", scam: "❌" }[r.verdict];
  const alert = r.shouldAlertFamily
    ? `<button id="alert">Alert a family member</button>`
    : "";
  say(`
    <div class="verdict ${r.verdict}">${icon} ${r.headline}</div>
    <strong>Why:</strong>
    <ul>${r.reasons.map((x) => `<li>${x}</li>`).join("")}</ul>
    <strong>What to do:</strong>
    <ul>${r.advice.map((x) => `<li>${x}</li>`).join("")}</ul>
    ${alert}
  `);
  const btn = document.getElementById("alert");
  if (btn)
    btn.onclick = () =>
      chrome.tabs.create({
        url: `mailto:?subject=Can you check this?&body=${encodeURIComponent(r.familyAlertMessage)}`,
      });
}

// ---------- wiring (Person B / Navya) ----------
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const text = USE_MOCK ? "demo" : await getSelectedText();
    if (!text) {
      say(`<p class="muted">Highlight the suspicious text on the page first, then click this icon again.</p>`);
      return;
    }
    say(`<p class="muted">Checking…</p>`);
    renderResult(await checkText(text));
  } catch (e) {
    say(`<p class="muted">Something went wrong: ${e.message}</p>`);
  }
});
