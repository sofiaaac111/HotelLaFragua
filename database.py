import os
from dotenv import load_dotenv
from pathlib import Path
import mysql.connector

# cargar .env global (sube un nivel desde cualquier microservicio)
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )