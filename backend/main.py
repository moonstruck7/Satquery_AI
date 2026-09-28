from fastapi import FastAPI, UploadFile, File, Form
from typing import List
import shutil
import os
import uuid

from agent import answer_query

app = FastAPI(title="SatQuery AI")

os.makedirs("uploads", exist_ok=True)

@app.post("/query")
async def query(
    question: str = Form(...),
    images: List[UploadFile] = File(...)
):
    saved_paths = []
    for img in images:
        ext = os.path.splitext(img.filename)[1]
        temp_path = f"uploads/{uuid.uuid4().hex}{ext}"
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(img.file, f)
        saved_paths.append(temp_path)

    result = answer_query(saved_paths, question)
    return result

@app.get("/")
def root():
    return {"status": "SatQuery AI backend running"}