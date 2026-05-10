from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
# ✅ Fixed Import (Removed 'backend.' prefix)
from database import get_db

router = APIRouter()

# ---------------- MODELS ----------------
class SyncRequest(BaseModel):
    uid: str        # Firebase Unique ID
    email: str
    name: str | None = None


# ---------------- SYNC USER ----------------
@router.post("/sync")
def sync_user(data: SyncRequest):
    """
    Ensures the user exists in our local database after they 
    log in/sign up via Firebase on the frontend.
    """
    conn = get_db()
    cursor = conn.cursor()

    try:
        # We use 'INSERT OR IGNORE' so we don't crash if the user already exists
        cursor.execute(
            """
            INSERT OR IGNORE INTO users (uid, name, email)
            VALUES (?, ?, ?)
            """,
            (data.uid, data.name, data.email)
        )
        # In case the name changed in Firebase, we update it locally
        cursor.execute(
            "UPDATE users SET name = ? WHERE uid = ?",
            (data.name, data.uid)
        )
        conn.commit()
    except Exception as e:
        print(f"Sync Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to sync user data")
    finally:
        conn.close()

    return {"status": "success", "message": "User synced with local database"}


# ---------------- GET PROFILE ----------------
@router.get("/profile/{uid}")
def get_profile(uid: str):
    """Fetches user metadata using the Firebase string UID"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT name, email FROM users WHERE uid = ?",
        (uid,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User metadata not found")

    return {
        "name": user["name"],
        "email": user["email"]
    }