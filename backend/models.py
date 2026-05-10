from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

# Define the Base class for your models
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    # uid is the unique string from Firebase
    uid = Column(String, primary_key=True, index=True) 
    name = Column(String)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    # Changed to String to store the Firebase UID
    user_id = Column(String, index=True) 
    stock = Column(String)
    date = Column(String)
    signal = Column(String)
    buy_conf = Column(Float)
    hold_conf = Column(Float)
    sell_conf = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)