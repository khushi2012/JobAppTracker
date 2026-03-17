from fastapi import FastAPI
from pydantic import BaseModel
from ai.extractor import extract_job

app = FastAPI()

class JobRequest(BaseModel):
    text: str
    url: str


@app.post("/extract-job")
def extract_job(request: JobRequest):

    print("Received job page from extension")

    # temporary fake data
    return {
        "title": "Test Job",
        "company": "Test Company",
        "location": "Test Location"
    }