from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from schemas import UserCreate, UserOut, Token, Product, ProductCreate, ProductUpdate
import crud
from auth import verify_password, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware to allow requests from your frontend (http://localhost:3000)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    # Or use ["*"] to allow all origins (not recommended for production)
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Dependency: Get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = decode_access_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    user = crud.get_user_by_username(db, username=token_data.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered"
        )
    return crud.create_user(db, user)


@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/products/", response_model=Product)
def create_new_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_product(db, product)


@app.get("/products/", response_model=list[Product])
def read_products(
    skip: int = 0,
    limit: int = 10,
    search: str = None,
    category: str = None,
    sort: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_products(db, skip=skip, limit=limit, search=search, category=category, sort=sort)


@app.put("/products/{product_id}", response_model=Product)
def update_existing_product(
    product_id: str,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    updated_product = crud.update_product(db, product_id, product)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product


@app.delete("/products/{product_id}", response_model=Product)
def delete_existing_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    deleted_product = crud.delete_product(db, product_id)
    if not deleted_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return deleted_product
