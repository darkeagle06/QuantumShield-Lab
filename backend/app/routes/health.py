"""Health check endpoint."""
from datetime import datetime, timezone
import sys
from fastapi import APIRouter
from ..schemas.crypto_schemas import HealthResponse
from ..crypto.engine import is_liboqs_available

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Returns the operational status and environment diagnostics of the QuantumShield Lab backend."""
    return HealthResponse(
        status="ok",
        service="QuantumShield Lab API",
        version="1.0.0",
        python_version=sys.version.split()[0],
        liboqs_native=is_liboqs_available(),
        timestamp=datetime.now(timezone.utc).isoformat()
    )
