import { callGemini } from "../lib/geminiClient";

export interface ProgressTopic {
  topic: string;
  status: "completed" | "in_progress" | "not_started";
}

export interface ProgressAnalysisRequest {
  subject: string;
  topics: ProgressTopic[];
}

export async function analyzeProgress(req: ProgressAnalysisRequest): Promise<string> {
  const topicsText = req.topics
    .map((t, i) => `${i + 1}. ${t.topic} - ${t.status}`)
    .join("\n");

  const prompt = `You are the Progress Analyzer Agent in an academic assistant.

Subject: ${req.subject}
Current topic status:
${topicsText}

1. Identify weak or not-started areas.
2. Suggest how to adjust the study plan.
3. Give 3 concrete action points for the next 2 days.
4. Keep it short and motivating.`;

  return callGemini(prompt);
}
