"""QuantumShield Lab Backend Application.
Discrete Mathematics and Post-Quantum Cryptography educational research API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.health import router as health_router
from .routes.crypto import router as crypto_router
from .routes.math_lab import router as math_router
from .routes.benchmarks import router as benchmarks_router
from .routes.experiments import router as experiments_router

app = FastAPI(
    title="QuantumShield Lab API",
    description="Educational laboratory API for Discrete Mathematics and NIST Post-Quantum Cryptography (FIPS 203, 204, 205).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Local Development CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes with /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(crypto_router, prefix="/api")
app.include_router(math_router, prefix="/api")
app.include_router(benchmarks_router, prefix="/api")
app.include_router(experiments_router, prefix="/api")


@app.get("/")
def root():
    return {
        "project": "QuantumShield Lab",
        "description": "Discrete Mathematics Approach to Post-Quantum Cryptography",
        "docs": "/docs",
        "health": "/api/health",
        "algorithms": "/api/crypto/algorithms"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
