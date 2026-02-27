from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from datetime import datetime
from backend.database import init_db
from backend.routers.auth import router as auth_router
from backend.routers.history import router as history_router

from backend.ml.analyze import analyze_stock_ml
from backend.ml.top_stocks import get_top_stocks
from backend.ml.candles import get_candles
from backend.ml.actual_vs_predicted import get_actual_vs_predicted

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth_router)
app.include_router(history_router)

class AnalyzeRequest(BaseModel):
    stock: str
    date: str

class AnalyzeResponse(BaseModel):
    signal: str
    confidence: dict
    reason: str

from datetime import datetime
from backend.database import get_db

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_stock(data: AnalyzeRequest):
    result = analyze_stock_ml(data.stock)

    if not result:
        raise HTTPException(status_code=400, detail="Invalid stock symbol")

    # 🔐 TEMP USER (until auth integration)
    user_id = 1

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO history (
            user_id,
            stock,
            date,
            signal,
            buy_conf,
            hold_conf,
            sell_conf
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        data.stock,
        datetime.now().strftime("%Y-%m-%d"),
        result["signal"],
        result["confidence"]["buy"],
        result["confidence"]["hold"],
        result["confidence"]["sell"]
    ))

    conn.commit()
    conn.close()

    return result

@app.get("/top-stocks")
def top_stocks():
    return {"stocks": get_top_stocks()}

@app.get("/candles/{symbol}")
def candles(symbol: str):
    return get_candles(symbol)

@app.get("/actual-vs-predicted/{symbol}")
def actual_vs_predicted(symbol: str):
    return get_actual_vs_predicted(symbol)

@app.get("/")
def root():
    return {"message": "StockAI backend running"}