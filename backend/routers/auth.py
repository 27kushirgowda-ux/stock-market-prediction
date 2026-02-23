from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db

router = APIRouter()

# ---------------- MODELS ----------------
class AuthRequest(BaseModel):
    email: str
    password: str
    name: str | None = None   # ✅ added safely


# ---------------- SIGNUP ----------------
@router.post("/signup")
def signup(data: AuthRequest):
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            """,
            (data.name, data.email, data.password)
        )
        conn.commit()
    except:
        raise HTTPException(status_code=400, detail="User already exists")
    finally:
        conn.close()

    return {"message": "Signup successful"}


# ---------------- LOGIN ----------------
@router.post("/login")
def login(data: AuthRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, name, email
        FROM users
        WHERE email = ? AND password = ?
        """,
        (data.email, data.password)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"]
    }


# ---------------- PROFILE ----------------
@router.get("/profile/{user_id}")
def get_profile(user_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT name, email FROM users WHERE id = ?",
        (user_id,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": user["name"],
        "email": user["email"]
    }
