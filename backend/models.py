from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True)  # UUID as string
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    category = Column(String)
    is_favorite = Column(Boolean, default=False)
