from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "tapwise-secret-key"  # ⚠️ replace with env var in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 96

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    """Verify a plain password against a stored hash."""
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    """Create a JWT token that expires in 96 hours."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
