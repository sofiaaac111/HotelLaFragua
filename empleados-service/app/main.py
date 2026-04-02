from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .database import engine, Base
from .routers import empleados

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Empleados Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en desarrollo usamos *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI(title="Empleados Service")

app.include_router(empleados.router)

@app.get("/")
def root():
    return {"message": "Empleados Service activo"}
