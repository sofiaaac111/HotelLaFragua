from pydantic import BaseModel, field_validator
from typing import Literal, Optional
from datetime import datetime


# -----------------------------
# Base: Campos generales
# -----------------------------
class HabitacionBase(BaseModel):
    numero_habitacion: int
    descripcion: Optional[str] = None
    ocupacion: int
    tipo_camas: Literal["SENCILLA", "SEMIDOBLE", "DOBLE", "QUEEN", "KING"]
    precio_base: float
    estado: Literal["LIBRE", "OCUPADA", "MANTENIMIENTO"]

    # Validación: Precio positivo
    @field_validator("precio_base")
    def precio_no_negativo(cls, v):
        if v < 0:
            raise ValueError("El precio base no puede ser negativo")
        return v

    # Validación: Ocupación positiva
    @field_validator("ocupacion")
    def ocupacion_positiva(cls, v):
        if v <= 0:
            raise ValueError("La ocupación debe ser mayor a 0")
        return v


# -----------------------------
# Crear habitación
# -----------------------------
class HabitacionCreate(BaseModel):
    numero_habitacion: int
    descripcion: Optional[str] = None
    ocupacion: int
    tipo_camas: Literal["SENCILLA", "SEMIDOBLE", "DOBLE", "QUEEN", "KING"]
    precio_base: float
    estado: Optional[Literal["LIBRE", "OCUPADA", "MANTENIMIENTO"]] = "LIBRE"

    @field_validator("precio_base")
    def precio_no_negativo(cls, v):
        if v < 0:
            raise ValueError("El precio base no puede ser negativo")
        return v

    @field_validator("ocupacion")
    def ocupacion_positiva(cls, v):
        if v <= 0:
            raise ValueError("La ocupación debe ser mayor a 0")
        return v


# -----------------------------
# Actualizar habitación
# -----------------------------
class HabitacionUpdate(BaseModel):
    descripcion: Optional[str] = None
    ocupacion: Optional[int] = None
    tipo_camas: Optional[Literal["SENCILLA", "SEMIDOBLE", "DOBLE", "QUEEN", "KING"]] = None
    precio_base: Optional[float] = None
    estado: Optional[Literal["LIBRE", "OCUPADA", "MANTENIMIENTO"]] = None

    @field_validator("precio_base")
    def precio_no_negativo(cls, v):
        if v is not None and v < 0:
            raise ValueError("El precio base no puede ser negativo")
        return v

    @field_validator("ocupacion")
    def ocupacion_positiva(cls, v):
        if v is not None and v <= 0:
            raise ValueError("La ocupación debe ser mayor a 0")
        return v


# -----------------------------
# Respuesta al cliente
# -----------------------------
class Habitacion(HabitacionBase):
    model_config = {"from_attributes": True}


# -----------------------------
# Ocupacion de habitacion
# -----------------------------
class OcupacionHabitacionBase(BaseModel):
    numero_habitacion: int
    identificacion_cliente: int
    estado: Literal["OCUPADA", "FINALIZADA"] = "OCUPADA"
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None


class OcupacionHabitacionCreate(OcupacionHabitacionBase):
    pass


class OcupacionHabitacionUpdate(BaseModel):
    estado: Optional[Literal["OCUPADA", "FINALIZADA"]] = None
    fecha_fin: Optional[datetime] = None


class OcupacionHabitacion(OcupacionHabitacionBase):
    id: int

    model_config = {"from_attributes": True}
