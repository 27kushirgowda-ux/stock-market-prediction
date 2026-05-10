import { useEffect, useState } from "react";
import { Trash2, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { auth } from "../firebase"; // Assuming your firebase config is here
import "../styles/history.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/history/${user.uid}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prediction?")) return;
    try {
      await fetch(`${API_BASE_URL}/history/${id}`, { method: "DELETE" });
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      alert("Could not delete item.");
    }
  };

  const getSignalIcon = (signal) => {
    if (signal === "BUY") return <TrendingUp size={16} className="text-emerald-500" />;
    if (signal === "SELL") return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  return (
    <div className="history-container">
      <header className="history-header">
        <div>
          <h1 className="history-title">Prediction Ledger</h1>
          <p className="history-subtitle">Past AI Analysis Records</p>
        </div>
        <div className="history-stats">
          <span className="count-badge">{history.length} Saved</span>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Retrieving your records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>No records found</h3>
          <p>Run your first AI analysis on the dashboard to see it here.</p>
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Signal</th>
                <th>Confidence (B/H/S)</th>
                <th>Analyzed On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="history-row">
                  <td className="stock-cell">{item.stock}</td>
                  <td>
                    <div className={`signal-tag ${item.signal.toLowerCase()}`}>
                      {getSignalIcon(item.signal)}
                      <span>{item.signal}</span>
                    </div>
                  </td>
                  <td>
                    <div className="conf-bars">
                      <div className="conf-bar buy" style={{ width: `${item.buy_conf * 100}%` }}></div>
                      <div className="conf-bar sell" style={{ width: `${item.sell_conf * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="date-cell">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}