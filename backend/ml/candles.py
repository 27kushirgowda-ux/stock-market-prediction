import yfinance as yf
from fastapi import APIRouter

router = APIRouter(prefix="/candles", tags=["Candles"])

@router.get("/{symbol}")
def get_candles(symbol: str):
    symbol = symbol if symbol.endswith(".NS") else f"{symbol}.NS"

    df = yf.download(symbol, period="2mo", interval="1d", progress=False)

    if df.empty:
        return []

    return [
        {
            "date": idx.strftime("%Y-%m-%d"),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
        }
        for idx, row in df.iterrows()
    ]