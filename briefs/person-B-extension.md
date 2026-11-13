# Person B — Extension Plumbing 🔌

**You own:** the wiring in `extension/popup.js` marked `SLOT: PERSON B`, plus `extension/manifest.json`. You make the extension grab the highlighted text and call the endpoint. You do **not** touch the look of the result (that's Person C) or Claude (that's Person A).

## Your job
1. User highlights a message on any page → clicks the icon.
2. `getSelectedText()` reads the selection off the active tab (scaffolded with `chrome.scripting`).
3. `checkText()` POSTs `{ text }` to `API_BASE/api/check` and returns the contract JSON.
4. Hand that result to `renderResult()` (Person C's function — just call it).

A working version is scaffolded. Your job is to make it robust: empty selection, very long selection (cap it), network error, server down.

## Test yourself
- Point `API_BASE` at `http://localhost:3000` with Person A's server running (or just leave it — the server returns the mock with no key).
- Load unpacked: `chrome://extensions` → Developer mode → Load unpacked → `extension/`.
- Highlight text on any site → click the icon → you should see a result.

## Vibe-code prompt to paste
> "This is a Manifest V3 Chrome extension popup. Harden popup.js: handle no text selected, truncate selections over 4000 chars, show a friendly message on fetch failure or non-200, and add a 10s timeout to the fetch. Don't change renderResult()."

## Done = highlight → click → a result shows, and it fails gracefully when there's no selection or the server is down.
