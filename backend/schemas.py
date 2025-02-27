from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    is_favorite: Optional[bool] = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class Product(ProductBase):
    id: str

    class Config:
        orm_mode = True
