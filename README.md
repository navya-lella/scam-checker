# Scam Check 🛡️

A tool that tells older adults whether a suspicious text/email is a scam — in plain language, with one click. Highlight a message anywhere, click the extension, get a ✅ / ⚠️ / ❌ plus why and what to do, and optionally alert a family member.

**Theme:** AI for Social Good. **Deadline:** Saturday.

---

## How the pieces fit

```
[Chrome extension popup]  ─┐
                           ├──→  /api/check  ──→  Claude   (API key lives HERE, server-side)
[web page (judge link)]  ──┘         ↑ returns the ScamCheckResult JSON (the "contract")
```

The **contract** (`web/lib/contract.ts`) is the one shape everyone agrees on. Frontends build against `MOCK_RESULT` until the real endpoint is wired — so nobody waits on anybody.

---

## Who owns what (3 builders)

| Person | Slot | Files |
|---|---|---|
| **A — Brain** | the `/api/check` endpoint + the prompt | `web/app/api/check/route.ts` |
| **B — Extension plumbing** | grab highlighted text, call the endpoint, messaging | `extension/popup.js` (the SLOT: PERSON B parts) |
| **C — UI** | the ✅/⚠️/❌ result screen (extension popup + web page) | `extension/popup.js` (`renderResult`), `web/app/page.tsx`, CSS |

Full per-person instructions are in [`briefs/`](briefs/). **Navya integrates** (wires real endpoint, deploys).

---

## Run it locally

```bash
cd web
npm install
npm run dev     # http://localhost:3000  ← the web version
```

With no `ANTHROPIC_API_KEY` set, `/api/check` returns the mock, so everything runs immediately.

### Load the extension
1. Chrome → `chrome://extensions` → turn on **Developer mode** (top right)
2. **Load unpacked** → pick the `extension/` folder
3. Highlight text on any page → click the Scam Check icon

### Turn on the real AI (Navya)
```bash
cd web
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

### Deploy (Navya, ~2 min)
```bash
npm i -g vercel
cd web && vercel        # follow prompts; add ANTHROPIC_API_KEY in the Vercel dashboard
```
Then put the Vercel URL into `extension/popup.js` → `API_BASE`.

---

## Internal deadline: **Friday night.** Saturday = polish + rehearse the pitch.
