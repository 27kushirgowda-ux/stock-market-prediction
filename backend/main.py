import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore

# --- INTERNAL IMPORTS ---
from database import init_db, get_db
from routers.auth import router as auth_router
from routers.history import router as history_router
from routers.top_gainers import router as india_movers_router

from ml.analyze import analyze_stock_ml
from ml.top_stocks import get_top_stocks
from ml.candles import get_candles
from ml.actual_vs_predicted import get_actual_vs_predicted

# ============================================================
# FIREBASE CLOUD INITIALIZATION
# ============================================================
# This allows your Python backend to write to your Firestore Console
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccount.json") # Ensure this file is in your backend/ folder
        firebase_admin.initialize_app(cred)
    db_cloud = firestore.client()
    print("🚀 Cloud Firestore: Connected Successfully")
except Exception as e:
    print(f"⚠️ Cloud Firestore Error: {e}. Check if serviceAccount.json exists.")

# ============================================================
# APP CONFIGURATION
# ============================================================
app = FastAPI(title="StockAI Intelligence Suite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create local SQLite tables (users, history) on startup
init_db()

# Register Routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(history_router, prefix="/history", tags=["History"])
app.include_router(india_movers_router, tags=["Market Data"])

# ============================================================
# DATA MODELS
# ============================================================
class AnalyzeRequest(BaseModel):
    stock: str
    date: str
    user_id: str  # Firebase UID from the frontend

class AnalyzeResponse(BaseModel):
    signal: str
    confidence: dict
    reason: str

# ============================================================
# ENDPOINTS
# ============================================================

@app.get("/")
def health():
    return {
        "status": "online", 
        "engine": "AI-v3-Flash", 
        "cloud_sync": "Active",
        "timestamp": datetime.now()
    }

@app.get("/top-stocks")
def get_us_movers():
    """Fetches NASDAQ/NYSE movers for the US card"""
    stocks = get_top_stocks()
    return {"stocks": stocks}

@app.post("/analyze", response_model=AnalyzeResponse)
def run_full_analysis(data: AnalyzeRequest):
    """Generates AI prediction and performs dual-sync (SQL + Firestore)"""
    
    # 1. GENERATE AI PREDICTION
    result = analyze_stock_ml(data.stock)
    if not result:
        raise HTTPException(status_code=404, detail="Market data unavailable for ticker")

    # 2. LOCAL SQL STORAGE (For the local History tab)
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO history (user_id, stock, date, signal, buy_conf, hold_conf, sell_conf)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            data.user_id,
            data.stock,
            data.date,
            result["signal"],
            result["confidence"]["buy"],
            result["confidence"]["hold"],
            result["confidence"]["sell"]
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"⚠️ SQL Log Error: {e}")

    # 3. CLOUD FIRESTORE STORAGE (Automatic Cloud Push)
    try:
        # This will automatically create the 'history' collection in your Firestore console
        db_cloud.collection("history").add({
            "user_id": data.user_id,
            "stock": data.stock,
            "signal": result["signal"],
            "confidence": result["confidence"],
            "date": data.date,
            "timestamp": datetime.now()
        })
        print(f"📊 Cloud Push: Prediction for {data.stock} synced to Firestore")
    except Exception as e:
        print(f"❌ Firestore Sync Error: {e}")

    return result

@app.get("/candles/{symbol}")
def get_stock_candles(symbol: str):
    """Returns data for the dashboard's TradingView charts"""
    return get_candles(symbol)

@app.get("/actual-vs-predicted/{symbol}")
def get_trend_comparison(symbol: str):
    """Returns accuracy comparison for Recharts visualizations"""
    return get_actual_vs_predicted(symbol)

# ============================================================
# SERVER RUNNER
# ============================================================
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)