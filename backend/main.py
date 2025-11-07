from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from backend.database import Base, engine, get_db
from backend.models import User, Card
from backend.auth import hash_password, verify_password, create_access_token

# ============================================================
# INITIALIZE
# ============================================================

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TapWise Backend")

# ============================================================
# SCHEMAS
# ============================================================

class SignupInput(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class CardInput(BaseModel):
    user_id: int
    name: str
    network: str | None = None
    reward_tag: str | None = None


# ============================================================
# ROUTES
# ============================================================

@app.get("/health")
def health():
    return {"status": "ok", "service": "tapwise-backend"}


@app.post("/signup")
def signup(data: SignupInput, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create and store user
    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"user_id": user.id, "name": user.name, "token": token}


@app.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    print("🧩 Incoming login attempt:", data.email, data.password)
    print("🧩 Found user in DB:", user.email if user else None, "Hash:", user.password_hash if user else None)

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"user_id": user.id, "name": user.name, "token": token}


# ============================================================
# CARD ROUTES
# ============================================================

@app.post("/cards/add")
def add_card(data: CardInput, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_card = Card(
        user_id=data.user_id,
        name=data.name,
        network=data.network,
        reward_tag=data.reward_tag
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return {
        "message": "Card added successfully",
        "card": {
            "id": new_card.id,
            "name": new_card.name,
            "network": new_card.network,
            "reward_tag": new_card.reward_tag
        }
    }


@app.get("/cards/{user_id}")
def get_cards(user_id: int, db: Session = Depends(get_db)):
    cards = db.query(Card).filter(Card.user_id == user_id).all()
    return {
        "cards": [
            {
                "id": c.id,
                "name": c.name,
                "network": c.network,
                "reward_tag": c.reward_tag
            }
            for c in cards
        ]
    }
