from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    display_name: str
    password: str
    role: Literal["admin", "contributor", "reader"] = "contributor"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    username: str
    email: str
    display_name: str
    role: str
    created_at: datetime

    class Config:
        populate_by_name = True


class UserInDB(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    display_name: str
    hashed_password: str
    role: str = "contributor"
    created_at: datetime = Field(default_factory=datetime.utcnow)
