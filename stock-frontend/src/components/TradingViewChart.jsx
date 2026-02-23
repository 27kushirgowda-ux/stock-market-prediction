import { useEffect, useRef } from "react";

export default function TradingViewChart({ symbol }) {
  const containerRef = useRef(null);

  // ✅ SAFE SYMBOL MAPPER (THIS IS THE FIX)
  const mapToTradingView = (sym) => {
    if (!sym) return "";

    // NSE stocks
    if (sym.endsWith(".NS")) {
      const base = sym.replace(".NS", "");

      // TradingView widget blocks these on NSE
      const forceBSE = [
        "AXISBANK",
        "ICICIBANK",
        "SBIN",
        "RELIANCE",
      ];

      if (forceBSE.includes(base)) {
        return `BSE:${base}`;
      }

      return `NSE:${base}`;
    }

    // US stocks
    return `NASDAQ:${sym}`;
  };

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    const tvSymbol = mapToTradingView(symbol);

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (!window.TradingView) return;

      new window.TradingView.widget({
        container_id: "tv_chart",
        symbol: tvSymbol,
        interval: "D",
        theme: "dark",
        style: "1",
        autosize: true,

        hide_top_toolbar: false,
        hide_legend: false,
        allow_symbol_change: true,
        enable_publishing: false,

        backgroundColor: "#0b1220",
        gridColor: "rgba(255,255,255,0.06)",
        locale: "en",
      });
    };

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      id="tv_chart"
      style={{
        width: "100%",
        height: "520px",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    />
  );
}