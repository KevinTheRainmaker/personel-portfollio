import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm_chat.context_builder import build_system_prompt
from llm_chat.openrouter_client import chat_with_fallback

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.environ.get("OPENROUTER_API_KEY"):
        raise RuntimeError("OPENROUTER_API_KEY environment variable is not set")
    yield


app = FastAPI(
    title="Kangbeen Ko Portfolio Chat API",
    version="2.0.0",
    lifespan=lifespan,
)

_allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://portfolio.kangbeen.my",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

_system_prompt = build_system_prompt()


class Message(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []


class ChatResponse(BaseModel):
    response: str
    model_used: str


@app.get("/")
async def root():
    return {"service": "Kangbeen Ko Portfolio Chat API", "version": "2.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    messages = [{"role": "system", "content": _system_prompt}]

    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": request.message})

    try:
        response_text, model_used = await chat_with_fallback(messages)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Chat service unavailable: {e}")

    return ChatResponse(response=response_text, model_used=model_used)
