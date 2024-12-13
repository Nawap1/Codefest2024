from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from typing import Optional, Dict, List
from pydantic import BaseModel
from pipeline import DocumentExtractor
import redis
from huggingface_hub import AsyncInferenceClient
from chatbot import ChatBot
from dotenv import load_dotenv
import os
from redisvl.utils.vectorize import HFTextVectorizer
from redisvl.redis.utils import array_to_buffer
import pandas as pd
from tqdm.auto import tqdm
from contextlib import asynccontextmanager
from langchain.text_splitter import RecursiveCharacterTextSplitter
from redisvl.index import SearchIndex
from redisvl.query import VectorQuery
import aiohttp
from urllib.parse import urlparse
import json

load_dotenv()
api_token = os.getenv("HUGGINGFACE_API_TOKEN")
os.environ["TOKENIZERS_PARALLELISM"] = "false"

index_name = "redisvl"

schema = {
    "index": {
        "name": index_name,
        "prefix": "chunk"
    },
    "fields": [
        {
            "name": "chunk_id",
            "type": "tag",
            "attrs": {
                "sortable": True
            }
        },
        {
            "name": "content",
            "type": "text"
        },
        {
            "name": "text_embedding",
            "type": "vector",
            "attrs": {
                "dims": 384,
                "distance_metric": "cosine",
                "algorithm": "hnsw",
                "datatype": "float32"
            }
        }
    ]
}
text_splitter = RecursiveCharacterTextSplitter(chunk_size=2500, chunk_overlap=200)
client = AsyncInferenceClient(api_key=api_token)
model1 = "Qwen/Qwen2.5-72B-Instruct"
hf = HFTextVectorizer("sentence-transformers/all-MiniLM-L6-v2")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, embeddings, hf, index, text_splitter, client, model1

    # Startup
    
    r = redis.Redis(host="localhost", port=6379, db=0)
    index = SearchIndex.from_dict(schema)
    index.set_client(r)
    index.create(overwrite=True, drop=True)
    # model = ChatBot(api_token=api_token)


    yield
    r.flushdb()

app = FastAPI(lifespan=lifespan)

class DocumentInput(BaseModel):
    content: str
    metadata: Optional[Dict] = None

class TextExtractionResponse(BaseModel):
    message: str
    text: str
    source_type: str

@app.post("/extract-text/", response_model=TextExtractionResponse)
async def extract_text(
    file: Optional[UploadFile] = File(None), 
    url: Optional[str] = Form(None)
):
    if not file and not url:
        raise HTTPException(status_code=400, detail="Either file or url must be provided")

    try:
        extractor = DocumentExtractor()
        
        if file:
            content = await file.read()
            with open(f"temp/{file.filename}", "wb") as f:
                f.write(content)
                
            extracted = extractor.extract_content(f"temp/{file.filename}")
            text = extracted['content'] if isinstance(extracted['content'], str) else str(extracted['content'])
            
            return TextExtractionResponse(
                message="Text extracted successfully",
                text=text,
                source_type=file.content_type or "file"
            )
            
        else:
            extracted = extractor.extract_content(url)
            text = extracted['content'] if isinstance(extracted['content'], str) else str(extracted['content'])
            
            return TextExtractionResponse(
                message="Text extracted successfully",
                text=text,
                source_type="url"
            )
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if file and os.path.exists(f"temp/{file.filename}"):
            os.remove(f"temp/{file.filename}")
            
class VectorizeRequest(BaseModel):
    text: str

@app.post("/vectorize")
async def vectorize_text(request: VectorizeRequest):
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2500, chunk_overlap=200)
        chunks = text_splitter.create_documents([request.text])
        embeddings = hf.embed_many([chunk.page_content for chunk in chunks])

        data = [
            {
                "chunk_id": i,
                "content": chunk.page_content,
                "text_embedding": array_to_buffer(embeddings[i], dtype="float32"),
            }
            for i, chunk in enumerate(chunks)
        ]

        keys = index.load(data, id_field="chunk_id")
        return {"message": "Text vectorized successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def retrieve_documents(query: str) -> list:
    query_embedding = hf.embed(query)

    vector_query = VectorQuery(
        vector=query_embedding,
        vector_field_name="text_embedding",
        num_results=3,
        return_fields=["content"],
        return_score=True,
    )

    # Execute query
    results = index.query(vector_query)
    return results

@app.post("/chat")
def generate_response(chat_history, query):
    results = retrieve_documents(query)
    context = "\n".join([result["content"] for result in results])
    chat_history.append({"role": "user", "content": query})
    response = model.generate_response(context, chat_history)
    return {"role": "bot", "content": response}

class NotesRequest(BaseModel):
    context: str

class NotesResponse(BaseModel):
    message: str
    text: str

@app.post("/generate_notes", response_model=NotesResponse)
async def generate_notes(request: NotesRequest):
    """
    Generate notes from provided context using AI.

    Args:
        request: NotesRequest containing the context

    Returns:
        NotesResponse with generated notes
    """
    try:
        system = "You are a helpful AI assistant that provides proper Notes based on the given context."
        prompt = """
        Write Proper Notes based on the following context:
        {context}
        Notes Structure should be in hierarchical format like where every note has a heading.:
        # Title1
        Description
        # Title2
        - Point1
        - Point2
        """

        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": f"Context: {request.context}"},
        ]

        response = await client.chat.completions.create(
            model=model1, messages=messages, temperature=0.7, max_tokens=1024, top_p=0.9
        )

        return NotesResponse(
            message="Notes generated successfully", text=response.choices[0].message.content
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardList(BaseModel):
    flashcards: List[Flashcard]

@app.post("/flashcards", response_model=FlashcardList)
async def create_flashcards(content: str, count: Optional[int] = 10):
    """
    Generate flashcards from provided context using AI.

    Args:
        content: The context to generate flashcards from.
        count: The desired number of flashcards.

    Returns:
        A list of flashcards in JSON format.
    """
    try:
        system = "You are a helpful AI assistant that generates flashcards based on the given context."
        prompt = f"""
        Create {count} flashcards from the following context:
        {{context}}
        
        Each flashcard should have a 'front' (question or term) and a 'back' (answer or definition).
        Provide the flashcards in JSON format like this:
        {{
            "flashcards": [
                {{
                    "front": "Question or term 1",
                    "back": "Answer or definition 1"
                }},
                {{
                    "front": "Question or term 2",
                    "back": "Answer or definition 2"
                }}
            ]
        }}
        """

        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt.format(context=content)},
        ]

        response = await client.chat.completions.create(
            model=model1, messages=messages, temperature=0.7, max_tokens=1024, top_p=0.9
        )
        # Load the response content as a JSON object
        flashcards_json = json.loads(response.choices[0].message.content)

        return flashcards_json

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str

class Quiz(BaseModel):
    questions: List[QuizQuestion]

@app.post("/quiz", response_model=Quiz)
async def generate_quiz(content: str, num_questions: Optional[int] = 5):
    """
    Generate a quiz from provided context using AI.

    Args:
        content: The context to generate the quiz from.
        num_questions: The desired number of quiz questions.

    Returns:
        A quiz in JSON format.
    """
    try:
        system = "You are a helpful AI assistant that generates quiz questions based on the given context."
        prompt = f"""
        Create a {num_questions}-question quiz from the following context:
        {{context}}

        Each question should have multiple-choice options and a correct answer.
        Provide the quiz in JSON format like this:
        {{
            "questions": [
                {{
                    "question": "Question 1",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option B"
                }},
                {{
                    "question": "Question 2",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option C"
                }}
            ]
        }}
        """

        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt.format(context=content)},
        ]

        response = await client.chat.completions.create(
            model=model1, messages=messages, temperature=0.7, max_tokens=1024, top_p=0.9
        )

        # Load the response content as a JSON object
        quiz_json = json.loads(response.choices[0].message.content)

        return quiz_json

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))