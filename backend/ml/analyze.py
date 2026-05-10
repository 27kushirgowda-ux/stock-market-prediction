import yfinance as yf
import pandas as pd
import numpy as np

def analyze_stock_ml(stock: str):
    try:
        # Fetching 6 months of data for a solid trend analysis
        df = yf.download(stock, period="6mo", interval="1d", progress=False)

        if df.empty or len(df) < 50:
            print(f"⚠️ Not enough data for {stock}")
            return None

        # ✅ Fix Yahoo MultiIndex column issue
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 1. Calculate Technical Indicators
        # Moving Averages
        df["MA20"] = df["Close"].rolling(window=20).mean()
        df["MA50"] = df["Close"].rolling(window=50).mean()

        # RSI (Relative Strength Index) - Measures momentum
        delta = df["Close"].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df["RSI"] = 100 - (100 / (1 + rs))

        # 2. Get Latest Values
        last_close = float(df["Close"].iloc[-1])
        ma20 = float(df["MA20"].iloc[-1])
        ma50 = float(df["MA50"].iloc[-1])
        rsi = float(df["RSI"].iloc[-1])
        prev_close = float(df["Close"].iloc[-2])

        if pd.isna(ma20) or pd.isna(ma50) or pd.isna(rsi):
            return None

        # 3. Decision Engine (Scoring System)
        # We start with a neutral score and add/subtract based on indicators
        score = 0
        reasons = []

        # Trend Factor
        if last_close > ma20 > ma50:
            score += 2
            reasons.append("Strong upward trend confirmed by moving averages.")
        elif last_close < ma20 < ma50:
            score -= 2
            reasons.append("Downward trend detected; price below key levels.")

        # Momentum Factor (RSI)
        if rsi < 35:
            score += 1.5
            reasons.append(f"Stock is oversold (RSI: {round(rsi, 1)}), potential bounce back.")
        elif rsi > 65:
            score -= 1.5
            reasons.append(f"Stock is overbought (RSI: {round(rsi, 1)}), expect a cooling period.")

        # Price Action Factor
        if last_close > prev_close:
            score += 0.5
        else:
            score -= 0.5

        # 4. Final Signal & Dynamic Confidence
        # Convert score to signal
        if score >= 1.5:
            signal = "BUY"
            conf = {"buy": 0.70, "hold": 0.20, "sell": 0.10}
        elif score <= -1.5:
            signal = "SELL"
            conf = {"buy": 0.10, "hold": 0.20, "sell": 0.70}
        else:
            signal = "HOLD"
            conf = {"buy": 0.30, "hold": 0.50, "sell": 0.20}

        return {
            "symbol": stock.upper(),
            "signal": signal,
            "confidence": conf,
            "reason": " ".join(reasons) if reasons else "Market is showing neutral sideways movement."
        }

    except Exception as e:
        print(f"❌ Error analyzing {stock}: {e}")
        return None