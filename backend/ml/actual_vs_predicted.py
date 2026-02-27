import yfinance as yf
from backend.ml.analyze import analyze_stock_ml

def get_actual_vs_predicted(symbol: str):
    symbol = symbol if symbol.endswith(".NS") else f"{symbol}.NS"

    df = yf.download(symbol, period="10d", interval="1d", progress=False)

    if df.empty or len(df) < 5:
        return []

    result = analyze_stock_ml(symbol)
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