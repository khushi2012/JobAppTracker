import google.generativeai as genai
import json
from config import GEMINI_API_KEY

# configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# create model
model = genai.GenerativeModel("gemini-2.5-flash")


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

    response = model.generate_content(prompt)

    content = response.text.strip()

    # remove markdown if Gemini adds it
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except:
        print("JSON PARSE ERROR:", content)
        return {
            "title": "Unknown",
            "company": "Unknown",
            "location": "Unknown"
        }
        
def is_job_page(text: str):

    prompt = f"""
    You are a classifier.

    Determine if the following page content is a job posting.

    Return ONLY JSON:
    {{
      "is_job": true
    }}
    or
    {{
      "is_job": false
    }}

    Page Content:
    {text[:3000]}
    """

    response = model.generate_content(prompt)

    content = response.text.strip()
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(content)
        return result.get("is_job", False)
    except:
        print("DETECTION ERROR:", content)
        return False