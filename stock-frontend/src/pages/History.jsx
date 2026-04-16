import { useEffect, useState } from "react";
import "../styles/history.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("fallback_history")) || [];
    setItems(local.reverse()); // latest first 🔥
  }, []);

  return (
    <div className="history-page">
      <h1 className="history-title">Prediction History</h1>

      {items.length === 0 ? (
        <p className="empty">No history yet</p>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <div key={item.id} className="history-card">
              
              {/* TOP ROW */}
              <div className="history-top">
                <div>
                  <h3>{item.stock}</h3>
                  <p className="date">{item.date}</p>
                </div>

                <button
                  className="view-btn"
                  onClick={() =>
                    setOpenId(openId === item.id ? null : item.id)
                  }
                >
                  {openId === item.id ? "Hide" : "View"}
                </button>
              </div>

              {/* EXPAND SECTION */}
              {openId === item.id && (
                <div className="history-details">
                  <div className="confidence buy">
                    BUY: {Math.round(item.buy_conf * 100)}%
                  </div>
                  <div className="confidence hold">
                    HOLD: {Math.round(item.hold_conf * 100)}%
                  </div>
                  <div className="confidence sell">
                    SELL: {Math.round(item.sell_conf * 100)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}