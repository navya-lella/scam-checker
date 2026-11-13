import { NextRequest, NextResponse } from "next/server";
import type { ScamCheckResult } from "@/lib/contract";
import { MOCK_RESULT } from "@/lib/mock";

// CORS so the Chrome extension (a different origin) can call this endpoint.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// Free model on Groq (no credit card). Swap to "openai/gpt-oss-20b" if you want it faster.
const MODEL = "openai/gpt-oss-120b";

// ============================================================
// SLOT: PERSON A (THE BRAIN)
// You own the SYSTEM prompt below. Everyone else gets MOCK_RESULT
// until a key is set, so you are never blocking them. Test with:
//   curl -X POST localhost:3000/api/check -H 'content-type: application/json' \
//        -d '{"text":"Your account is locked, pay with gift cards now"}'
// ============================================================
export async function POST(req: NextRequest) {
  let text = "";
  try {
    ({ text } = await req.json());
  } catch {
    return json({ error: "Send { text: string }" }, 400);
  }
  if (!text || typeof text !== "string") {
    return json({ error: "Send { text: string }" }, 400);
  }

  // No key yet? Hand back the mock so the rest of the team keeps moving.
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return json(MOCK_RESULT);
  }

  const SYSTEM = `You are a scam-detection assistant for older adults. You read a suspicious text message or email and judge whether it is a scam.

Return ONLY a JSON object (no markdown, no prose) with exactly these fields:
- verdict: "safe" | "unsure" | "scam"
- riskScore: integer 0-100 (higher = more likely a scam)
- headline: one short plain-language sentence (<=120 chars) a senior understands at a glance
- reasons: array of 2-4 short plain-language reasons
- advice: array of 2-4 short, calm, concrete next steps
- shouldAlertFamily: boolean (true when verdict is "scam" or risk is high and money/credentials are at stake)
- familyAlertMessage: a short, warm message the user could send a trusted family member asking for help, mentioning why it was flagged

Rules:
- Be cautious. If unsure, use "unsure" — never a false "safe".
- Plain language, no jargon, short sentences.
- Never tell them to click links or call numbers from the message.`;

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Message to check:\n\n${text}` },
        ],
      }),
    });
    if (!r.ok) {
      return json({ error: `Groq ${r.status}: ${await r.text()}` }, 502);
    }
    const data = await r.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    const slice = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const result = JSON.parse(slice) as ScamCheckResult;
    return json(result);
  } catch (e) {
    return json({ error: "Could not analyze the message. " + String(e) }, 502);
  }
}
