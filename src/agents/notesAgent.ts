import { callGemini } from "../lib/geminiClient";

export interface NotesRequest {
  subject: string;
  topic: string;
  detailLevel: "short" | "medium" | "detailed";
}

export async function generateNotes(req: NotesRequest): Promise<string> {
  const prompt = `You are the Notes Generator Agent in an academic assistant.

Subject: ${req.subject}
Topic: ${req.topic}
Detail level: ${req.detailLevel}

Create revision-friendly notes with:
- Clear headings
- Bullet points
- Simple examples
- Definitions and key formulas (if any)

Keep it easy to understand for a college student.`;

  return callGemini(prompt);
}
