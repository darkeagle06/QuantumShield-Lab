"""Pydantic schemas for QuantumShield Lab API."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "QuantumShield Lab API"
    version: str = "1.0.0"
    python_version: str
    liboqs_native: bool
    timestamp: str


class ParameterSet(BaseModel):
    name: str
    nist_category: int
    public_key_bytes: int
    ciphertext_or_signature_bytes: int
    secret_key_bytes: Optional[int] = None
    description: str


class AlgorithmInfo(BaseModel):
    id: str
    name: str
    standard: str
    category: str
    math_family: str
    hardness_problem: str
    description: str
    parameter_sets: List[ParameterSet]
    official_nist_url: str


class AlgorithmListResponse(BaseModel):
    count: int
    algorithms: List[AlgorithmInfo]
    classical_baselines: List[Dict[str, Any]]
    liboqs_native: bool


# Module 1: Modular Arithmetic & Number Theory Schemas
class ModularAddRequest(BaseModel):
    a: int
    b: int
    q: int = Field(gt=1, le=10000000, description="Modulus q must be > 1")


class ModularSubRequest(BaseModel):
    a: int
    b: int
    q: int = Field(gt=1, le=10000000, description="Modulus q must be > 1")


class ModularMulRequest(BaseModel):
    a: int
    b: int
    q: int = Field(gt=1, le=10000000, description="Modulus q must be > 1")


class CongruenceRequest(BaseModel):
    a: int
    q: int = Field(gt=1, le=10000000, description="Modulus q must be > 1")


class ModularExpRequest(BaseModel):
    base: int
    exponent: int = Field(ge=0, le=10000000)
    q: int = Field(gt=1, le=10000000)


class GcdRequest(BaseModel):
    a: int
    b: int


class ModularInverseRequest(BaseModel):
    a: int
    q: int = Field(gt=1, le=10000000)


class PrimalityRequest(BaseModel):
    n: int = Field(ge=1, le=100000000)


# Module 2: Educational RSA Schemas
class RsaToyRequest(BaseModel):
    p: int = Field(default=61, ge=2, le=10000)
    q: int = Field(default=53, ge=2, le=10000)
    m: int = Field(default=65, ge=0)
    e: Optional[int] = Field(default=17, ge=2)


# Module 3: Matrix and Vector Operations Schemas
class MatrixAddRequest(BaseModel):
    matrix_a: List[List[int]] = Field(default=[[1, 2], [3, 4]])
    matrix_b: List[List[int]] = Field(default=[[5, 6], [7, 8]])
    q: Optional[int] = Field(default=7, ge=2, le=100000)


class MatrixMulRequest(BaseModel):
    matrix_a: List[List[int]] = Field(default=[[2, 1], [1, 3]])
    matrix_b: List[List[int]] = Field(default=[[1, 2], [3, 0]])
    q: Optional[int] = Field(default=7, ge=2, le=100000)


class MatrixVectorRequest(BaseModel):
    matrix_a: List[List[int]] = Field(default=[[2, 1], [1, 3]])
    vector_v: List[int] = Field(default=[1, 2])
    q: Optional[int] = Field(default=7, ge=2, le=100000)


class MatrixReduceRequest(BaseModel):
    matrix_a: List[List[int]] = Field(default=[[10, 15], [22, 7]])
    q: int = Field(default=7, ge=2, le=100000)


# Module 4: Lattice & Noisy Equations Schema
class NoisyEquationRequest(BaseModel):
    matrix: List[List[int]] = Field(default=[[2, 1], [1, 3]])
    secret_vector: List[int] = Field(default=[1, 2])
    noise_vector: List[int] = Field(default=[1, 0])
    q: int = Field(default=7, gt=1, le=100000)


# Module 5: Hash Demonstration Schema
class HashDemoRequest(BaseModel):
    input_text: str = Field(default="QuantumShield Lab FIPS 203")
    modified_text: Optional[str] = Field(default="Quantumshield Lab FIPS 203")


# Crypto Workbench Schemas
class KemWorkflowRequest(BaseModel):
    algorithm: str = Field(default="ML-KEM-768")


class SignWorkflowRequest(BaseModel):
    algorithm: str = Field(default="ML-DSA-65")
    message: str = Field(default="Quantum-resistant message authentication payload.")
    tamper_test: bool = Field(default=True)
    custom_tampered_message: Optional[str] = Field(
        default=None,
        description="Optional student-edited message to verify that original signature is rejected"
    )


# Benchmark Studio Schemas
class BenchmarkRunRequest(BaseModel):
    algorithm: str = Field(default="ML-KEM-768")
    operation: str = Field(default="all")
    repetitions: int = Field(default=20, ge=1, le=100)
    warmups: int = Field(default=3, ge=0, le=20)
