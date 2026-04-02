from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.security import HTTPBearer
from . import models
from .database import engine
from .routers import habitaciones

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Habitaciones Service"
)

# Configurar seguridad para Swagger
security = HTTPBearer()

# Configurar esquema de seguridad para Swagger
app.openapi_components = {
    "securitySchemes": {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
}

# Aplicar seguridad global a todos los endpoints
app.openapi_security = [{"BearerAuth": []}]

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
