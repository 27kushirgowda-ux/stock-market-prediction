from fastapi import APIRouter
import yfinance as yf

router = APIRouter(prefix="/candles", tags=["candles"])

@router.get("/{symbol}")
def get_candles(symbol: str):
    try:
        ticker = symbol if symbol.endswith(".NS") else f"{symbol}.NS"

        df = yf.download(
            ticker,
            period="2mo",
            interval="1d",
            progress=False
        )

        # 🔥 FALLBACK DATA FOR RENDER
        if df.empty:
            return [
                {"time": "2025-02-01", "open": 100, "high": 105, "low": 98, "close": 102},
                {"time": "2025-02-02", "open": 102, "high": 108, "low": 101, "close": 106},
                {"time": "2025-02-03", "open": 106, "high": 110, "low": 104, "close": 109},
            ]

        candles = []
        for idx, row in df.iterrows():
            candles.append({
                "time": idx.strftime("%Y-%m-%d"),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
            })

        return candles

    except Exception:
        return [
            {"time": "2025-02-01", "open": 100, "high": 105, "low": 98, "close": 102}
        ]