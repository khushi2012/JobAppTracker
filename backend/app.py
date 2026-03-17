from fastapi import FastAPI
from pydantic import BaseModel
from ai.extractor import extract_job, is_job_page

app = FastAPI()

class JobRequest(BaseModel):
    text: str
    url: str


@app.post("/extract-job")
def extract(request: JobRequest):

    print("Checking if job page...")

    if not is_job_page(request.text):
        print("Not a job page ❌")
        return {"error": "Not a job page"}

    print("Job page detected ✅")

    job = extract_job(request.text)

    print("AI RESULT:", job)

    return job