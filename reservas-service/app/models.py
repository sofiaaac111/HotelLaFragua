from .database import Base
from sqlalchemy import Column, Integer, Date, String

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    habitacion_id = Column(Integer, nullable=False)
    cliente_id = Column(Integer, nullable=False)

    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    total = Column(Integer, nullable=True)

    estado = Column(String(20), default="activa")
