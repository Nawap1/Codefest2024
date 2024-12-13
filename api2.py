from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from typing import Optional, Dict, List
from pydantic import BaseModel
from pipeline import DocumentExtractor  # Ensure this is correctly implemented
import redis
from dotenv import load_dotenv
import os
from redisvl.utils.vectorize import HFTextVectorizer
from redisvl.redis.utils import array_to_buffer
from tqdm.auto import tqdm
from contextlib import asynccontextmanager
from langchain.text_splitter import RecursiveCharacterTextSplitter
from redisvl.index import SearchIndex
from redisvl.query import VectorQuery
import aiohttp
from urllib.parse import urlparse
import json
from google import genai

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
os.environ["TOKENIZERS_PARALLELISM"] = "false"

index_name = "redisvl"

schema = {
    "index": {"name": index_name, "prefix": "chunk"},
    "fields": [
        {
            "name": "chunk_id",
            "type": "tag",
            "attrs": {"sortable": True},
        },
        {
            "name": "content",
            "type": "text",
        },
        {
            "name": "text_embedding",
            "type": "vector",
            "attrs": {
                "dims": 384,
                "distance_metric": "cosine",
                "algorithm": "hnsw",
                "datatype": "float32",
            },
        },
    ],
}

# Configure Google Generative AI
genai.configure(api_key=GOOGLE_API_KEY)

# Model configuration
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
    model_name=GOOGLE_API_KEY,
    generation_config=generation_config,
)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=2500, chunk_overlap=200)
hf = HFTextVectorizer("sentence-transformers/all-MiniLM-L6-v2")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global embeddings, hf, index, text_splitter

    # Startup
    r = redis.Redis(host="localhost", port=6379, db=0)
    index = SearchIndex.from_dict(schema)
    index.set_client(r)
    index.create(overwrite=True, drop=True)


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

@app.post("/extract-text/")
async def extract_text(
    file: Optional[UploadFile] = File(None), url: Optional[str] = Form(None)
):
    """
    Extract text from either an uploaded file or a URL.

    Args:
        file: Optional file upload
        url: Optional URL string

    Returns:
        TextExtractionResponse containing extracted text and metadata

    Raises:
        HTTPException: If neither file nor URL is provided or if extraction fails
    """
    if not file and not url:
        raise HTTPException(status_code=400, detail="Either file or url must be provided")

    if file and url:
        raise HTTPException(
            status_code=400, detail="Please provide either file or url, not both"
        )

    try:
        extractor = DocumentExtractor()

        if file:
            # Handle file upload
            os.makedirs("temp", exist_ok=True)
            file_location = f"temp/{file.filename}"

            try:
                with open(file_location, "wb") as f:
                    f.write(await file.read())

                extracted_text_dict = extractor.extract_content(file_location)
                extracted_text = extracted_text_dict['content']
                source_type = "file"

            finally:
                # Clean up temp file
                if os.path.exists(file_location):
                    os.remove(file_location)

        else:
            # Handle URL
            # Validate URL format
            try:
                result = urlparse(url)
                if not all([result.scheme, result.netloc]):
                    raise ValueError("Invalid URL format")
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid URL format")

            # Download and process URL content
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Failed to fetch URL: {url}",
                        )

            extracted_text_dict = extractor.extract_content(url)
            extracted_text = extracted_text_dict['content']
            source_type = "url"

        return TextExtractionResponse(
            message="Text extracted successfully",
            text=extracted_text,
            source_type=source_type,
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
async def generate_response(chat_history: List[Dict], query: str):
    results = retrieve_documents(query)
    context = "\n".join([result["content"] for result in results])

    # Start a new chat session for each request
    chat = model.start_chat(history=[])
    
    # Add context to the prompt
    prompt = f"Context: {context}\n\n"

    # Format the chat history and add to prompt
    for message in chat_history:
        if message['role'] == 'user':
            prompt += f"user: {message['content']}\n"
        elif message['role'] == 'bot':
            prompt += f"model: {message['content']}\n"

    # Add the current query
    prompt += f"user: {query}\n"

    # Generate response using the formatted prompt
    response = chat.send_message(prompt)
    
    return {"role": "model", "content": response.text}

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
        prompt = f"""
        Write Proper Notes based on the following context:
        {request.context}
        Notes Structure should be in hierarchical format like where every note has a heading.:
        # Title1
        Description
        # Title2
        - Point1
        - Point2
        """

        # Use the Google AI Gemini API
        response = model.generate_content(prompt)

        return NotesResponse(
            message="Notes generated successfully", text=response.text
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/QA")
async def generate_qa(content: str):
    try:
        prompt = f"""
        Please provide some Q&A based on the following content:
        {content}
        """

        response = model.generate_content(prompt)

        return {"message": "Q&A generated successfully", "content": response.text}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardList(BaseModel):
    flashcards: List[Flashcard]

@app.get("/flashcards", response_model=FlashcardList)
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
        prompt = f"""
        Create {count} flashcards from the following context:
        {content}

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

        # Use the Google AI Gemini API
        response = model.generate_content(prompt)

        # Assuming the model returns text in JSON format
        flashcards_json = json.loads(response.text)
        return flashcards_json

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str

class Quiz(BaseModel):
    questions: List[QuizQuestion]

@app.get("/quiz", response_model=Quiz)
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
        prompt = f"""
        Create a {num_questions}-question quiz from the following context:
        {content}

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

        # Use the Google AI Gemini API
        response = model.generate_content(prompt)

        # Assuming the model returns text in JSON format
        quiz_json = json.loads(response.text)
        return quiz_json

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))