"""Mathematical Lab endpoints for Discrete Mathematics demonstrations."""
from fastapi import APIRouter, HTTPException
from ..math_lab.modular import (
    calculate_modular_add,
    calculate_modular_sub,
    calculate_modular_mul,
    calculate_congruence,
    calculate_modular_exp,
    calculate_gcd,
    calculate_modular_inverse,
    check_primality,
)
from ..math_lab.matrix_ops import (
    matrix_addition,
    matrix_multiplication,
    matrix_vector_multiplication,
    matrix_modular_reduction,
)
from ..math_lab.lattice_demo import noisy_linear_demo
from ..math_lab.rsa_toy import calculate_educational_rsa, hash_demonstration
from ..schemas.crypto_schemas import (
    ModularAddRequest,
    ModularSubRequest,
    ModularMulRequest,
    CongruenceRequest,
    ModularExpRequest,
    GcdRequest,
    ModularInverseRequest,
    PrimalityRequest,
    MatrixAddRequest,
    MatrixMulRequest,
    MatrixVectorRequest,
    MatrixReduceRequest,
    NoisyEquationRequest,
    RsaToyRequest,
    HashDemoRequest,
)

router = APIRouter(prefix="/math", tags=["Math Lab"])


# --- Module 1: Modular Arithmetic & Number Theory ---
@router.post("/modular-add")
def modular_add(request: ModularAddRequest):
    return calculate_modular_add(request.a, request.b, request.q)


@router.post("/modular-sub")
def modular_sub(request: ModularSubRequest):
    return calculate_modular_sub(request.a, request.b, request.q)


@router.post("/modular-mul")
def modular_mul(request: ModularMulRequest):
    return calculate_modular_mul(request.a, request.b, request.q)


@router.post("/congruence")
def congruence(request: CongruenceRequest):
    return calculate_congruence(request.a, request.q)


@router.post("/modular-exp")
def modular_exp(request: ModularExpRequest):
    return calculate_modular_exp(request.base, request.exponent, request.q)


@router.post("/gcd")
def gcd_calc(request: GcdRequest):
    return calculate_gcd(request.a, request.b)


@router.post("/modular-inv")
def modular_inv(request: ModularInverseRequest):
    return calculate_modular_inverse(request.a, request.q)


@router.post("/primality")
def primality_check(request: PrimalityRequest):
    return check_primality(request.n)


# --- Module 2: Educational RSA ---
@router.post("/rsa-toy")
def rsa_toy_post(request: RsaToyRequest):
    try:
        return calculate_educational_rsa(
            p=request.p,
            q=request.q,
            message_int=request.m,
            e=request.e
        )
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


@router.get("/rsa-toy")
def rsa_toy_get(p: int = 61, q: int = 53, m: int = 65, e: int = 17):
    try:
        return calculate_educational_rsa(p=p, q=q, message_int=m, e=e)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


# --- Module 3: Matrix and Vector Operations ---
@router.post("/matrix-add")
def matrix_add_endpoint(request: MatrixAddRequest):
    try:
        return matrix_addition(request.matrix_a, request.matrix_b, request.q)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


@router.post("/matrix-mul")
def matrix_mul_endpoint(request: MatrixMulRequest):
    try:
        return matrix_multiplication(request.matrix_a, request.matrix_b, request.q)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


@router.post("/matrix-vector")
def matrix_vector_endpoint(request: MatrixVectorRequest):
    try:
        return matrix_vector_multiplication(request.matrix_a, request.vector_v, request.q)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


@router.post("/matrix-reduce")
def matrix_reduce_endpoint(request: MatrixReduceRequest):
    try:
        return matrix_modular_reduction(request.matrix_a, request.q)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


# --- Module 4: Lattice and Noise Visualization ---
@router.post("/noisy-equation")
def noisy_equation(request: NoisyEquationRequest):
    try:
        return noisy_linear_demo(
            matrix=request.matrix,
            secret_vector=request.secret_vector,
            noise_vector=request.noise_vector,
            q=request.q
        )
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


# --- Module 5: Hash Demonstration ---
@router.post("/hash-avalanche")
def hash_avalanche(request: HashDemoRequest):
    return hash_demonstration(request.input_text, request.modified_text)
