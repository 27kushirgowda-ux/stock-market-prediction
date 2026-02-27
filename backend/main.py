from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import init_db

from routers.auth import router as auth_router
from routers.history import router as history_router
from routers.top_gainers import router as top_gainers_router

from ml.analyze import analyze_stock_ml
from ml.top_stocks import get_top_stocks
from ml.candles import router as candles_router
from ml.actual_vs_predicted import router as avp_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth_router)
app.include_router(history_router)
app.include_router(top_gainers_router)
app.include_router(candles_router)
app.include_router(avp_router)

class AnalyzeRequest(BaseModel):
    stock: str
    date: str

class AnalyzeResponse(BaseModel):
    signal: str
    confidence: dict
    reason: str

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_stock(data: AnalyzeRequest):
    return analyze_stock_ml(data.stock)

@app.get("/top-stocks")
def top_stocks():
    return {"stocks": get_top_stocks()}

@app.get("/")
def root():
    return {"message": "StockAI backend running"}