"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import create_db_and_tables
from app.routers import tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup: create database tables
    create_db_and_tables()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Todo API",
    description="API for Todo application - Hackathon II Phase II",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router)


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Todo API - Hackathon II", "phase": 2}


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}
