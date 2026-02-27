from fastapi import APIRouter
from backend.database import get_db

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/{user_id}")
def get_history(user_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@router.post("/")
def add_history(item: dict):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO history (user_id, stock, date, signal, buy_conf, hold_conf, sell_conf)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        item["user_id"],
        item["stock"],
        item["date"],
        item["signal"],
        item["buy_conf"],
        item["hold_conf"],
        item["sell_conf"]
    ))

    conn.commit()
    conn.close()

    return {"message": "History saved"}


@router.delete("/{history_id}")
def delete_history(history_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM history WHERE id = ?", (history_id,))
    conn.commit()
    conn.close()

    return {"message": "Deleted"}
