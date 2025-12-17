import { useState } from "react";
import { generateDeadlinePlan } from "../agents/deadlineAgent";
import type { AcademicTask } from "../agents/deadlineAgent";

export function DeadlinesManager() {
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<AcademicTask["type"]>("exam");
  const [dueDate, setDueDate] = useState("");
  const [weight, setWeight] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    if (!title || !dueDate) {
      setError("Please enter title and due date.");
      return;
    }
    setError(null);
    setTasks((prev) => [...prev, { title, type, dueDate, weight }]);
    setTitle("");
    setDueDate("");
    setWeight(5);
  };

  const handlePlan = async () => {
    setError(null);
    if (!tasks.length) {
      setError("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateDeadlinePlan({ tasks });
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to analyze deadlines");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Deadline & Reminder Agent</h2>
      <p className="panel-desc">Track exams, assignments and get focus suggestions.</p>

      <div className="field-row">
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., DBMS Mid-sem"
          />
        </label>
        <label className="field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="field">
          <span>Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Weight (1-10)</span>
          <input
            type="number"
            min={1}
            max={10}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value) || 1)}
          />
        </label>
      </div>

      <button onClick={addTask} className="secondary-btn">
        Add Task
      </button>

      {tasks.length > 0 && (
        <div className="result-box small">
          <h3>Current Tasks</h3>
          <ul>
            {tasks.map((t, idx) => (
              <li key={idx}>
                {t.title} – {t.type} – due {t.dueDate} – weight {t.weight}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handlePlan} disabled={loading} className="primary-btn">
        {loading ? "Analyzing..." : "Analyze Deadlines"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Suggested Focus</h3>
          <pre>{result}</pre>
        </div>
      )}
    </section>
  );
}
