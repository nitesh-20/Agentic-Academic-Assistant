import { useState } from "react";
import { solveDoubt } from "../agents/doubtAgent";

export function DoubtSolver() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async () => {
    setError(null);
    if (!subject || !question) {
      setError("Please enter subject and your doubt.");
      return;
    }
    setLoading(true);
    try {
      const res = await solveDoubt({ subject, question });
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to solve doubt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Doubt Solver Agent</h2>
      <p className="panel-desc">Ask any subject doubt and get a step-by-step explanation.</p>

      <label className="field">
        <span>Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Mathematics"
        />
      </label>

      <label className="field">
        <span>Your doubt / question</span>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          placeholder="Type your question here..."
        />
      </label>

      <button onClick={handleSolve} disabled={loading} className="primary-btn">
        {loading ? "Solving..." : "Solve Doubt"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Answer</h3>
          <pre>{result}</pre>
        </div>
      )}
    </section>
  );
}
