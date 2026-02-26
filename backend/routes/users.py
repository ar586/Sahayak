from fastapi import APIRouter, Depends
from bson import ObjectId
from database import get_db
from auth_utils import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

def serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id", ""))
    
    # Safely serialize authors if they exist
    if "authors" in doc and isinstance(doc["authors"], list):
        for author in doc["authors"]:
            if isinstance(author, dict) and "user_id" in author and isinstance(author["user_id"], ObjectId):
                author["user_id"] = str(author["user_id"])
                
    # Safely serialize other ObjectIds
    if "submitted_by" in doc and isinstance(doc["submitted_by"], ObjectId):
        doc["submitted_by"] = str(doc["submitted_by"])
    if "reviewed_by" in doc and isinstance(doc["reviewed_by"], ObjectId):
        doc["reviewed_by"] = str(doc["reviewed_by"])
        
    return doc

@router.get("/me/subjects")
async def get_my_subjects(current_user: dict = Depends(get_current_user)):
    """Fetch all subjects submitted by the current user."""
    db = get_db()
    subjects = []
    
    query = {"submitted_by": ObjectId(current_user["id"])}
    
    async for doc in db.subjects.find(query).sort("created_at", -1):
        subjects.append(serialize(doc))
        
    return subjects
