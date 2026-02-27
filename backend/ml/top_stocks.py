# backend/ml/top_stocks.py

import yfinance as yf
from backend.ml.stock_universe import ALL_STOCKS

def get_top_stocks():
    results = []

    for symbol in ALL_STOCKS:
        data = yf.download(
            symbol,
            period="2d",
            interval="1d",
            progress=False,
            threads=False   # 🔴 REQUIRED on Render
        )

        if data.empty or len(data) < 2:
            continue

        prev_close = float(data["Close"].iloc[-2])
        last_close = float(data["Close"].iloc[-1])

        change_pct = ((last_close - prev_close) / prev_close) * 100

        results.append({
            "symbol": symbol,
            "change": round(change_pct, 2)
        })

    results.sort(key=lambda x: x["change"], reverse=True)
    return results[:5]