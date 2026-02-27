import yfinance as yf
from backend.ml.analyze import analyze_stock_ml

def get_actual_vs_predicted(symbol: str):
    # ✅ US stocks only (AAPL, TSLA, MSFT etc.)
    df = yf.download(symbol, period="6mo", interval="1d", progress=False)

    if df.empty or len(df) < 20:
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