import { generateSyllabusPlan } from "./syllabusPlannerAgent";
import type { SyllabusPlanRequest } from "./syllabusPlannerAgent";
import { generateNotes } from "./notesAgent";
import type { NotesRequest } from "./notesAgent";
import { solveDoubt } from "./doubtAgent";
import type { DoubtRequest } from "./doubtAgent";
import { generateDeadlinePlan } from "./deadlineAgent";
import type { DeadlinePlanRequest } from "./deadlineAgent";
import { analyzeProgress } from "./progressAgent";
import type { ProgressAnalysisRequest } from "./progressAgent";
import { callGemini } from "../lib/geminiClient";

export type AgentIntent =
  | "plan_syllabus"
  | "generate_notes"
  | "solve_doubt"
  | "deadlines"
  | "progress"
  | "auto_plan";

export interface OrchestratorInput {
  intent?: AgentIntent; // optional, can be auto-detected from userMessage
  userMessage: string;
  syllabusPlanRequest?: SyllabusPlanRequest;
  notesRequest?: NotesRequest;
  doubtRequest?: DoubtRequest;
  deadlineRequest?: DeadlinePlanRequest;
  progressRequest?: ProgressAnalysisRequest;
}

export interface OrchestratorTraceStep {
  agent: string;
  description: string;
}

export interface OrchestratorResult {
  finalResponse: string;
  trace: OrchestratorTraceStep[];
}

async function detectIntent(userMessage: string): Promise<AgentIntent> {
  const prompt = `You are a classifier in an academic assistant.
User message: "${userMessage}"

Possible intents:
- plan_syllabus
- generate_notes
- solve_doubt
- deadlines
- progress
- auto_plan

Return only one word from the above list as the detected intent.`;

  const raw = await callGemini(prompt);
  const cleaned = raw.trim().toLowerCase();

  if (
    cleaned.includes("plan_syllabus") ||
    cleaned.includes("syllabus") ||
    cleaned.includes("plan")
  )
    return "plan_syllabus";
  if (cleaned.includes("generate_notes") || cleaned.includes("notes")) return "generate_notes";
  if (cleaned.includes("solve_doubt") || cleaned.includes("doubt")) return "solve_doubt";
  if (cleaned.includes("deadlines") || cleaned.includes("deadline")) return "deadlines";
  if (cleaned.includes("progress")) return "progress";
  return "auto_plan";
}

export async function runOrchestrator(input: OrchestratorInput): Promise<OrchestratorResult> {
  const trace: OrchestratorTraceStep[] = [];
  const intent = input.intent ?? (await detectIntent(input.userMessage));

  if (intent === "plan_syllabus") {
    trace.push({ agent: "Orchestrator", description: "Selected SyllabusPlannerAgent" });
    if (!input.syllabusPlanRequest) {
      return {
        finalResponse: "Please provide syllabus text and exam date to plan your syllabus.",
        trace,
      };
    }
    const res = await generateSyllabusPlan(input.syllabusPlanRequest);
    return { finalResponse: res, trace };
  }

  if (intent === "generate_notes") {
    trace.push({ agent: "Orchestrator", description: "Selected NotesAgent" });
    if (!input.notesRequest) {
      return {
        finalResponse: "Please provide subject, topic and detail level to generate notes.",
        trace,
      };
    }
    const res = await generateNotes(input.notesRequest);
    return { finalResponse: res, trace };
  }

  if (intent === "solve_doubt") {
    trace.push({ agent: "Orchestrator", description: "Selected DoubtAgent" });
    if (!input.doubtRequest) {
      return {
        finalResponse: "Please provide subject and your doubt/question.",
        trace,
      };
    }
    const res = await solveDoubt(input.doubtRequest);
    return { finalResponse: res, trace };
  }

  if (intent === "deadlines") {
    trace.push({ agent: "Orchestrator", description: "Selected DeadlineAgent" });
    if (!input.deadlineRequest || !input.deadlineRequest.tasks.length) {
      return {
        finalResponse: "Please add at least one academic task with due date.",
        trace,
      };
    }
    const res = await generateDeadlinePlan(input.deadlineRequest);
    return { finalResponse: res, trace };
  }

  if (intent === "progress") {
    trace.push({ agent: "Orchestrator", description: "Selected ProgressAgent" });
    if (!input.progressRequest || !input.progressRequest.topics.length) {
      return {
        finalResponse: "Please provide your topics and their completion status.",
        trace,
      };
    }
    const res = await analyzeProgress(input.progressRequest);
    return { finalResponse: res, trace };
  }

  // auto_plan: example of chaining multiple agents
  trace.push({ agent: "Orchestrator", description: "Auto-plan: chaining multiple agents" });

  if (!input.syllabusPlanRequest) {
    return {
      finalResponse:
        "For auto planning, please provide at least your syllabus text and exam date.",
      trace,
    };
  }

  const syllabusPlan = await generateSyllabusPlan(input.syllabusPlanRequest);
  trace.push({ agent: "SyllabusPlannerAgent", description: "Generated syllabus plan" });

  let deadlinesSummary = "";
  if (input.deadlineRequest && input.deadlineRequest.tasks.length) {
    deadlinesSummary = await generateDeadlinePlan(input.deadlineRequest);
    trace.push({ agent: "DeadlineAgent", description: "Analyzed deadlines and priorities" });
  }

  const prompt = `You are the final response composer in an academic assistant.

Syllabus plan:
${syllabusPlan}

Deadline analysis:
${deadlinesSummary || "(no separate deadlines provided)"}

Create a clear final study strategy for the student for the next 10 days, combining the
information above. Include:
- What to do each day (high-level)
- How to balance revision and new topics
- 3 tips for staying consistent.`;

  const final = await callGemini(prompt);
  trace.push({ agent: "Composer", description: "Combined outputs into final strategy" });

  return { finalResponse: final, trace };
}
