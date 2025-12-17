import { callGemini } from "../lib/geminiClient";

export interface AcademicTask {
  title: string;
  type: "exam" | "assignment" | "project" | "other";
  dueDate: string; // ISO date
  weight: number; // 1-10 priority/weightage
}

export interface DeadlinePlanRequest {
  tasks: AcademicTask[];
}

export async function generateDeadlinePlan(req: DeadlinePlanRequest): Promise<string> {
  const tasksText = req.tasks
    .map(
      (t, i) => `${i + 1}. ${t.title} | ${t.type} | Due: ${t.dueDate} | Weight: ${t.weight}`,
    )
    .join("\n");

  const prompt = `You are the Deadline & Reminder Agent in an academic assistant.

Here are the student's upcoming tasks:
${tasksText}

1. Sort tasks by urgency and importance.
2. Suggest what the student should focus on **today** and in the next 3 days.
3. Mention high-risk items (very close deadlines or high weight).
4. Output in a clear, bullet list with headings: 'Today', 'Next 3 days', 'Later'.`;

  return callGemini(prompt);
}
