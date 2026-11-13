// ============================================================
// THE CONTRACT — single source of truth for the whole project.
// Every piece (brain, extension, UI) agrees on THIS shape.
// Do not change a field name without telling the team.
// ============================================================

export type Verdict = "safe" | "unsure" | "scam";

export interface ScamCheckResult {
  verdict: Verdict; // the traffic light: safe=green, unsure=yellow, scam=red
  riskScore: number; // 0-100, higher = more likely a scam
  headline: string; // one plain-language sentence a senior reads at a glance
  reasons: string[]; // 2-4 short reasons WHY (plain language)
  advice: string[]; // 2-4 short, calm next steps
  shouldAlertFamily: boolean; // the "agentic" trigger
  familyAlertMessage: string; // pre-drafted message to a trusted family member
}
