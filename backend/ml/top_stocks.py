import yfinance as yf

def get_top_stocks():
    # Top US Tickers
    tickers = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "AMZN", "META"]
    
    try:
        # 🚀 CHANGE: Use period="5d"
        data = yf.download(tickers, period="5d", interval="1d", progress=False)
        
        movers = []
        for t in tickers:
            prices = data['Close'][t].dropna()
            if len(prices) >= 2:
                current = prices.iloc[-1]
                prev = prices.iloc[-2]
                change = ((current - prev) / prev) * 100
                
                movers.append({
                    "symbol": t,
                    "change": round(change, 2)
                })
        
        return sorted(movers, key=lambda x: x['change'], reverse=True)[:5]
    except Exception as e:
        print(f"❌ US Fetch Error: {e}")
        return []