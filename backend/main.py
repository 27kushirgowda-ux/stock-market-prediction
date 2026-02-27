from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import init_db
from routers.auth import router as auth_router
from routers.history import router as history_router

from ml.analyze import analyze_stock_ml
from ml.top_stocks import get_top_stocks
from routers.candles import get_candles
from ml.actual_vs_predicted import get_actual_vs_predicted

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

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_stock(data: AnalyzeRequest):
    result = analyze_stock_ml(data.stock)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid stock symbol")
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