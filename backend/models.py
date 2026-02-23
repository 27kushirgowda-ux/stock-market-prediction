from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime
from database import Base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stock = Column(String)
    date = Column(String)
    signal = Column(String)
    buy_conf = Column(Float)
    hold_conf = Column(Float)
    sell_conf = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
