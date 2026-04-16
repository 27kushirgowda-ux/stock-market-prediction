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

import { useEffect, useState } from "react";

export default function ActualVsPredicted({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640); // mobile breakpoint
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!data || data.length === 0) {
    return <p className="muted">Analyze a stock to view comparison</p>;
  }

  return (
    <div className="avp-chart w-full">
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 360}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: isMobile ? 10 : 30,
            left: isMobile ? -10 : 0,
            bottom: 10,
          }}
          style={{ background: "#020617" }}
        >
          <CartesianGrid
            stroke="rgba(148,163,184,0.15)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "#9ca3af", fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={{ stroke: "#334155" }}
            minTickGap={isMobile ? 20 : 10} // avoids overlap
          />

          <YAxis
            tick={{ fill: "#9ca3af", fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={{ stroke: "#334155" }}
            domain={["dataMin", "dataMax"]}
            width={isMobile ? 40 : 60}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              color: "#e5e7eb",
              fontSize: isMobile ? "12px" : "14px",
            }}
            labelStyle={{ color: "#22c55e" }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              fontSize: isMobile ? "12px" : "14px",
            }}
          />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Actual"
          />

          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            name="Predicted"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}