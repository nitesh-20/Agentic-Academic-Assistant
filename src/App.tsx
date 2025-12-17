import { useState } from "react";
import "./App.css";
import { SyllabusPlanner } from "./components/SyllabusPlanner";
import { NotesGenerator } from "./components/NotesGenerator";
import { DoubtSolver } from "./components/DoubtSolver";
import { DeadlinesManager } from "./components/DeadlinesManager";
import { ProgressAnalyzer } from "./components/ProgressAnalyzer";

export type TabKey =
  | "dashboard"
  | "syllabus"
  | "notes"
  | "doubts"
  | "deadlines"
  | "progress";

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>EduMate AI – Agentic Academic Assistant</h1>
          <p className="subtitle">
            Orchestrated AI agents for syllabus planning, notes, doubts, deadlines & progress.
          </p>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={activeTab === "dashboard" ? "tab active" : "tab"}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "syllabus" ? "tab active" : "tab"}
          onClick={() => setActiveTab("syllabus")}
        >
          Syllabus Planner
        </button>
        <button
          className={activeTab === "notes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notes")}
        >
          Notes Generator
        </button>
        <button
          className={activeTab === "doubts" ? "tab active" : "tab"}
          onClick={() => setActiveTab("doubts")}
        >
          Doubt Solver
        </button>
        <button
          className={activeTab === "deadlines" ? "tab active" : "tab"}
          onClick={() => setActiveTab("deadlines")}
        >
          Deadlines
        </button>
        <button
          className={activeTab === "progress" ? "tab active" : "tab"}
          onClick={() => setActiveTab("progress")}
        >
          Progress
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "dashboard" && (
          <section>
            <h2>Welcome</h2>
            <p>
              Choose a module from above tabs to see the Agentic AI in action. Each module uses
              a different specialized agent, coordinated by an orchestrator layer.
            </p>
            <ul className="features-list">
              <li>Syllabus Planner Agent – exam-wise study plan</li>
              <li>Notes Generator Agent – topic-wise smart notes</li>
              <li>Doubt Solver Agent – step-by-step explanations</li>
              <li>Deadline & Reminder Agent – priorities and focus for today</li>
              <li>Progress Analyzer Agent – weak topics and adjusted plan</li>
            </ul>
          </section>
        )}

        {activeTab === "syllabus" && <SyllabusPlanner />}
        {activeTab === "notes" && <NotesGenerator />}
        {activeTab === "doubts" && <DoubtSolver />}
        {activeTab === "deadlines" && <DeadlinesManager />}
        {activeTab === "progress" && <ProgressAnalyzer />}
      </main>
    </div>
  );
}

export default App;
