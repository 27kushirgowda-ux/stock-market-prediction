import { useEffect, useState } from "react";
import "../styles/Home.css";

export default function Home() {
  const [stock, setStock] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [topStocks, setTopStocks] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const userId = localStorage.getItem("user_id");

  // 🔹 FETCH TOP 5 STOCKS (FAST) + RESTORE SELECTED STOCK
  useEffect(() => {
    // ✅ RESTORE LAST SELECTED STOCK (FIX)
    const lastStock = localStorage.getItem("last_stock");
    if (lastStock) {
      setStock(lastStock);
    }

    fetch("http://127.0.0.1:8000/top-stocks")
      .then((res) => res.json())
      .then((data) => {
        setTopStocks(data.stocks || []);
        setLoadingTop(false);
      })
      .catch(() => setLoadingTop(false));
  }, []);

  // 🔹 ANALYZE (UNCHANGED)
  const handleAnalyze = async () => {
    if (!stock) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, date }),
      });

      const data = await res.json();
      if (!res.ok) return;

      setResult(data);

      // ✅ SAVE SELECTED STOCK
      localStorage.setItem("last_stock", stock);

      // SAVE TO HISTORY
      await fetch("http://127.0.0.1:8000/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          stock,
          date,
          signal: data.signal,
          buy_conf: data.confidence.buy,
          hold_conf: data.confidence.hold,
          sell_conf: data.confidence.sell,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 EXISTING LOGIC (UNCHANGED)
  const confidence = result?.confidence || {};
  const maxSignal = result
    ? Object.keys(confidence).reduce((a, b) =>
        confidence[a] > confidence[b] ? a : b
      )
    : null;

  const arrow = (type) => (type === maxSignal ? "▲" : "▼");

  return (
    <div className="home-page">
      <h1 className="page-title">Stock Analysis</h1>
      <p className="page-sub">
        AI-powered prediction using Yahoo Finance historical data
      </p>

      {/* 🔹 TOP 5 STOCKS TABLE */}
      <div className="top-stocks-card">
        <h3>Top Gainers Today</h3>

        {loadingTop ? (
          <p className="muted">Loading market movers...</p>
        ) : (
          <table className="top-stocks-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Change %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {topStocks.map((s) => (
                <tr key={s.symbol}>
                  <td>{s.symbol}</td>
                  <td className="green">+{s.change}%</td>
                  <td>
                    <button
                      className="select-btn"
                      onClick={() => setStock(s.symbol)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 SAME INPUTS */}
      <div className="input-row">
        <input
          type="text"
          value={stock}
          readOnly
          className="stock-input"
        />

        <input
          type="date"
          value={date}
          readOnly
          className="date-input"
        />
      </div>

      {/* 🔹 SAME ANALYZE BUTTON */}
      <button className="analyze-btn" onClick={handleAnalyze}>
        {loading ? "Analyzing..." : "Analyze / Predict"}
      </button>

      {/* 🔹 SAME RESULT UI */}
      {result && (
        <>
          <div className="signal-card">
            <h3>Prediction Result</h3>

            <div className={`signal-box buy ${maxSignal === "buy" ? "active" : ""}`}>
              <span>BUY</span>
              <strong>
                Confidence Score: {Math.round(confidence.buy * 100)}% {arrow("buy")}
              </strong>
            </div>

            <div className={`signal-box hold ${maxSignal === "hold" ? "active" : ""}`}>
              <span>HOLD</span>
              <strong>
                Confidence Score: {Math.round(confidence.hold * 100)}% {arrow("hold")}
              </strong>
            </div>

            <div className={`signal-box sell ${maxSignal === "sell" ? "active" : ""}`}>
              <span>SELL</span>
              <strong>
                Confidence Score: {Math.round(confidence.sell * 100)}% {arrow("sell")}
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <h3>Why this prediction?</h3>
            <p>{result.reason}</p>
          </div>
        </>
      )}
    </div>
  );
}