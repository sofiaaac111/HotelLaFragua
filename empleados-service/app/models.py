from sqlalchemy import Column, Integer, String
from .database import Base

class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    cargo = Column(String(100))
    correo = Column(String(100), unique=True)
    telefono = Column(String(20))
    estado = Column(String(20), default="activo")
