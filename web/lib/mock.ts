import type { ScamCheckResult } from "./contract";

// Shared fake response. Every frontend builds against THIS until the
// real /api/check is wired in. It matches the contract exactly.
export const MOCK_RESULT: ScamCheckResult = {
  verdict: "scam",
  riskScore: 88,
  headline: "This looks like a scam. Don't reply, click, or pay anything.",
  reasons: [
    "It creates urgency ('act within 24 hours or your account closes').",
    "It asks you to pay with gift cards — real companies never do this.",
    "The sender's address doesn't match the real company.",
  ],
  advice: [
    "Do not click any links or call the number in the message.",
    "If you're worried about an account, contact the company using the number on your card or their official website.",
    "Talk to a family member before sending any money.",
  ],
  shouldAlertFamily: true,
  familyAlertMessage:
    "Hi — I got a message that a scam-checking tool flagged as likely fraud (it asks for gift-card payment and says my account is locked). I haven't replied yet. Can you look at it with me before I do anything?",
};
