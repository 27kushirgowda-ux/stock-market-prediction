import { useEffect, useState } from "react";
import "../styles/history.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE_URL}/history/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          const fallback = JSON.parse(
            localStorage.getItem("fallback_history") || "[]"
          );
          setItems(fallback);
        }
      })
      .catch(() => {
        const fallback = JSON.parse(
          localStorage.getItem("fallback_history") || "[]"
        );
        setItems(fallback);
      });
  }, [userId]);

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/history/${id}`, {
      method: "DELETE",
    }).catch(() => {});

    setItems(items.filter((item) => item.id !== id));
    localStorage.removeItem("fallback_history");
  };

  return (
    <div className="history-page">
      <h1 className="history-title">Prediction History</h1>
      <p className="history-sub">Review your past stock predictions</p>

      {items.length === 0 && (
        <div className="empty-history">No predictions yet</div>
      )}

      {items.map((item) => (
        <div key={item.id} className="history-row">
          <div className="history-main">
            <span className="history-date">{item.date}</span>
            <span className="history-stock">{item.stock}</span>
          </div>

          <div className="history-actions">
            <button
              className="view-btn"
              onClick={() =>
                setOpenId(openId === item.id ? null : item.id)
              }
            >
              View
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>

          {openId === item.id && (
            <div className="history-details">
              <div className={`signal buy ${item.signal === "BUY" ? "active" : ""}`}>
                BUY — {Math.round(item.buy_conf * 100)}%
              </div>
              <div className={`signal hold ${item.signal === "HOLD" ? "active" : ""}`}>
                HOLD — {Math.round(item.hold_conf * 100)}%
              </div>
              <div className={`signal sell ${item.signal === "SELL" ? "active" : ""}`}>
                SELL — {Math.round(item.sell_conf * 100)}%
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}