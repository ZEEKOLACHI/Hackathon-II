"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import create_db_and_tables
from app.routers import tasks, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup: create database tables
    create_db_and_tables()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Todo API",
    description="API for Todo application - Hackathon II Phase III with AI",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS middleware - allow all localhost ports for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers - AI router first to ensure specific routes match before /{task_id}
app.include_router(ai.router)
app.include_router(tasks.router)


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Todo API - Hackathon II", "phase": 3}


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}
