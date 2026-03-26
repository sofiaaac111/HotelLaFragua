from sqlalchemy import Column, Integer, String, DECIMAL, Enum, TIMESTAMP, func
from .database import Base

class Habitacion(Base):
    __tablename__ = "habitaciones"

    numero_habitacion = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(255))
    ocupacion = Column(Integer, nullable=False)
    tipo_camas = Column(Enum('SENCILLA', 'SEMIDOBLE', 'DOBLE', 'QUEEN', 'KING', name='tipo_camas_enum'), nullable=False)
    precio_base = Column(DECIMAL(10,2), nullable=False)
    estado = Column(Enum('LIBRE', 'OCUPADA', 'MANTENIMIENTO', name='estado_enum'), nullable=False, default='LIBRE')


class OcupacionHabitacion(Base):
    __tablename__ = "ocupacion_habitaciones"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    numero_habitacion = Column(Integer, nullable=False)
    identificacion_cliente = Column(Integer, nullable=False)
    estado = Column(Enum('OCUPADA', 'FINALIZADA', name='estado_ocupacion_enum'), nullable=False, default='OCUPADA')
    fecha_inicio = Column(TIMESTAMP, nullable=False, default=func.now())
    fecha_fin = Column(TIMESTAMP, nullable=True)
