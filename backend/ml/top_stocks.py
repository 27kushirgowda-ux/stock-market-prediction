import yfinance as yf
from ml.stock_universe import ALL_STOCKS

def get_top_stocks():
    movers = []

    for symbol in ALL_STOCKS:
        try:
            data = yf.download(symbol, period="2d", progress=False)

            if data.empty or len(data) < 2:
                continue

            prev_close = float(data["Close"].iloc[-2])
            today_close = float(data["Close"].iloc[-1])

            percent_change = ((today_close - prev_close) / prev_close) * 100

            movers.append({
                "symbol": symbol,
                "change": round(percent_change, 2)
            })

        except:
            continue

    # Sort by highest gain
    movers.sort(key=lambda x: x["change"], reverse=True)

    # Return top 5
    return movers[:5]
