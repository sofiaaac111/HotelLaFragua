from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .database import engine, Base
from apscheduler.schedulers.background import BackgroundScheduler
from .routers import reservas
from .crud import actualizar_reservas_vencidas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reservas Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en desarrollo usamos *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
scheduler = BackgroundScheduler()
scheduler.add_job(actualizar_reservas_vencidas, "interval", minutes=30)
scheduler.start()
app.include_router(reservas.router)

@app.get("/")
def root():
    return {"message": "Reservas Service activo"}
