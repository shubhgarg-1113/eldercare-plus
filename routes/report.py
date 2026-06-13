from fastapi import APIRouter, UploadFile, File
from models.schemas import ReportResponse
import google.generativeai as genai
import os
import base64

router = APIRouter(prefix="/api/report", tags=["report"])

REPORT_PROMPT = """You are a medical report explainer for patients with no medical background.
Look at this report image. For each value you can identify:
- State the value name
- Whether it is normal or needs attention
- One sentence plain language explanation, no jargon.
Format exactly as: VALUE_NAME | STATUS_EMOJI | EXPLANATION
Use ✅ for normal and 🔴 for needs attention.
One per line."""

@router.post("/analyze", response_model=ReportResponse)
async def analyze_report(file: UploadFile = File(...)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return ReportResponse(analysis="Gemini API Key not configured.", lines=[])

    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode("utf-8")
        mime_type = file.content_type or "image/jpeg"

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content([
            REPORT_PROMPT,
            {
                "mime_type": mime_type,
                "data": base64_image
            }
        ])

        analysis_text = response.text
        lines = [line.strip() for line in analysis_text.strip().split("\n") if "|" in line]

        return ReportResponse(analysis=analysis_text, lines=lines)

    except Exception as e:
        return ReportResponse(analysis="Unable to analyze report right now.", lines=[])