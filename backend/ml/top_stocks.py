import yfinance as yf

STOCKS = [
    "TCS.NS",
    "INFY.NS",
    "RELIANCE.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "SBIN.NS",
    "LT.NS",
    "ITC.NS",
]

def get_top_stocks():
    gainers = []

    for symbol in STOCKS:
        try:
            data = yf.download(symbol, period="2d", interval="1d", progress=False)

            if len(data) < 2:
                continue

            prev_close = float(data["Close"].iloc[-2])
            curr_close = float(data["Close"].iloc[-1])

            change_pct = ((curr_close - prev_close) / prev_close) * 100

            gainers.append({
                "symbol": symbol,
                "price": round(curr_close, 2),
                "change_percent": round(change_pct, 2)
            })

        except Exception as e:
            print(symbol, e)

    gainers.sort(key=lambda x: x["change_percent"], reverse=True)
    return gainers[:5]