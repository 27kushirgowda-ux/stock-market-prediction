from fastapi import APIRouter, HTTPException
# ✅ Fixed Import: Removed 'backend.' prefix to solve ModuleNotFoundError
from database import get_db

router = APIRouter(tags=["History"])

# ---------------- GET USER HISTORY ----------------
@router.get("/{user_id}")
def get_history(user_id: str):  # 👈 Changed to 'str' for Firebase UID
    """Fetches all past predictions for a specific user."""
    conn = get_db()
    cursor = conn.cursor()

    try:
        # We select everything ordered by the newest first
        cursor.execute("""
            SELECT id, stock, date, signal, buy_conf, hold_conf, sell_conf, created_at
            FROM history
            WHERE user_id = ?
            ORDER BY created_at DESC
        """, (user_id,))

        rows = cursor.fetchall()
        # Convert sqlite3.Row objects to standard Python dictionaries for JSON
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"❌ Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve history")
    finally:
        conn.close()


# ---------------- DELETE HISTORY ITEM ----------------
@router.delete("/{history_id}")
def delete_history(history_id: int):
    """Allows users to remove a specific prediction from their dashboard."""
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "DELETE FROM history WHERE id = ?",
            (history_id,)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found")
            
        return {"status": "success", "message": f"Deleted record {history_id}"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Delete operation failed")
    finally:
        conn.close()