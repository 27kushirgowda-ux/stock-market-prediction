import { useEffect, useState } from "react";
import "../styles/history.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    // 🔥 ALWAYS LOAD FROM LOCAL STORAGE
    const local = JSON.parse(localStorage.getItem("fallback_history")) || [];
    setItems(local);
  }, []);

  return (
    <div className="history-page">
      <h1>Prediction History</h1>

      {items.length === 0 && <p>No history yet</p>}

      {items.map(item => (
        <div key={item.id} className="history-row">
          <div>
            <strong>{item.stock}</strong> — {item.date}
          </div>

          <button onClick={() => setOpenId(openId === item.id ? null : item.id)}>
            View
          </button>

          {openId === item.id && (
            <div>
              <p>BUY: {Math.round(item.buy_conf * 100)}%</p>
              <p>HOLD: {Math.round(item.hold_conf * 100)}%</p>
              <p>SELL: {Math.round(item.sell_conf * 100)}%</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}