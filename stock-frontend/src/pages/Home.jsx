import { useEffect, useState } from "react";
import "../styles/Home.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [stock, setStock] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topStocks, setTopStocks] = useState([]);

  const userId = localStorage.getItem("user_id") || "1";

  useEffect(() => {
    fetch(`${API_BASE_URL}/top-stocks`)
      .then(res => res.json())
      .then(data => setTopStocks(data.stocks || []))
      .catch(() => setTopStocks([]));
  }, []);

  const handleAnalyze = async () => {
    if (!stock) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, date }),
      });

      const data = await res.json();
      setResult(data);

      // ✅ SAVE FALLBACK HISTORY (LOCAL STORAGE)
      const historyItem = {
        id: Date.now(),
        user_id: userId,
        stock,
        date,
        signal: data.signal,
        buy_conf: data.confidence.buy,
        hold_conf: data.confidence.hold,
        sell_conf: data.confidence.sell,
      };

      const prev = JSON.parse(localStorage.getItem("fallback_history")) || [];
      localStorage.setItem(
        "fallback_history",
        JSON.stringify([historyItem, ...prev])
      );

    } catch (err) {
      setResult({
        signal: "HOLD",
        confidence: { buy: 0.33, hold: 0.34, sell: 0.33 },
        reason: "Fallback prediction",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Stock Analysis</h1>

      <div className="top-stocks-card">
        <h3>Top Gainers</h3>
        {topStocks.map(s => (
          <button key={s.symbol} onClick={() => setStock(s.symbol)}>
            {s.symbol}
          </button>
        ))}
      </div>

      <input value={stock} readOnly placeholder="Selected Stock" />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div>
          <h3>{result.signal}</h3>
          <p>{result.reason}</p>
        </div>
      )}
    </div>
  );
}