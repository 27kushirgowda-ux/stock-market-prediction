import yfinance as yf
import pandas as pd

def analyze_stock_ml(stock: str):
    df = yf.download(stock, period="6mo", progress=False)

    # ❌ No data
    if df.empty or len(df) < 50:
        return None

    # ✅ Fix Yahoo column issue
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if "Close" not in df.columns:
        return None

    df["MA20"] = df["Close"].rolling(20).mean()
    df["MA50"] = df["Close"].rolling(50).mean()

    last_close = float(df["Close"].iloc[-1])
    ma20 = float(df["MA20"].iloc[-1])
    ma50 = float(df["MA50"].iloc[-1])

    if pd.isna(ma20) or pd.isna(ma50):
        return None

    if last_close > ma20 and ma20 > ma50:
        return {
            "signal": "BUY",
            "confidence": {"buy": 0.65, "hold": 0.20, "sell": 0.15},
            "reason": "Price above both short and long moving averages."
        }

    if last_close < ma20 and ma20 < ma50:
        return {
            "signal": "SELL",
            "confidence": {"buy": 0.15, "hold": 0.20, "sell": 0.65},
            "reason": "Price below key moving averages."
        }

    return {
        "signal": "HOLD",
        "confidence": {"buy": 0.25, "hold": 0.50, "sell": 0.25},
        "reason": "Sideways movement near averages."
    }