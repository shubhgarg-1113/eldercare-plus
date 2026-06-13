from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse
from db.connection import get_db
from groq import Groq
import os
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are a gentle health assistant for senior citizens.
When the user mentions a symptom, ask ONE clarifying follow-up question.
Keep responses under 80 words. Never diagnose. Never suggest medications."""

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return ChatResponse(response="Groq API Key not configured.")

    try:
        client = Groq(api_key=api_key)

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in (request.history or []):
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": request.message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=150
        )

        reply = response.choices[0].message.content

        db = get_db()
        if db is not None:
            await db.conversations.insert_one({
                "userId": request.userId,
                "message": request.message,
                "response": reply,
                "timestamp": datetime.utcnow().isoformat()
            })

        return ChatResponse(response=reply)

    except Exception as e:
        return ChatResponse(response=f"Error: {str(e)}")