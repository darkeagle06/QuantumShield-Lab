"""Lattice intuition and Noisy Linear Equations (Learning With Errors) demonstration.
Corresponds to Guide Sec 63-66 and Presentation Slides 8-9.
"""
from typing import Dict, Any, List
import numpy as np


def noisy_linear_demo(
    matrix: List[List[int]] = [[2, 1], [1, 3]],
    secret_vector: List[int] = [1, 2],
    noise_vector: List[int] = [1, 0],
    q: int = 7
) -> Dict[str, Any]:
    """Calculates b = As + e (mod q)
    A: m x n matrix (default 2x2)
    s: secret vector of length n (default [1, 2])
    e: small noise error vector of length m (default [1, 0])
    q: modulus (default 7)
    Yields expected result b = [5, 0].
    """
    A = np.array(matrix, dtype=int)
    s = np.array(secret_vector, dtype=int)
    e = np.array(noise_vector, dtype=int)

    # Verification of dimensions
    if A.shape[1] != s.shape[0]:
        raise ValueError(f"Matrix column dimension {A.shape[1]} must match secret vector length {s.shape[0]}")
    if A.shape[0] != e.shape[0]:
        raise ValueError(f"Matrix row dimension {A.shape[0]} must match noise vector length {e.shape[0]}")
    if q <= 1:
        raise ValueError("Modulus q must be strictly greater than 1.")

    # 1. Exact matrix-vector product: A @ s
    As = np.dot(A, s)
    # 2. Add small error: As + e
    As_plus_e = As + e
    # 3. Modular reduction: (As + e) mod q
    b = ((As_plus_e % q + q) % q)

    # Basis vectors for 2D visualization (columns of A)
    basis_vectors = []
    lattice_grid = []
    if A.shape == (2, 2):
        v1 = [int(A[0, 0]), int(A[1, 0])]
        v2 = [int(A[0, 1]), int(A[1, 1])]
        basis_vectors = [
            {"id": "v1", "name": "Basis v₁", "x": v1[0], "y": v1[1]},
            {"id": "v2", "name": "Basis v₂", "x": v2[0], "y": v2[1]}
        ]

        # Generate lattice points Lambda(A) = { c1*v1 + c2*v2 | -3 <= c1, c2 <= 3 }
        for c1 in range(-3, 4):
            for c2 in range(-3, 4):
                px = c1 * v1[0] + c2 * v2[0]
                py = c1 * v1[1] + c2 * v2[1]
                lattice_grid.append({
                    "x": int(px),
                    "y": int(py),
                    "c1": c1,
                    "c2": c2,
                    "is_origin": (c1 == 0 and c2 == 0),
                    "is_secret_target": (c1 == int(s[0]) and c2 == int(s[1]))
                })

    noise_norm = float(np.linalg.norm(e))

    return {
        "operation": "noisy_linear_equation",
        "formula": "b = As + e (mod q)",
        "modulus_q": q,
        "matrix_A": A.tolist(),
        "secret_vector_s": s.tolist(),
        "noise_vector_e": e.tolist(),
        "noise_norm": round(noise_norm, 3),
        "intermediate_steps": {
            "matrix_mult_As": As.tolist(),
            "noisy_sum_As_plus_e": As_plus_e.tolist(),
            "final_vector_b": b.tolist(),
        },
        "result_vector_b": b.tolist(),
        "basis_vectors": basis_vectors,
        "lattice_sample_points": lattice_grid,
        "geometric_points": {
            "origin": [0, 0],
            "exact_lattice_point_As": As.tolist(),
            "perturbed_point_As_plus_e": As_plus_e.tolist(),
            "modular_point_b": b.tolist(),
        },
        "educational_context": {
            "problem": "Learning With Errors (LWE) / Module-LWE",
            "hardness": (
                "Given public matrix A and noisy result b = (As + e) mod q, recovering secret vector s is "
                "computationally intractable when error e is drawn from a discrete small noise distribution. "
                "Without noise (e = 0), this is simple Gaussian elimination over Z_q. "
                "With noise e, it directly reduces to worst-case geometric lattice problems (Shortest Vector Problem / Closest Vector Problem)."
            ),
            "distinction": (
                "IMPORTANT: This is a simplified 2D educational model for intuitive visualization. "
                "Standardized ML-KEM and ML-DSA do not operate in 2D Euclidean space; they operate over "
                "high-dimensional module polynomial quotient rings R_q = Z_q[X]/(X^256 + 1) with q = 3329."
            )
        }
    }
