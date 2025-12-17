import { useState } from "react";
import { generateNotes } from "../agents/notesAgent";

export function NotesGenerator() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [detailLevel, setDetailLevel] = useState<"short" | "medium" | "detailed">("short");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!subject || !topic) {
      setError("Please enter subject and topic.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateNotes({ subject, topic, detailLevel });
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to generate notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Notes Generator Agent</h2>
      <p className="panel-desc">Generate revision-friendly notes for any topic.</p>

      <div className="field-row">
        <label className="field">
          <span>Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Data Structures"
          />
        </label>
        <label className="field">
          <span>Topic</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Binary Trees"
          />
        </label>
      </div>

      <label className="field">
        <span>Detail level</span>
        <select
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value as any)}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="detailed">Detailed</option>
        </select>
      </label>

      <button onClick={handleGenerate} disabled={loading} className="primary-btn">
        {loading ? "Generating..." : "Generate Notes"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Generated Notes</h3>
          <pre>{result}</pre>
        </div>
      )}
    </section>
  );
}
