import yfinance as yf
import pandas as pd
from backend.ml.analyze import analyze_stock_ml

def get_actual_vs_predicted(symbol: str):
    df = yf.download(symbol, period="15d", interval="1d", progress=False)

    if df.empty or len(df) < 7:
        return []

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if "Close" not in df.columns:
        return []

    result = analyze_stock_ml(symbol)
    if not result:
        return []

    signal = result["signal"]

    data = []
    closes = df["Close"].tolist()

    for i in range(len(closes) - 1):
        actual = float(closes[i])

        # 📈 Trend-based future prediction
        if signal == "BUY":
            predicted = closes[i + 1] * 1.02
        elif signal == "SELL":
            predicted = closes[i + 1] * 0.98
        else:
            predicted = closes[i + 1]

        data.append({
            "date": df.index[i].strftime("%Y-%m-%d"),
            "actual": round(actual, 2),
            "predicted": round(predicted, 2)
        })

    return data