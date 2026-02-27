# backend/ml/top_stocks.py

import yfinance as yf
from backend.ml.stock_universe import ALL_STOCKS

def get_top_stocks():
    results = []

    for symbol in ALL_STOCKS:
        try:
            data = yf.download(
                symbol,
                period="2d",
                interval="1d",
                progress=False,
                threads=False
            )

            if data is None or data.empty or len(data) < 2:
                continue

            prev_close = data["Close"].iloc[-2]
            last_close = data["Close"].iloc[-1]

            if prev_close is None or last_close is None:
                continue

            prev_close = float(prev_close)
            last_close = float(last_close)

            change_pct = ((last_close - prev_close) / prev_close) * 100

            results.append({
                "symbol": symbol,
                "change": round(change_pct, 2)
            })

        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            continue

    results.sort(key=lambda x: x["change"], reverse=True)
    return results[:5]