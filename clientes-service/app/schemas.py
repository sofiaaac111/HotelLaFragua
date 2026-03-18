from pydantic import BaseModel
from typing import Optional

class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    correo: Optional[str] = None
    telefono: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    correo: Optional[str] = None
    telefono: Optional[str] = None

class Cliente(ClienteBase):
    id_cliente: int

    class Config:
        from_attributes = True