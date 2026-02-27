from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------- LOCAL IMPORTS ----------------
from database import init_db

# Routers
from routers.auth import router as auth_router
from routers.history import router as history_router

# ML / Data logic
from ml.analyze import analyze_stock_ml
from ml.top_stocks import get_top_stocks
from ml.candles import get_candles
from ml.actual_vs_predicted import get_actual_vs_predicted

# ---------------- APP ----------------
app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB INIT ----------------
init_db()

# ---------------- ROUTERS ----------------
app.include_router(auth_router)
app.include_router(history_router)


# ---------------- ANALYZE ----------------
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


# ---------------- TOP STOCKS (SINGLE SOURCE OF TRUTH) ----------------
@app.get("/top-stocks")
def top_stocks():
    return {"stocks": get_top_stocks()}


# ---------------- CANDLES ----------------
@app.get("/candles/{symbol}")
def candles(symbol: str):
    return get_candles(symbol)


# ---------------- ACTUAL VS PREDICTED ----------------
@app.get("/actual-vs-predicted/{symbol}")
def actual_vs_predicted(symbol: str):
    return get_actual_vs_predicted(symbol)


# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "StockAI backend running"}