from sqlalchemy import Column, Integer, String, DECIMAL, Enum, TIMESTAMP, func, JSON
from .database import Base

class Habitacion(Base):
    __tablename__ = "habitaciones"

    numero_habitacion = Column(Integer, primary_key=True, index=True)
    tipo_habitacion = Column(Enum('Individual', 'Doble', 'Familiar', 'Suite', name='tipo_habitacion_enum'), nullable=False)
    descripcion = Column(String(255))
    ocupacion = Column(Integer, nullable=False)
    numero_camas = Column(Integer, nullable=False)
    precio_base = Column(DECIMAL(10,2), nullable=False)
    estado = Column(Enum('Libre', 'Ocupada', 'Limpieza', 'Mantenimiento', name='estado_enum'), nullable=False, default='Libre')
    comodidades = Column(JSON, nullable=True)  # Array de comodidades
    foto = Column(String(500), nullable=True)  # URL o base64 de la foto


class OcupacionHabitacion(Base):
    __tablename__ = "ocupacion_habitaciones"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    numero_habitacion = Column(Integer, nullable=False)
    identificacion_cliente = Column(Integer, nullable=False)
    estado = Column(Enum('OCUPADA', 'FINALIZADA', name='estado_ocupacion_enum'), nullable=False, default='OCUPADA')
    fecha_inicio = Column(TIMESTAMP, nullable=False, default=func.now())
    fecha_fin = Column(TIMESTAMP, nullable=True)
