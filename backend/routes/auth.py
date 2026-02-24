from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from database import get_db
from models.user import UserCreate, UserLogin, UserOut
from auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_db()

    # Check uniqueness
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")

    doc = {
        "username": user.username,
        "email": user.email,
        "display_name": user.display_name,
        "hashed_password": hash_password(user.password),
        "role": user.role,
        "created_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(doc)
    return {"message": "User registered successfully", "id": str(result.inserted_id)}


@router.post("/login")
async def login(user: UserLogin):
    db = get_db()
    db_user = await db.users.find_one({"email": user.email})

    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user["_id"]), "role": db_user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "username": db_user["username"],
            "display_name": db_user["display_name"],
            "role": db_user["role"],
        },
    }


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "display_name": current_user["display_name"],
        "email": current_user["email"],
        "role": current_user["role"],
    }
