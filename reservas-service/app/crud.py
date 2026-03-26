from sqlalchemy.orm import Session
from .models import Reserva
import requests

HABITACIONES_SERVICE_URL = "http://localhost:8082"

def verificar_habitacion(habitacion_id: int):
    response = requests.get(f"{HABITACIONES_SERVICE_URL}/habitaciones/{habitacion_id}")
    if response.status_code != 200:
        return None
    return response.json()


from sqlalchemy.orm import Session
from .models import Reserva
import requests
from fastapi import HTTPException

HABITACIONES_SERVICE_URL = "http://localhost:8082"

def crear_reserva(db: Session, reserva):
    url = f"{HABITACIONES_SERVICE_URL}/habitaciones/{reserva.habitacion_id}"

    # 1️⃣ Verificar que la habitación exista
    try:
        response = requests.get(url, timeout=5)
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=503, detail="Servicio de habitaciones no disponible")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="La habitación no existe")

    habitacion = response.json()

    # 2️⃣ Verificar disponibilidad
    if habitacion["estado"] != "disponible":
        raise HTTPException(status_code=400, detail="La habitación no está disponible")

    # 3️⃣ Validar fechas
    dias = (reserva.fecha_fin - reserva.fecha_inicio).days
    if dias <= 0:
        raise HTTPException(status_code=400, detail="Las fechas no son válidas")

    # 4️⃣ Calcular total
    total = dias * habitacion["precio"]

    # 5️⃣ Crear reserva
    nueva_reserva = Reserva(
        habitacion_id=reserva.habitacion_id,
        cliente_id=reserva.cliente_id,
        fecha_inicio=reserva.fecha_inicio,
        fecha_fin=reserva.fecha_fin,
        total=total,
        estado="activa"
    )

    db.add(nueva_reserva)
    db.commit()
    db.refresh(nueva_reserva)

    # 6️⃣ Cambiar estado de la habitación a OCUPADA
    try:
        response_estado = requests.put(
            f"{HABITACIONES_SERVICE_URL}/habitaciones/{reserva.habitacion_id}/estado",
            json={"estado": "ocupada"},
            timeout=5
        )
    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Reserva creada, pero no se pudo actualizar el estado de la habitación"
        )

    if response_estado.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Reserva creada, pero ocurrió un error al actualizar el estado de la habitación"
        )

    return nueva_reserva

def listar_reservas(db: Session):
    return db.query(Reserva).all()

def actualizar_reservas_vencidas():
    db = SessionLocal()

    reservas = db.query(Reserva).filter(
        Reserva.fecha_fin < date.today(),
        Reserva.estado == "activa"
    ).all()

    for reserva in reservas:
        reserva.estado = "finalizada"

        # liberar habitación
        requests.put(
            f"{HABITACIONES_SERVICE_URL}/habitaciones/{reserva.habitacion_id}/estado",
            json={"estado": "disponible"}
        )

    db.commit()
    db.close()
