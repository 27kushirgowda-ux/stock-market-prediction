import { useEffect, useState } from "react";
import "../styles/dashboard.css";

import TradingViewChart from "../components/TradingViewChart";
import ActualVsPredicted from "../components/ActualVsPredicted";

export default function Dashboard() {
  const selectedStock = localStorage.getItem("last_stock");
  const [avpData, setAvpData] = useState([]);

  // ================= FETCH ACTUAL VS PREDICTED =================
  useEffect(() => {
    if (!selectedStock) {
      setAvpData([]);
      return;
    }

    fetch(`http://127.0.0.1:8000/actual-vs-predicted/${selectedStock}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvpData(data);
        } else {
          setAvpData([]);
        }
      })
      .catch(() => setAvpData([]));
  }, [selectedStock]);

  return (
    <div className="dashboard-page">
      <h1 className="dash-title">Dashboard</h1>

      {/* ================= CANDLESTICK ================= */}
      <div className="dash-card wide candle-hero">
        <h3>Candlestick Chart — {selectedStock || "N/A"}</h3>

        {!selectedStock ? (
          <p className="muted">
            Analyze a stock on Home page to view chart
          </p>
        ) : (
          <TradingViewChart symbol={selectedStock} />
        )}
      </div>

      {/* ================= ACTUAL VS PREDICTED ================= */}
      <div className="dash-card wide avp-section light-chart">
        <h3>Actual vs Predicted Price</h3>

        <ActualVsPredicted data={avpData} />
      </div>
    </div>
  );
}