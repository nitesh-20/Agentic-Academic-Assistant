import { callGemini } from "../lib/geminiClient";

export interface DoubtRequest {
  subject: string;
  question: string;
}

export async function solveDoubt(req: DoubtRequest): Promise<string> {
  const prompt = `You are the Doubt Solver Agent in an academic assistant.

Subject: ${req.subject}
Student question: ${req.question}

Answer with:
1. Step-by-step explanation
2. If numerical, show all steps clearly
3. Give 1-2 simple examples
4. Keep tone friendly and teacher-like.`;

  return callGemini(prompt);
}
