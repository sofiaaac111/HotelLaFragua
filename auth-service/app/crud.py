from sqlalchemy.orm import Session
from .models import Usuario
from .security import hash_password, verify_password

def crear_usuario(db, usuario):
    nuevo = Usuario(
        correo=usuario.correo,
        password=hash_password(usuario.password),
        rol=usuario.rol
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_usuario_por_correo(db: Session, correo: str):
    return db.query(Usuario).filter(Usuario.correo == correo).first()

def autenticar_usuario(db: Session, correo: str, password: str):
    usuario = obtener_usuario_por_correo(db, correo)
    if not usuario:
        return None
    if not verify_password(password, usuario.password):
        return None
    return usuario
