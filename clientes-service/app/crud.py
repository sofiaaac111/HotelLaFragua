from sqlalchemy.orm import Session
from . import models, schemas

def get_cliente_por_documento(db: Session, numero_documento: str):
    return db.query(models.Cliente).filter(models.Cliente.numero_documento == numero_documento).first()

def get_clientes(db: Session):
    return db.query(models.Cliente).all()

def crear_cliente(db: Session, cliente: schemas.ClienteCreate):
    
    # 🔍 Validar si ya existe
    existente = db.query(models.Cliente).filter(
        models.Cliente.numero_documento == cliente.numero_documento
    ).first()

    if existente:
        return None  # o lanzar error

    nuevo = models.Cliente(
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        tipo_documento=cliente.tipo_documento,
        numero_documento=cliente.numero_documento,
        correo=cliente.correo,
        telefono=cliente.telefono
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def update_cliente(db: Session, cliente_id: int, cliente_update: schemas.ClienteUpdate):
    cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if not cliente:
        return None

    update_data = cliente_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cliente, key, value)

    db.commit()
    db.refresh(cliente)
    return cliente

def delete_cliente(db: Session, cliente_id: int):
    cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if cliente:
        db.delete(cliente)
        db.commit()
    return cliente