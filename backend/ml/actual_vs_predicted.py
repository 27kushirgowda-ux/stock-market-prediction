import yfinance as yf
import pandas as pd
from backend.ml.analyze import analyze_stock_ml

def get_actual_vs_predicted(symbol: str):
    df = yf.download(symbol, period="10d", interval="1d", progress=False)

    if df.empty or len(df) < 5:
        return []

    # ✅ Fix Yahoo column issue
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if "Close" not in df.columns:
        return []

    result = analyze_stock_ml(symbol)
    if not result:
        return []

    signal = result["signal"]

    data = []
    for idx, row in df.iterrows():
        actual = float(row["Close"])

        if signal == "BUY":
            predicted = actual * 1.01
        elif signal == "SELL":
            predicted = actual * 0.99
        else:
            predicted = actual

        data.append({
            "date": idx.strftime("%Y-%m-%d"),
            "actual": round(actual, 2),
            "predicted": round(predicted, 2)
        })

    return data