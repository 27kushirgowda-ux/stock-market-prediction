from fastapi import APIRouter
import yfinance as yf

router = APIRouter(prefix="/candles", tags=["candles"])

@router.get("/{symbol}")
def get_candles(symbol: str):
    try:
        ticker = symbol.upper()

        df = yf.download(
            ticker,
            period="2mo",
            interval="1d",
            progress=False,
            threads=False
        )

        if df.empty:
            return []

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

    except Exception as e:
        return []