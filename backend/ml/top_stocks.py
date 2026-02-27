# backend/ml/top_stocks.py

import yfinance as yf
from backend.ml.stock_universe import ALL_STOCKS

def get_top_stocks():
    results = []

    for symbol in ALL_STOCKS:
        try:
            df = yf.download(
                symbol,
                period="1d",
                interval="5m",   # ✅ intraday
                progress=False,
                threads=False
            )

            if df is None or df.empty:
                continue

            open_price = df["Open"].iloc[0]
            last_price = df["Close"].iloc[-1]

            if open_price is None or last_price is None:
                continue

            open_price = float(open_price)
            last_price = float(last_price)

            change_pct = ((last_price - open_price) / open_price) * 100

            results.append({
                "symbol": symbol,
                "change": round(change_pct, 2)
            })

        except Exception as e:
            print(f"{symbol} failed: {e}")
            continue

    results.sort(key=lambda x: x["change"], reverse=True)
    return results[:5]