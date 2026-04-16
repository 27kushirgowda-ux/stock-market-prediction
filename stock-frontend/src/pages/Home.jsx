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

  useEffect(() => {
    const lastStock = localStorage.getItem("last_stock");
    if (lastStock) setStock(lastStock);

    fetch(`${API_BASE_URL}/top-stocks`)
      .then((res) => res.json())
      .then((data) => {
        setTopStocks(data.stocks || []);
        setLoadingTop(false);
      })
      .catch(() => setLoadingTop(false));
  }, []);

  const handleAnalyze = async () => {
    if (!stock) return alert("Please select a stock");

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, date }),
      });

      const data = await res.json();
      if (!res.ok) return;

      setResult(data);
      localStorage.setItem("last_stock", stock);

      await fetch(`${API_BASE_URL}/history`, {
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

  const confidence = result?.confidence || {};
  const maxSignal = result
    ? Object.keys(confidence).reduce((a, b) =>
        confidence[a] > confidence[b] ? a : b
      )
    : null;

  return (
    <div className="home-page">
      <h1 className="page-title">Stock Analysis</h1>
      <p className="page-sub">
        AI-powered prediction using historical data
      </p>

      {/* 🔥 TOP STOCKS → MOBILE FRIENDLY */}
      <div className="top-stocks-card">
        <h3>Top Gainers</h3>

        {loadingTop ? (
          <p className="muted">Loading...</p>
        ) : (
          <div className="top-stocks-grid">
            {topStocks.map((s) => (
              <div key={s.symbol} className="stock-item">
                <div>
                  <strong>{s.symbol}</strong>
                  <p className="green">+{s.change}%</p>
                </div>

                <button onClick={() => setStock(s.symbol)}>
                  Select
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INPUTS */}
      <div className="input-row">
        <div className="input-group">
          <label>Stock Symbol</label>
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value.toUpperCase())}
            placeholder="e.g., AAPL"
          />
        </div>

        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          className="btn-analyze"
          onClick={handleAnalyze}
          disabled={loading || !stock}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="results-card">
          <h2>Analysis Results for {result.symbol}</h2>
          <div className="signal-display">
            <div className={`signal ${maxSignal}`}>
              <strong>{maxSignal?.toUpperCase()}</strong>
            </div>
          </div>

          <div className="confidence-bars">
            <div className="confidence-item">
              <span>Buy</span>
              <div className="bar">
                <div
                  className="fill buy"
                  style={{ width: `${confidence.buy * 100}%` }}
                ></div>
              </div>
              <span>{(confidence.buy * 100).toFixed(1)}%</span>
            </div>

            <div className="confidence-item">
              <span>Hold</span>
              <div className="bar">
                <div
                  className="fill hold"
                  style={{ width: `${confidence.hold * 100}%` }}
                ></div>
              </div>
              <span>{(confidence.hold * 100).toFixed(1)}%</span>
            </div>

            <div className="confidence-item">
              <span>Sell</span>
              <div className="bar">
                <div
                  className="fill sell"
                  style={{ width: `${confidence.sell * 100}%` }}
                ></div>
              </div>
              <span>{(confidence.sell * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}