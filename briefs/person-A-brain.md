# Person A — The Brain 🧠

**You own:** `web/app/api/check/route.ts` — the one function that takes a message and returns a verdict. You are the only person who touches Claude.

## Your job
`POST /api/check` receives `{ text: "the suspicious message" }` and must return JSON that **exactly** matches the contract in `web/lib/contract.ts`:

```ts
{ verdict, riskScore, headline, reasons[], advice[], shouldAlertFamily, familyAlertMessage }
```

A working version is already scaffolded. Your real work is **making the prompt good** (the `SYSTEM` string) and making sure the JSON always parses.

## Rules that matter
- **Never a false "safe."** When unsure, return `"unsure"`. A senior trusting a wrong green check is the worst outcome.
- Plain language, short sentences — a 75-year-old is reading this.
- Never advise clicking links/numbers from the message.

## Test yourself (no frontend needed)
```bash
cd web && npm install && npm run dev
# new terminal:
curl -X POST localhost:3000/api/check -H 'content-type: application/json' \
  -d '{"text":"URGENT: your bank account is locked. Buy $500 in gift cards to restore it."}'
```
You should get the JSON. Tune `SYSTEM` until the verdict/reasons/advice feel right across 5–6 example messages (get these from Person C's demo set).

## Vibe-code prompt to paste into your AI tool
> "In this Next.js App Router API route at app/api/check/route.ts, improve the Anthropic system prompt so it reliably returns strict JSON matching this TypeScript type [paste contract.ts]. Add a retry if JSON.parse fails. Keep the mock fallback when there's no API key."

## Done = curl returns valid contract JSON for scam / safe / borderline messages.
