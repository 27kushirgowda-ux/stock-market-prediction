import yfinance as yf

US_STOCKS = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "GOOGL", "META"]

def get_top_stocks():
    results = []

    for symbol in US_STOCKS:
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d", interval="5m")

            if data.empty:
                continue

            open_price = data["Open"].iloc[0]
            last_price = data["Close"].iloc[-1]

            change_pct = ((last_price - open_price) / open_price) * 100

            results.append({
                "symbol": symbol,
                "price": round(last_price, 2),
                "change_percent": round(change_pct, 2)
            })

        except Exception as e:
            print(symbol, e)

    # 🔥 IMPORTANT: always return something
    results.sort(key=lambda x: x["change_percent"], reverse=True)

    return results[:5]   # top 5 movers