from pydantic import BaseModel
from typing import List, Optional

# Chat
class ChatRequest(BaseModel):
    message: str
    userId: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str

# Diary
class DiaryEntry(BaseModel):
    userId: str
    message: str
    response: str
    timestamp: str

class DiarySummaryResponse(BaseModel):
    summary: str

# Report
class ReportResponse(BaseModel):
    analysis: str
    lines: List[str]

# Medications
class MedicationRequest(BaseModel):
    userId: str
    medicineName: str
    time: str
    dosage: str

class MedicationResponse(BaseModel):
    userId: str
    medicineName: str
    time: str
    dosage: str