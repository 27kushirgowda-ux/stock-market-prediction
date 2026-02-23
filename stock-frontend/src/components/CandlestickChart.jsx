<div className="dashboard-card large">
  <h3>Candlestick Chart — {selectedStock}</h3>

  {candles.length === 0 ? (
    <p className="muted">No chart data available</p>
  ) : (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={candles}>
        <XAxis dataKey="date" />
        <YAxis domain={["dataMin", "dataMax"]} />
        <Tooltip />

        {/* GREEN / RED BODY */}
        <Bar
          dataKey="close"
          fill="#22c55e"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )}
</div>
