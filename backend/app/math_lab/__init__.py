"""Math lab calculations package."""
from .modular import (
    calculate_modular_add,
    calculate_modular_sub,
    calculate_modular_mul,
    calculate_congruence,
    calculate_modular_exp,
    calculate_gcd,
    calculate_modular_inverse,
    check_primality,
)
from .matrix_ops import (
    matrix_addition,
    matrix_multiplication,
    matrix_vector_multiplication,
    matrix_modular_reduction,
)
from .lattice_demo import noisy_linear_demo
from .rsa_toy import calculate_educational_rsa, hash_demonstration

__all__ = [
    "calculate_modular_add",
    "calculate_modular_sub",
    "calculate_modular_mul",
    "calculate_congruence",
    "calculate_modular_exp",
    "calculate_gcd",
    "calculate_modular_inverse",
    "check_primality",
    "matrix_addition",
    "matrix_multiplication",
    "matrix_vector_multiplication",
    "matrix_modular_reduction",
    "noisy_linear_demo",
    "calculate_educational_rsa",
    "hash_demonstration",
]
