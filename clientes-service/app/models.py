from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from .database import Base
from datetime import datetime

class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    tipo_documento = Column(String(20))
    numero_documento = Column(String(50))
    correo = Column(String(150))
    telefono = Column(String(20))
    fecha_registro = Column(TIMESTAMP, default=datetime.utcnow)