import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TrendingUp, Zap, Globe, Play, Calendar } from "lucide-react";
import "../styles/home.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const { user } = useAuth();
  const [stock, setStock] = useState("");
  
  // 📅 CORRECT DATE LOGIC
  // 1. Set default to today
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  // Separate states for India and US movers
  const [indiaStocks, setIndiaStocks] = useState([]);
  const [usStocks, setUsStocks] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Restore last selected stock
  useEffect(() => {
    const lastStock = localStorage.getItem("last_stock");
    if (lastStock) setStock(lastStock);

    // Fetch Movers data from backend
    const fetchMarkets = async () => {
      try {
        setLoadingMarkets(true);
        // Note: period=5d to ensure data on weekends
        const [indiaRes, usRes] = await Promise.all([
          fetch(`${API_BASE_URL}/top-gainers?period=5d`), 
          fetch(`${API_BASE_URL}/top-stocks?period=5d`)
        ]);
        
        const inData = await indiaRes.json();
        const usData = await usRes.json();

        setIndiaStocks(inData.stocks || []);
        setUsStocks(usData.stocks || []);
      } catch (err) {
        console.error("Market data fetch failed:", err);
      } finally {
        setLoadingMarkets(false);
      }
    };

    fetchMarkets();
  }, []);

  const handleAnalyze = async () => {
    if (!stock || !user) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, date }),
      });

      const data = await res.json();
      setResult(data);
      localStorage.setItem("last_stock", stock);
      
      // Save to SQL Database via FastAPI
      await fetch(`${API_BASE_URL}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.uid,
          stock,
          date,
          signal: data.signal,
          buy_conf: data.confidence.buy,
          hold_conf: data.confidence.hold,
          sell_conf: data.confidence.sell,
        }),
      });
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="page-title">Market Insights</h1>
        <p className="page-sub">Global AI-driven forecasting Powered by Yahoo Finance data</p>
      </header>

      <div className="home-grid">
        {/* LEFT COLUMN: MARKET SIDEBAR */}
        <div className="market-sidebar">
          
          {/* INDIA CARD */}
          <MarketCard 
            title="NSE India" 
            icon={<Zap size={18} />} 
            stocks={indiaStocks} 
            loading={loadingMarkets} 
            onSelect={setStock} 
            theme="emerald" 
          />

          {/* US CARD */}
          <MarketCard 
            title="US Markets" 
            icon={<Globe size={18} />} 
            stocks={usStocks} 
            loading={loadingMarkets} 
            onSelect={setStock} 
            theme="blue" 
          />
        </div>

        {/* RIGHT COLUMN: ANALYZER */}
        <main className="analyzer-main">
          <div className="input-card">
            <div className="card-header">
              <TrendingUp size={20} color="#22c55e" />
              <h3>AI Analysis Engine</h3>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Target Stock</label>
                <input type="text" value={stock} readOnly placeholder="Select from market list..." />
              </div>
              <div className="input-group calendar-group">
                <label>Analysis Date</label>
                <div className="date-input-container">
                  <input 
                    type="date" 
                    value={date} 
                    max={today} // 📅 Prevents future days from being selected
                    onChange={(e) => setDate(e.target.value)} 
                  />
                  <Calendar size={18} className="calendar-icon" />
                </div>
              </div>
            </div>

            <button 
              className={`analyze-btn ${loading ? "busy" : ""}`} 
              onClick={handleAnalyze} 
              disabled={loading || !stock}
            >
              {loading ? "Processing AI Gradient..." : "Run AI Prediction"}
              {!loading && <Play size={14} fill="currentColor" />}
            </button>
          </div>

          {result && (
            <div className="prediction-display animate-in">
              <div className="signal-row">
                {Object.entries(result.confidence).map(([type, val]) => (
                  <div key={type} className={`signal-box ${type} ${result.signal.toLowerCase() === type ? "selected" : ""}`}>
                    <span className="signal-name">{type.toUpperCase()}</span>
                    <span className="signal-pct">{Math.round(val * 100)}%</span>
                  </div>
                ))}
              </div>
              <div className="logic-card">
                <h4>AI Reasoning</h4>
                <p>{result.reason}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Sub-component for the tables to keep code clean
function MarketCard({ title, icon, stocks, loading, onSelect, theme }) {
  return (
    <section className={`top-stocks-card ${theme}`}>
      <div className="card-header">
        <div className="title-group">
          {icon}
          <h3>{title}</h3>
        </div>
        <span className="live-tag">LIVE</span>
      </div>

      {loading ? (
        <div className="skeleton-msg">Syncing...</div>
      ) : stocks.length === 0 ? (
        <div className="empty-msg">No movers found on weekend</div>
      ) : (
        <div className="table-wrapper">
          <table className="movers-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Change</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s.symbol}>
                  <td className="symbol-name">{s.symbol.replace(".NS", "")}</td>
                  <td className="change-val">+{s.change}%</td>
                  <td className="action-cell">
                    <button className="select-btn" onClick={() => onSelect(s.symbol)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}