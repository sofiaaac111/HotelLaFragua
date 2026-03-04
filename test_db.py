from core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT @@hostname"))
    print(result.fetchone())