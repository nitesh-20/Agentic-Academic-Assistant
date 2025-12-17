import { callGemini } from "../lib/geminiClient";

export interface SyllabusPlanRequest {
  syllabusText: string;
  examDate: string; // ISO date string
  daysAvailable: number;
}

export async function generateSyllabusPlan(req: SyllabusPlanRequest): Promise<string> {
  const prompt = `You are the Syllabus Planner Agent in an academic assistant.

User syllabus:
${req.syllabusText}

Exam date: ${req.examDate}
Days available: ${req.daysAvailable}

1. Split the syllabus into units and topics.
2. Create a **day-wise study plan** for the available days.
3. Each day should have:
   - Topics list
   - Approx study time (in hours)
4. Output in clean, bullet-point format suitable for a college student.
`;

  return callGemini(prompt);
}
