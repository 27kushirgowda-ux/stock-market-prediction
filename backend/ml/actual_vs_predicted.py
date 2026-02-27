import yfinance as yf
from backend.ml.analyze import analyze_stock_ml

def get_actual_vs_predicted(symbol: str):
    symbol = symbol.upper()   # ✅ US stocks only

    df = yf.download(
        symbol,
        period="10d",
        interval="1d",
        progress=False
    )

    # ✅ Guard 1: No price data
    if df.empty or len(df) < 5:
        return []

    result = analyze_stock_ml(symbol)

    # ✅ Guard 2: ML returned None
    if not result or "signal" not in result:
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