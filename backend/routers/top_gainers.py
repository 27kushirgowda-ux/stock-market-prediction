from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

@router.get("/top-gainers")
def get_india_gainers():
    # Top NSE Tickers
    tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "ZOMATO.NS"]
    
    try:
        # 🚀 CHANGE: Use period="5d" to catch Friday's data on weekends
        data = yf.download(tickers, period="5d", interval="1d", progress=False)
        
        if data.empty:
            return {"stocks": []}

        stocks_list = []
        for t in tickers:
            # Drop NaN values to get the last two actual trading days
            prices = data['Close'][t].dropna()
            if len(prices) >= 2:
                current = prices.iloc[-1]
                prev = prices.iloc[-2]
                change = ((current - prev) / prev) * 100
                
                stocks_list.append({
                    "symbol": t.replace(".NS", ""), # Clean up the name for the UI
                    "change": round(change, 2)
                })
        
        # Sort by top gainers and return top 5
        final_list = sorted(stocks_list, key=lambda x: x['change'], reverse=True)[:5]
        return {"stocks": final_list}
        
    except Exception as e:
        print(f"❌ India Fetch Error: {e}")
        return {"stocks": []}