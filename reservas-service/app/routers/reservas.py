from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas
from ..security import get_current_user


router = APIRouter(
    prefix="/reservas",
    tags=["Reservas"]
)

@router.get("/")
def listar_reservas(db: Session = Depends(get_db)):
    return crud.listar_reservas(db)


@router.post("/")
def crear_reserva(reserva: schemas.ReservaCreate,
                  user=Depends(get_current_user),
                  db=Depends(get_db)):

    nueva = crud.crear_reserva(db, reserva, user["id"])
    return nueva