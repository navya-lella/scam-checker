# Person C — The UI 🎨

**You own:** how the result *looks* — `renderResult()` in `extension/popup.js`, the web page `web/app/page.tsx`, and the CSS. You build against the **mock**, so you never need the backend or the extension plumbing to work.

## Your job
Make the ✅ / ⚠️ / ❌ result screen clear and senior-friendly. It receives a contract object:

```ts
{ verdict, riskScore, headline, reasons[], advice[], shouldAlertFamily, familyAlertMessage }
```

Show:
- A big **traffic light**: green ✅ safe / yellow ⚠️ unsure / red ❌ scam (3 states — no pure red/green binary).
- The `headline` large and plain.
- `reasons` and `advice` as short lists.
- When `shouldAlertFamily`, an **"Alert a family member"** button (pre-fills an email with `familyAlertMessage`).

Design for seniors: big text (18px+), high contrast, big tap targets, no jargon.

## Test yourself (no backend needed)
- In `extension/popup.js`, set `USE_MOCK = true` → reload the extension → you'll always see the mock result. Design against that.
- Or run the web page: `cd web && npm install && npm run dev` → localhost:3000 (its API returns the mock with no key).

## Vibe-code prompt to paste
> "Redesign this result UI for older adults: a large traffic-light verdict (green/yellow/red with icon), big readable headline, clean reasons + advice lists, and a prominent 'Alert a family member' button. Keep it driven by this data shape [paste contract.ts]. Make it work in a 340px-wide extension popup AND as a full web page."

## Done = mock result renders as a clear, friendly, 3-state screen in both the popup and the web page.
