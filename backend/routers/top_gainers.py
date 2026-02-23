# routers/top_gainers.py
from fastapi import APIRouter
import yfinance as yf

router = APIRouter(
    prefix="/top-gainers",
    tags=["Top Gainers"]
)

STOCKS = ["RELIANCE.NS", "ICICIBANK.NS", "AXISBANK.NS", "LT.NS", "TCS.NS"]

@router.get("/")
def get_top_gainers():
    data = []

    for symbol in STOCKS:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="2d")

        if len(hist) < 2:
            continue

        prev = hist["Close"].iloc[-2]
        curr = hist["Close"].iloc[-1]
        change_pct = ((curr - prev) / prev) * 100

        data.append({
            "symbol": symbol.replace(".NS", ""),
            "ltp": round(curr, 2),
            "change_pct": round(change_pct, 2)
        })

    data.sort(key=lambda x: x["change_pct"], reverse=True)

    return {"stocks": data[:5]}