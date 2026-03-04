from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import SessionLocal, engine
from app.routers import habitaciones

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"status": "Habitaciones microservice funcionando correctamente"}

# Listar todas
@app.get("/habitaciones", response_model=list[schemas.Habitacion])
def listar_habitaciones(db: Session = Depends(get_db)):
    return crud.get_habitaciones(db)

# Obtener una
@app.get("/habitaciones/{id}", response_model=schemas.Habitacion)
def obtener_habitacion(id: int, db: Session = Depends(get_db)):
    hab = crud.get_habitacion(db, id)
    if not hab:
        raise HTTPException(404, "Habitación no encontrada")
    return hab

# Crear
@app.post("/habitaciones", response_model=schemas.Habitacion)
def crear_habitacion(habitacion: schemas.HabitacionCreate, db: Session = Depends(get_db)):
    return crud.create_habitacion(db, habitacion)

# Actualizar
@app.put("/habitaciones/{id}", response_model=schemas.Habitacion)
def actualizar_habitacion(id: int, datos: schemas.HabitacionUpdate, db: Session = Depends(get_db)):
    hab = crud.update_habitacion(db, id, datos)
    if not hab:
        raise HTTPException(404, "Habitación no encontrada")
    return hab

# Eliminar
@app.delete("/habitaciones/{id}")
def eliminar_habitacion(id: int, db: Session = Depends(get_db)):
    hab = crud.delete_habitacion(db, id)
    if not hab:
        raise HTTPException(404, "Habitación no encontrada")
    return {"mensaje": "Habitación eliminada"}

app.include_router(habitaciones.router, prefix="/habitaciones", tags=["Habitaciones"])
