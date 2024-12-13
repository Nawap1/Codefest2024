from fastapi import FastAPI, HTTPException
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

@app.get("/extract")
async def extract_text(url: str):
    try:
        return {"message": "Text extracted successfully", "url": url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/generate_notes")
async def generate_notes(text: str):
    try:
        return {"message": "Notes generated successfully", "text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/dub")
async def create_dub(video_url: str, target_language: str):
    try:
        return {
            "message": "Video dubbed successfully",
            "video_url": video_url,
            "language": target_language
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/QA")
async def generate_qa(content: str):
    try:
        return {"message": "Q&A generated successfully", "content": content}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/flashcards")
async def create_flashcards(content: str, count: Optional[int] = 10):
    try:
        return {
            "message": "Flashcards created successfully",
            "content": content,
            "count": count
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/quiz")
async def generate_quiz(content: str, num_questions: Optional[int] = 5):
    try:
        return {
            "message": "Quiz generated successfully",
            "content": content,
            "questions": num_questions
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

