import os
from pathlib import Path
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from .models import Factura

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SERVICE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(SERVICE_DIR / ".env")

RESERVAS_SERVICE_URL = os.getenv("RESERVAS_SERVICE_URL", "http://localhost:8083")

def crear_factura(db: Session, factura):
    nueva = Factura(
        reserva_id=factura.reserva_id,
        cliente_id=factura.cliente_id,
        subtotal=factura.subtotal,
        impuestos=factura.impuestos,
        total=factura.total,
        metodo_pago=factura.metodo_pago,
        estado=factura.estado
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def listar_facturas(db: Session):
    return db.query(Factura).all()


def obtener_factura(db: Session, id: int):
    return db.query(Factura).filter(Factura.id == id).first()


def facturas_por_cliente(db: Session, cliente_id: int):
    return db.query(Factura).filter(Factura.cliente_id == cliente_id).all()
