import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from core.database import engine, SessionLocal, Base, get_db
