"""JWT authentication utilities."""

from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from app.config import settings

security = HTTPBearer()


def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Verify JWT token and return user_id.

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        user_id extracted from token

    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )

        return user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
