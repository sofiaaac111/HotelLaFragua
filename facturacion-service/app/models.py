from sqlalchemy import Column, Integer, Float, String, Date
from .database import Base
from datetime import date

class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True, index=True)
    reserva_id = Column(Integer)
    cliente_id = Column(Integer)
    fecha = Column(Date, default=date.today)
    subtotal = Column(Float)
    impuestos = Column(Float)
    total = Column(Float)
    metodo_pago = Column(String(50))
    estado = Column(String(20), default="pendiente")
