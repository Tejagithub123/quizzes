import uuid
from sqlalchemy.orm import Session
from models import User, Product
from schemas import UserCreate, ProductCreate, ProductUpdate
from auth import get_password_hash


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_product(db: Session, product: ProductCreate):
    product_id = str(uuid.uuid4())
    db_product = Product(
        id=product_id,
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
        is_favorite=product.is_favorite
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_products(db: Session, skip: int = 0, limit: int = 10, search: str = None, category: str = None, sort: str = None):
    query = db.query(Product)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Product.category == category)
    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    return query.offset(skip).limit(limit).all()


def get_product(db: Session, product_id: str):
    return db.query(Product).filter(Product.id == product_id).first()


def update_product(db: Session, product_id: str, product: ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.category = product.category
    db_product.is_favorite = product.is_favorite
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: str):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product
