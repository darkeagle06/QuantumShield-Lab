"""Cryptographic operations endpoints."""
from fastapi import APIRouter
from ..crypto.algorithms import get_all_algorithms, CLASSICAL_BASELINES
from ..crypto.engine import CryptoEngine, is_liboqs_available
from ..schemas.crypto_schemas import (
    AlgorithmListResponse,
    KemWorkflowRequest,
    SignWorkflowRequest,
)

router = APIRouter(prefix="/crypto", tags=["Cryptography"])


@router.get("/algorithms", response_model=AlgorithmListResponse)
def list_algorithms():
    """Returns official NIST post-quantum algorithms and classical baselines."""
    algos = get_all_algorithms()
    return AlgorithmListResponse(
        count=len(algos),
        algorithms=algos,
        classical_baselines=CLASSICAL_BASELINES,
        liboqs_native=is_liboqs_available()
    )


@router.post("/kem")
def run_kem(request: KemWorkflowRequest):
    """Executes key encapsulation roundtrip (Alice keygen, Bob encapsulate, Alice decapsulate, secret verification)."""
    return CryptoEngine.run_kem_workflow(request.algorithm)


@router.post("/sign")
def run_sign(request: SignWorkflowRequest):
    """Executes digital signature workflow with optional tamper verification."""
    return CryptoEngine.run_sign_workflow(
        algorithm_name=request.algorithm,
        message=request.message,
        perform_tamper_test=request.tamper_test,
        custom_tampered_message=request.custom_tampered_message,
    )
