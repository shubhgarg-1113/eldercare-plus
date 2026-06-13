from fastapi import APIRouter
from models.schemas import DiarySummaryResponse
from db.connection import get_db
import google.generativeai as genai
import os
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/diary", tags=["diary"])

@router.get("/")
async def get_diary(userId: str):
    db = get_db()
    if db is None:
        return {"entries": []}

    cursor = db.conversations.find(
        {"userId": userId},
        {"_id": 0}
    ).sort("timestamp", -1)

    entries = await cursor.to_list(length=100)

    # Group by date
    grouped = {}
    for entry in entries:
        date = entry["timestamp"][:10]
        if date not in grouped:
            grouped[date] = []
        grouped[date].append({
            "message": entry["message"],
            "response": entry["response"],
            "timestamp": entry["timestamp"]
        })

    result = [{"date": date, "entries": entries} for date, entries in grouped.items()]
    return {"entries": result}


@router.get("/summary", response_model=DiarySummaryResponse)
async def get_summary(userId: str):
    db = get_db()
    if db is None:
        return DiarySummaryResponse(summary="No data available.")

    week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    cursor = db.conversations.find(
        {"userId": userId, "timestamp": {"$gte": week_ago}},
        {"_id": 0, "message": 1}
    )
    entries = await cursor.to_list(length=50)

    if not entries:
        return DiarySummaryResponse(summary="No health entries found for this week.")

    symptoms = " ".join([e["message"] for e in entries])

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return DiarySummaryResponse(summary="Gemini API Key not configured.")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Summarize the health symptoms this person reported this week in 2 sentences. Be gentle and factual. Symptoms: {symptoms}"
        response = model.generate_content(prompt)
        return DiarySummaryResponse(summary=response.text)
    except Exception as e:
        return DiarySummaryResponse(summary="Unable to generate summary right now.")