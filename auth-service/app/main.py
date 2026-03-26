from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .database import engine, Base
from .routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en desarrollo usamos *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Auth Service activo"}
