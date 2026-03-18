#specifies schemas 
from sqlalchemy import Column, Integer, String # type: ignore
from db import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    location = Column(String)
    status = Column(String)
    url = Column(String)