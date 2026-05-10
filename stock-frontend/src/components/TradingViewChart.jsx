import { useEffect, useRef, useState } from "react";

export default function TradingViewChart({ symbol }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 📱 Handle Responsive Resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🇮🇳/🇺🇸 Symbol Mapping Logic
  const getTradingViewSymbol = (sym) => {
    if (!sym) return "NASDAQ:AAPL"; // Default fallback

    const cleanSymbol = sym.toUpperCase();

    // Indian Markets (National Stock Exchange)
    if (cleanSymbol.endsWith(".NS")) {
      return `NSE:${cleanSymbol.replace(".NS", "")}`;
    }
    
    // Indian Markets (Bombay Stock Exchange)
    if (cleanSymbol.endsWith(".BO")) {
      return `BSE:${cleanSymbol.replace(".BO", "")}`;
    }

    // Default to NASDAQ for US Stocks
    return `NASDAQ:${cleanSymbol}`;
  };

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    const tvSymbol = getTradingViewSymbol(symbol);
    setLoading(true);

    const initWidget = () => {
      if (!window.TradingView) return;

      // 🧹 Cleanup: Clear the container before mounting a new widget
      containerRef.current.innerHTML = `<div id="tv_widget_mount" style="height:100%;width:100%"></div>`;

      widgetRef.current = new window.TradingView.widget({
        symbol: tvSymbol,
        interval: "D",
        timezone: "Asia/Kolkata", // Matches the local market time in India
        theme: "dark",
        style: "1", // Candlesticks
        locale: "en",
        toolbar_bg: "#020617",
        enable_publishing: false,
        hide_top_toolbar: isMobile,
        hide_legend: isMobile,
        save_image: false,
        container_id: "tv_widget_mount",
        autosize: true,
        backgroundColor: "#020617",
        gridColor: "rgba(255, 255, 255, 0.05)",
        studies: [
          "RSI@tv-basicstudies",
          "MASimple@tv-basicstudies" // Mirrors your analyze.py logic
        ],
        loading_screen: { backgroundColor: "#020617" },
      });
      
      setLoading(false);
    };

    // ⚡ External Script Management
    if (!window.TradingView) {
      const script = document.createElement("script");
      script.id = "tradingview-widget-loading-script";
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    // Component Cleanup
    return () => {
      if (widgetRef.current) {
        widgetRef.current = null;
      }
    };
  }, [symbol, isMobile]);

  return (
    <div className="relative w-full h-full rounded-2xl border border-white/5 bg-[#020617] shadow-2xl overflow-hidden">
      {/* 🌀 Custom Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-20">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide">
            FETCHING LIVE MARKET DATA...
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        id="tv_main_container"
        className="transition-opacity duration-700"
        style={{
          width: "100%",
          height: isMobile ? "380px" : "550px",
          opacity: loading ? 0 : 1
        }}
      />
    </div>
  );
}