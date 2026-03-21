from google import genai
import json
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_job(text: str):
    prompt = f"""
    Extract:
    - job title
    - company
    - location

    Return ONLY valid JSON like this:

    {{
      "title": "",
      "company": "",
      "location": ""
    }}

    Job Posting:
    {text[:4000]}
    """

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=prompt
    )

    content = (response.text or "").strip()
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except Exception:
        return {
            "title": "Unknown",
            "company": "Unknown",
            "location": "Unknown"
        }

def is_job_page(text: str):
    prompt = f"""
    Determine if this is a job posting.

    Return ONLY JSON:
    {{ "is_job": true }} or {{ "is_job": false }}

    Content:
    {text[:3000]}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    content = (response.text or "").strip()
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(content)
        return result.get("is_job", False)
    except Exception:
        return False