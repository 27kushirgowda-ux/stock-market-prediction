import { useEffect, useRef, useState } from "react";

export default function TradingViewChart({ symbol }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // 📱 Detect screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Symbol mapper
  const mapToTradingView = (sym) => {
    if (!sym) return "";

    if (sym.endsWith(".NS")) {
      const base = sym.replace(".NS", "");

      const forceBSE = ["AXISBANK", "ICICIBANK", "SBIN", "RELIANCE"];

      if (forceBSE.includes(base)) return `BSE:${base}`;
      return `NSE:${base}`;
    }

    return `NASDAQ:${sym}`;
  };

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    const tvSymbol = mapToTradingView(symbol);

    // 🧹 Clean previous widget
    if (widgetRef.current) {
      containerRef.current.innerHTML = "";
      widgetRef.current = null;
    }

    // ⚡ Load script only once
    const createWidget = () => {
      if (!window.TradingView) return;

      widgetRef.current = new window.TradingView.widget({
        symbol: tvSymbol,
        interval: "D",
        theme: "dark",
        style: "1",
        autosize: true,

        container_id: containerRef.current.id,

        hide_top_toolbar: isMobile, // 📱 cleaner mobile UI
        hide_legend: false,
        allow_symbol_change: true,
        enable_publishing: false,

        backgroundColor: "#0b1220",
        gridColor: "rgba(255,255,255,0.06)",
        locale: "en",
      });
    };

    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
    } else {
      createWidget();
    }
  }, [symbol, isMobile]);

  return (
    <div
      ref={containerRef}
      id="tv_chart_container"
      style={{
        width: "100%",
        height: isMobile ? "350px" : "520px", // 📱 responsive height
        borderRadius: "14px",
        overflow: "hidden",
      }}
    />
  );
}