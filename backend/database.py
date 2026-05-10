import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "stockai.db")

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. USERS TABLE (Optional if using Firebase, but good for local metadata)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            uid TEXT PRIMARY KEY,  -- 👈 Use Firebase UID as the primary key
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 2. HISTORY TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,  -- 👈 Changed to TEXT to support Firebase UIDs
            stock TEXT NOT NULL,
            date TEXT NOT NULL,
            signal TEXT NOT NULL,
            buy_conf REAL,
            hold_conf REAL,
            sell_conf REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()