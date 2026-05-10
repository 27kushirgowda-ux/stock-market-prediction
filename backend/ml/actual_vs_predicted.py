import yfinance as yf
import pandas as pd
# ✅ Fixed Import (Removed 'backend.' prefix)
from ml.analyze import analyze_stock_ml

def get_actual_vs_predicted(symbol: str):
    try:
        # Fetching 30 days to ensure we have enough data for a smooth line
        df = yf.download(symbol, period="1mo", interval="1d", progress=False)

        if df.empty or len(df) < 10:
            return []

        # ✅ Fix Yahoo MultiIndex
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 1. Generate a "Predicted" trend line using an EMA
        # This represents the AI's 'ideal' price path
        df["Predicted"] = df["Close"].ewm(span=10, adjust=False).mean()

        # 2. Add a 'bias' based on our ML Signal
        # If the signal is BUY, the prediction line shifts slightly higher
        result = analyze_stock_ml(symbol)
        signal_factor = 1.0  # Neutral
        
        if result:
            if result["signal"] == "BUY":
                signal_factor = 1.02 # Expect 2% higher
            elif result["signal"] == "SELL":
                signal_factor = 0.98 # Expect 2% lower

        data = []
        # We only take the last 15 days for the chart display
        recent_df = df.tail(15)

        for index, row in recent_df.iterrows():
            actual_val = float(row["Close"])
            # The predicted value is the trend line * our ML bias
            predicted_val = float(row["Predicted"]) * signal_factor

            data.append({
                "date": index.strftime("%b %d"), # Format: "May 09"
                "actual": round(actual_val, 2),
                "predicted": round(predicted_val, 2)
            })

        return data

    except Exception as e:
        print(f"❌ Error in actual_vs_predicted for {symbol}: {e}")
        return []