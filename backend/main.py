from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from .database import Base, engine, get_db
from .models import User
from .auth import hash_password, verify_password, create_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TapWise Backend")

# ===============================
# Schemas
# ===============================

class SignupInput(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str

class LoginInput(BaseModel):
    email: EmailStr
    password: str

# ===============================
# Routes
# ===============================

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
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"user_id": user.id, "name": user.name, "token": token}
