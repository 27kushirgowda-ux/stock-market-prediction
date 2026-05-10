import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { useEffect, useState } from "react";

export default function ActualVsPredicted({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] border border-dashed border-slate-800 rounded-2xl">
        <p className="text-slate-500 font-medium">Run AI Analysis to view trend comparison</p>
      </div>
    );
  }

  return (
    <div className="avp-chart-container p-4 bg-[#0f172a]/50 rounded-3xl border border-white/5 backdrop-blur-md">
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 380}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: isMobile ? 10 : 30,
            left: isMobile ? -20 : 0,
            bottom: 0,
          }}
        >
          <defs>
            {/* Gradient for that professional "glow" effect */}
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="rgba(148,163,184,0.1)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />

          <YAxis
            hide={isMobile} // Cleaner on mobile
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            dx={-10}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
            }}
            itemStyle={{ fontSize: "13px", fontWeight: "600" }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: "20px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}
          />

          {/* Actual Price Line - Solid and Bold */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
            name="Market Price"
            animationDuration={1500}
          />

          {/* Predicted Price Line - Dashed "Future" Look */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="8 5"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
            name="AI Forecast"
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}