import { useEffect, useState } from "react";
import "../styles/Home.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // ================= FETCH TOP GAINERS =================
  useEffect(() => {
    const lastStock = localStorage.getItem("last_stock");
    if (lastStock) setStock(lastStock);

    fetch(`${API_BASE_URL}/top-stocks`)
      .then((res) => res.json())
      .then((data) => {
        setTopStocks(Array.isArray(data.stocks) ? data.stocks : []);
        setLoadingTop(false);
      })
      .catch(() => setLoadingTop(false));
  }, []);

  // ================= ANALYZE =================
  const handleAnalyze = async () => {
    if (!stock) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, date }),
      });

      const data = await res.json();

      // ✅ SHOW RESULT
      setResult(data);

      // save selected stock
      localStorage.setItem("last_stock", stock);

      // ============================
      // ✅ FALLBACK HISTORY (LOCAL)
      // ============================
      const fallbackHistory = {
        id: Date.now(),
        stock: stock,
        date: date,
        signal: data.signal,
        buy_conf: data.confidence.buy,
        hold_conf: data.confidence.hold,
        sell_conf: data.confidence.sell,
      };

      localStorage.setItem(
        "fallback_history",
        JSON.stringify([fallbackHistory])
      );

      // ============================
      // 🔁 BACKEND HISTORY (OPTIONAL)
      // ============================
      fetch(`${API_BASE_URL}/history`, {
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
      }).catch(() => {});
    } catch (err) {
      console.error(err);

      setResult({
        signal: "HOLD",
        confidence: { buy: 0.33, hold: 0.34, sell: 0.33 },
        reason: "Prediction temporarily unavailable. Showing fallback result.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= RESULT LOGIC =================
  const confidence = result?.confidence || {};
  const maxSignal = result
    ? Object.keys(confidence).reduce((a, b) =>
        confidence[a] > confidence[b] ? a : b
      )
    : null;

  const arrow = (type) => (type === maxSignal ? "▲" : "▼");

  // ================= UI =================
  return (
    <div className="page-container home-page">
      <h1 className="page-title">Stock Analysis</h1>
      <p className="page-sub">
        AI-powered prediction using Yahoo Finance historical data
      </p>

      {/* ================= TOP GAINERS ================= */}
      <div className="top-stocks-card">
        <h3>Top Gainers Today</h3>

        {loadingTop ? (
          <p className="muted">Loading market movers...</p>
        ) : topStocks.length === 0 ? (
          <p className="muted">Market data unavailable</p>
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

      {/* ================= INPUTS ================= */}
      <div className="input-row">
        <input
          type="text"
          value={stock}
          readOnly
          className="stock-input"
          placeholder="Select a stock"
        />

        <input
          type="date"
          value={date}
          readOnly
          className="date-input"
        />
      </div>

      {/* ================= ANALYZE BUTTON ================= */}
      <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze / Predict"}
      </button>

      {/* ================= RESULT ================= */}
      {result && (
        <>
          <div className="signal-card">
            <h3>Prediction Result</h3>

            <div className={`signal-box buy ${maxSignal === "buy" ? "active" : ""}`}>
              BUY — {Math.round(confidence.buy * 100)}% {arrow("buy")}
            </div>

            <div className={`signal-box hold ${maxSignal === "hold" ? "active" : ""}`}>
              HOLD — {Math.round(confidence.hold * 100)}% {arrow("hold")}
            </div>

            <div className={`signal-box sell ${maxSignal === "sell" ? "active" : ""}`}>
              SELL — {Math.round(confidence.sell * 100)}% {arrow("sell")}
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