from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas
from ..security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

print("REGISTER EJECUTADO")
@router.post("/register")
def register(usuario: schemas.UsuarioCreate, db=Depends(get_db)):
    nuevo = crud.crear_usuario(db, usuario)
    return {
        "id": nuevo.id,
        "correo": nuevo.correo,
        "rol": nuevo.rol
    }


@router.post("/login")
def login(datos: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = crud.autenticar_usuario(db, datos.correo, datos.password)

    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = create_access_token({
    "id": usuario.id,
    "correo": usuario.correo,
    "rol": usuario.rol
})

    return {"access_token": token, "token_type": "bearer"}
