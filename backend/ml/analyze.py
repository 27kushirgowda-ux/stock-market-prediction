import yfinance as yf
import pandas as pd

def analyze_stock_ml(stock: str):
    symbol = stock if stock.endswith(".NS") else f"{stock}.NS"

    df = yf.download(symbol, period="6mo", progress=False)

    if df.empty or len(df) < 50:
        return {
            "signal": "HOLD",
            "confidence": {"buy": 0.33, "hold": 0.34, "sell": 0.33},
            "reason": "Not enough historical data."
        }

    df["MA20"] = df["Close"].rolling(20).mean()
    df["MA50"] = df["Close"].rolling(50).mean()

    last_close = float(df["Close"].iloc[-1])
    ma20 = float(df["MA20"].iloc[-1])
    ma50 = float(df["MA50"].iloc[-1])

    if pd.isna(ma20) or pd.isna(ma50):
        return {
            "signal": "HOLD",
            "confidence": {"buy": 0.33, "hold": 0.34, "sell": 0.33},
            "reason": "Insufficient indicator data."
        }

    if last_close > ma20 > ma50:
        return {
            "signal": "BUY",
            "confidence": {"buy": 0.65, "hold": 0.20, "sell": 0.15},
            "reason": "Price above short & long-term moving averages."
        }

    if last_close < ma20 < ma50:
        return {
            "signal": "SELL",
            "confidence": {"buy": 0.15, "hold": 0.20, "sell": 0.65},
            "reason": "Price below key moving averages."
        }

    return {
        "signal": "HOLD",
        "confidence": {"buy": 0.25, "hold": 0.50, "sell": 0.25},
        "reason": "Sideways market movement."
    }