import { useState } from "react";
import { generateSyllabusPlan } from "../agents/syllabusPlannerAgent";

export function SyllabusPlanner() {
  const [syllabusText, setSyllabusText] = useState("");
  const [examDate, setExamDate] = useState("");
  const [daysAvailable, setDaysAvailable] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!syllabusText || !examDate) {
      setError("Please enter syllabus and exam date.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateSyllabusPlan({ syllabusText, examDate, daysAvailable });
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Syllabus Planner Agent</h2>
      <p className="panel-desc">
        Upload / paste your syllabus and exam date. The agent will generate a day-wise study plan.
      </p>

      <label className="field">
        <span>Syllabus (paste text)</span>
        <textarea
          value={syllabusText}
          onChange={(e) => setSyllabusText(e.target.value)}
          rows={6}
          placeholder="Unit 1: ...\nUnit 2: ..."
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Exam date</span>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Days available</span>
          <input
            type="number"
            min={1}
            value={daysAvailable}
            onChange={(e) => setDaysAvailable(Number(e.target.value) || 1)}
          />
        </label>
      </div>

      <button onClick={handleGenerate} disabled={loading} className="primary-btn">
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Generated Plan</h3>
          <pre>{result}</pre>
        </div>
      )}
    </section>
  );
}
