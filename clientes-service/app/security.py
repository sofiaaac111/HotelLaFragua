from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.requests import Request

# DEBE SER IDÉNTICO al de auth-service
SECRET_KEY = "hotel_lafragua_123"
ALGORITHM = "HS256"

# Configurar HTTPBearer para Swagger UI
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Valida el token JWT usando HTTPBearer.
    Se usa como dependencia en los endpoints protegidos.

    Uso:
        @router.get("/ruta")
        def mi_endpoint(current_user = Depends(verify_token)):
            return {"user": current_user}
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
