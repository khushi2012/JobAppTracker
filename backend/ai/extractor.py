#extract structured data to get job info LLM returns clean JSON 
import google.generativeai as genai  # type: ignore
from config import GEMINI_API_KEY
import json

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

def extract_job(text: str):

    prompt = f"""
    Extract:
    - job title
    - company
    - location

    Return ONLY JSON like:
    {{
      "title": "",
      "company": "",
      "location": ""
    }}

    Job Posting:
    {text[:4000]}
    """

    response = model.generate_content(prompt)

    content = response.text.strip()

    # cleaning markdown if gemini adds
    cleaned = content.replace("```json", "").replace("```", "").strip()

    return json.loads(cleaned)