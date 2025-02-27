from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import crud
from schemas import ProductCreate

# Ensure tables exist
Base.metadata.create_all(bind=engine)


def seed_products():
    db = SessionLocal()
    products = [
        {"name": "Smartphone", "description": "Latest model smartphone",
            "price": 699.0, "category": "Electronics", "is_favorite": False},
        {"name": "Laptop", "description": "High performance laptop",
            "price": 1299.0, "category": "Electronics", "is_favorite": False},
        {"name": "Headphones", "description": "Noise-cancelling headphones",
            "price": 199.0, "category": "Electronics", "is_favorite": False},
        {"name": "Coffee Maker", "description": "Automatic coffee maker",
            "price": 99.0, "category": "Home Appliances", "is_favorite": False},
        {"name": "Electric Kettle", "description": "Fast boiling kettle",
            "price": 49.0, "category": "Home Appliances", "is_favorite": False},
        {"name": "Blender", "description": "High-speed blender",
            "price": 89.0, "category": "Home Appliances", "is_favorite": False},
        {"name": "Running Shoes", "description": "Comfortable running shoes",
            "price": 120.0, "category": "Sportswear", "is_favorite": False},
        {"name": "Backpack", "description": "Durable backpack",
            "price": 80.0, "category": "Accessories", "is_favorite": False},
        {"name": "Smart Watch", "description": "Fitness tracking smart watch",
            "price": 249.0, "category": "Electronics", "is_favorite": False},
        {"name": "Desk Lamp", "description": "LED desk lamp",
            "price": 35.0, "category": "Home Decor", "is_favorite": False},
    ]
    for prod in products:
        product_in = ProductCreate(**prod)
        crud.create_product(db, product_in)
    db.close()
    print("Database seeded with sample products.")


if __name__ == "__main__":
    seed_products()
