import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ActualVsPredicted({ data }) {
  if (!data || data.length === 0) {
    return <p className="muted">Analyze a stock to view comparison</p>;
  }

  return (
    <div className="avp-chart">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data}
        style={{background:"#020617"}}>
          {/* GRID like TradingView */}
          <CartesianGrid
            stroke="rgba(148,163,184,0.15)"
            strokeDasharray="3 3"
          />

          {/* X AXIS */}
          <XAxis
            dataKey="date"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={{ stroke: "#334155" }}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={{ stroke: "#334155" }}
            domain={["dataMin", "dataMax"]}
          />

          {/* TOOLTIP */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#22c55e" }}
          />

          <Legend />

          {/* ACTUAL PRICE */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"       // TradingView blue
            strokeWidth={2.5}
            dot={false}
            name="Actual Price"
          />

          {/* PREDICTED PRICE */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#22c55e"       // TradingView green
            strokeWidth={2.5}
            strokeDasharray="6 4" // dashed → clearly separate
            dot={false}
            name="Predicted Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}