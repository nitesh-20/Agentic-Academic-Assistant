import { useState } from "react";
import { analyzeProgress } from "../agents/progressAgent";
import type { ProgressTopic } from "../agents/progressAgent";

export function ProgressAnalyzer() {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState<ProgressTopic[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [status, setStatus] = useState<ProgressTopic["status"]>("not_started");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTopic = () => {
    if (!topicInput) {
      setError("Topic cannot be empty.");
      return;
    }
    setError(null);
    setTopics((prev) => [...prev, { topic: topicInput, status }]);
    setTopicInput("");
    setStatus("not_started");
  };

  const handleAnalyze = async () => {
    setError(null);
    if (!subject || !topics.length) {
      setError("Enter subject and at least one topic.");
      return;
    }
    setLoading(true);
    try {
      const res = await analyzeProgress({ subject, topics });
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to analyze progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Progress Analyzer Agent</h2>
      <p className="panel-desc">
        Mark which topics are completed / in progress / not started and get guidance.
      </p>

      <label className="field">
        <span>Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Operating Systems"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Topic</span>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g., Deadlock"
          />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="completed">Completed</option>
            <option value="in_progress">In progress</option>
            <option value="not_started">Not started</option>
          </select>
        </label>
      </div>

      <button onClick={addTopic} className="secondary-btn">
        Add Topic
      </button>

      {topics.length > 0 && (
        <div className="result-box small">
          <h3>Topics Status</h3>
          <ul>
            {topics.map((t, idx) => (
              <li key={idx}>
                {t.topic} – {t.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleAnalyze} disabled={loading} className="primary-btn">
        {loading ? "Analyzing..." : "Analyze Progress"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Analysis</h3>
          <pre>{result}</pre>
        </div>
      )}
    </section>
  );
}
