"""Routes package."""
from .health import router as health_router
from .crypto import router as crypto_router
from .math_lab import router as math_router
from .benchmarks import router as benchmarks_router
from .experiments import router as experiments_router

__all__ = ["health_router", "crypto_router", "math_router", "benchmarks_router", "experiments_router"]
