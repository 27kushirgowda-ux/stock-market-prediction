import { useEffect, useState } from "react";
import { TrendingUp, Activity } from "lucide-react"; // Matching the new icon set
import TradingViewChart from "../components/TradingViewChart";
import ActualVsPredicted from "../components/ActualVsPredicted";
import "../styles/dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  // Retrieve the last analyzed stock (e.g., "RELIANCE.NS" or "AAPL")
  const selectedStock = localStorage.getItem("last_stock");
  const [avpData, setAvpData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedStock) {
      setAvpData([]);
      return;
    }

    setLoading(true);

    fetch(`${API_BASE_URL}/actual-vs-predicted/${selectedStock}`)
      .then((res) => res.json())
      .then((data) => {
        setAvpData(Array.isArray(data) ? data : []);
      })
      .catch(() => setAvpData([]))
      .finally(() => setLoading(false));
  }, [selectedStock]);

  return (
    <div className="dashboard-container">
      {/* Header with AI Meta-data */}
      <header className="dash-header">
        <div>
          <h1 className="dash-title">Stock Intelligence</h1>
          <p className="dash-subtitle">
            Analyzing <span className="highlight">{selectedStock || "Global Markets"}</span>
          </p>
        </div>
        <div className="status-badge">
          <Activity size={16} className="pulse-icon" />
          <span>AI Engine Live</span>
        </div>
      </header>

      {!selectedStock ? (
        <div className="empty-dashboard">
          <div className="empty-icon">📈</div>
          <h2>No Stock Selected</h2>
          <p>Please go to the Home page and select a stock to begin AI analysis.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          
          {/* Main Candlestick Chart */}
          <section className="dash-card main-chart">
            <div className="card-info">
              <h3><TrendingUp size={18} /> Live Market View</h3>
              <span className="badge">Real-time</span>
            </div>
            <div className="chart-wrapper">
              <TradingViewChart symbol={selectedStock} />
            </div>
          </section>

          {/* AI Prediction Chart */}
          <section className="dash-card prediction-section">
            <div className="card-info">
              <h3>AI Trend Forecast</h3>
              <span className="badge-alt">15-Day Projection</span>
            </div>
            
            <div className="prediction-content">
              {loading ? (
                <div className="loader-box">
                  <div className="spinner"></div>
                  <p>Processing Market Trends...</p>
                </div>
              ) : (
                <ActualVsPredicted data={avpData} />
              )}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}