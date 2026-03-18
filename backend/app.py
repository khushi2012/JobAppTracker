from fastapi import FastAPI
from pydantic import BaseModel
from ai.extractor import extract_job, is_job_page

#init db 
from db import SessionLocal, engine
from models.jobs import Job 

Job.metadata.create_all(bind=engine)
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobRequest(BaseModel):
    text: str
    url: str


@app.post("/extract-job")
def extract(request: JobRequest):

    try:
        print("Request received")

        if not is_job_page(request.text):
            print("Not job page")
            return {"error": "Not a job page"}

        job = extract_job(request.text)

        print("AI RESULT:", job)

        db = SessionLocal()

        new_job = Job(
            title=job["title"],
            company=job["company"],
            location=job["location"],
            status="Applied",
            url=request.url
        )

        db.add(new_job)
        db.commit()

        print("Saved to DB")

        db.close()

        return job

    except Exception as e:
        print("🔥 BACKEND ERROR:", e)
        return {"error": "backend failed"}
@app.get("/jobs")
def get_jobs():
    db = SessionLocal()
    jobs = db.query(Job).all()

    result = []
    for job in jobs:
        result.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "url": job.url,
            "status": job.status
        })

    db.close()
    return result
from fastapi import HTTPException

@app.put("/jobs/{job_id}")
def update_job_status(job_id: int, status: str):
    db = SessionLocal()

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        db.close()
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = status
    db.commit()

    db.close()

    return {"message": "updated"}
@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    db = SessionLocal()

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        return {"error": "Job not found"}

    db.delete(job)
    db.commit()
    db.close()

    return {"message": "Job deleted"}