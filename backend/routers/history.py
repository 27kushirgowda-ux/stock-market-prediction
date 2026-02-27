from fastapi import APIRouter
from backend.database import get_db

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
def get_history():
    # TEMP USER (same as analyze)
    user_id = 1

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            stock,
            date,
            signal,
            buy_conf,
            hold_conf,
            sell_conf,
            created_at
        FROM history
        WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    history = []
    for row in rows:
        history.append({
            "stock": row["stock"],
            "date": row["date"],
            "signal": row["signal"],
            "confidence": {
                "buy": row["buy_conf"],
                "hold": row["hold_conf"],
                "sell": row["sell_conf"]
            },
            "created_at": row["created_at"]
        })

    return history