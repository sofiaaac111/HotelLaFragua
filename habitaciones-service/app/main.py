from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from . import models
from .database import engine
from .routers import habitaciones

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habitaciones Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en desarrollo usamos *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habitaciones.router)

@app.get("/")
def root():
    return {"status": "Habitaciones microservice funcionando correctamente"}
