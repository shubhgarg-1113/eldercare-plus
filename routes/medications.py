from fastapi import APIRouter
from models.schemas import MedicationRequest, MedicationResponse
from db.connection import get_db
from datetime import datetime

router = APIRouter(prefix="/api/medications", tags=["medications"])

@router.post("/", response_model=MedicationResponse)
async def add_medication(request: MedicationRequest):
    db = get_db()
    if db is not None:
        await db.medications.insert_one({
            "userId": request.userId,
            "medicineName": request.medicineName,
            "time": request.time,
            "dosage": request.dosage,
            "createdAt": datetime.utcnow().isoformat()
        })

    return MedicationResponse(
        userId=request.userId,
        medicineName=request.medicineName,
        time=request.time,
        dosage=request.dosage
    )

@router.get("/")
async def get_medications(userId: str):
    db = get_db()
    if db is None:
        return {"medications": []}

    cursor = db.medications.find(
        {"userId": userId},
        {"_id": 0}
    ).sort("createdAt", -1)

    medications = await cursor.to_list(length=100)
    return {"medications": medications}