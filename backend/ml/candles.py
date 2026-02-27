# backend/ml/candles.py

import yfinance as yf

def get_candles(symbol: str):
    df = yf.download(
        symbol,
        period="5d",
        interval="15m",
        progress=False,
        threads=False
    )

    if df.empty:
        return []

    candles = []
    for index, row in df.iterrows():
        candles.append({
            "time": index.isoformat(),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"])
        })

    return candles