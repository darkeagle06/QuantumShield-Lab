"""Matrix and vector operations with modular reduction and intermediate calculation steps.
Supports validation of incompatible dimensions and transparent step-by-step traces.
"""
from typing import Dict, Any, List, Optional
import numpy as np


def matrix_addition(
    matrix_a: List[List[int]],
    matrix_b: List[List[int]],
    q: Optional[int] = None
) -> Dict[str, Any]:
    """Adds two matrices element-wise, optionally reducing modulo q."""
    A = np.array(matrix_a, dtype=int)
    B = np.array(matrix_b, dtype=int)

    if A.shape != B.shape:
        raise ValueError(
            f"Dimension mismatch for matrix addition: Matrix A has shape {A.shape} but Matrix B has shape {B.shape}. "
            f"Both matrices must have identical dimensions."
        )

    rows, cols = A.shape
    raw_sum = (A + B).tolist()
    reduced_sum = ((A + B) % q).tolist() if q is not None and q > 0 else raw_sum

    steps = []
    for i in range(rows):
        row_steps = []
        for j in range(cols):
            a_val = int(A[i, j])
            b_val = int(B[i, j])
            sum_val = a_val + b_val
            entry: Dict[str, Any] = {
                "position": f"[{i+1},{j+1}]",
                "a": a_val,
                "b": b_val,
                "raw_sum": sum_val,
            }
            if q is not None and q > 0:
                entry["reduced"] = sum_val % q
                entry["formula"] = f"({a_val} + {b_val}) mod {q} = {sum_val % q}"
            else:
                entry["formula"] = f"{a_val} + {b_val} = {sum_val}"
            row_steps.append(entry)
        steps.append(row_steps)

    return {
        "operation": "matrix_addition",
        "shape": [rows, cols],
        "matrix_a": matrix_a,
        "matrix_b": matrix_b,
        "modulus_q": q,
        "raw_result": raw_sum,
        "result": reduced_sum,
        "cell_steps": steps,
        "explanation": (
            f"Added two {rows}×{cols} matrices element-wise"
            + (f" and reduced each entry modulo {q}." if q else ".")
        )
    }


def matrix_multiplication(
    matrix_a: List[List[int]],
    matrix_b: List[List[int]],
    q: Optional[int] = None
) -> Dict[str, Any]:
    """Multiplies two matrices A and B, optionally reducing modulo q.
    Validates that cols(A) == rows(B).
    """
    A = np.array(matrix_a, dtype=int)
    B = np.array(matrix_b, dtype=int)

    if A.ndim != 2 or B.ndim != 2:
        raise ValueError("Both inputs must be 2-dimensional matrices.")

    r_a, c_a = A.shape
    r_b, c_b = B.shape

    if c_a != r_b:
        raise ValueError(
            f"Incompatible dimensions for matrix multiplication: Matrix A is {r_a}×{c_a} and Matrix B is {r_b}×{c_b}. "
            f"Number of columns in A ({c_a}) must equal number of rows in B ({r_b})."
        )

    raw_prod = np.dot(A, B).tolist()
    reduced_prod = (np.dot(A, B) % q).tolist() if q is not None and q > 0 else raw_prod

    steps = []
    for i in range(r_a):
        row_steps = []
        for j in range(c_b):
            terms = []
            sum_val = 0
            for k in range(c_a):
                a_k = int(A[i, k])
                b_k = int(B[k, j])
                term_val = a_k * b_k
                sum_val += term_val
                terms.append(f"({a_k} × {b_k})")

            step_info: Dict[str, Any] = {
                "position": f"[{i+1},{j+1}]",
                "terms_string": " + ".join(terms),
                "raw_sum": sum_val,
            }
            if q is not None and q > 0:
                step_info["reduced"] = sum_val % q
                step_info["formula"] = f"{' + '.join(terms)} = {sum_val} ≡ {sum_val % q} (mod {q})"
            else:
                step_info["formula"] = f"{' + '.join(terms)} = {sum_val}"
            row_steps.append(step_info)
        steps.append(row_steps)

    return {
        "operation": "matrix_multiplication",
        "shape_a": [r_a, c_a],
        "shape_b": [r_b, c_b],
        "result_shape": [r_a, c_b],
        "matrix_a": matrix_a,
        "matrix_b": matrix_b,
        "modulus_q": q,
        "raw_result": raw_prod,
        "result": reduced_prod,
        "cell_steps": steps,
        "explanation": (
            f"Multiplied {r_a}×{c_a} matrix by {r_b}×{c_b} matrix yielding a {r_a}×{c_b} matrix"
            + (f" reduced modulo {q}." if q else ".")
        )
    }


def matrix_vector_multiplication(
    matrix_a: List[List[int]],
    vector_v: List[int],
    q: Optional[int] = None
) -> Dict[str, Any]:
    """Multiplies matrix A by vector v: A @ v (mod q)."""
    A = np.array(matrix_a, dtype=int)
    v = np.array(vector_v, dtype=int)

    if A.ndim != 2:
        raise ValueError("Matrix A must be 2-dimensional.")
    if v.ndim != 1:
        raise ValueError("Vector v must be 1-dimensional.")

    r_a, c_a = A.shape
    len_v = v.shape[0]

    if c_a != len_v:
        raise ValueError(
            f"Incompatible dimensions: Matrix A has {c_a} columns but Vector v has length {len_v}. "
            f"Matrix columns must equal vector length."
        )

    raw_res = np.dot(A, v).tolist()
    reduced_res = (np.dot(A, v) % q).tolist() if q is not None and q > 0 else raw_res

    row_steps = []
    for i in range(r_a):
        terms = []
        sum_val = 0
        for k in range(c_a):
            a_k = int(A[i, k])
            v_k = int(v[k])
            term_val = a_k * v_k
            sum_val += term_val
            terms.append(f"({a_k} × {v_k})")

        entry: Dict[str, Any] = {
            "row": i + 1,
            "terms": " + ".join(terms),
            "raw_sum": sum_val,
        }
        if q is not None and q > 0:
            entry["reduced"] = sum_val % q
            entry["formula"] = f"{' + '.join(terms)} = {sum_val} ≡ {sum_val % q} (mod {q})"
        else:
            entry["formula"] = f"{' + '.join(terms)} = {sum_val}"
        row_steps.append(entry)

    return {
        "operation": "matrix_vector_multiplication",
        "matrix_shape": [r_a, c_a],
        "vector_len": len_v,
        "matrix_a": matrix_a,
        "vector_v": vector_v,
        "modulus_q": q,
        "raw_result": raw_res,
        "result": reduced_res,
        "row_steps": row_steps,
        "explanation": (
            f"Multiplied {r_a}×{c_a} matrix by {len_v}-element vector"
            + (f" reduced modulo {q}." if q else ".")
        )
    }


def matrix_modular_reduction(
    matrix_a: List[List[int]],
    q: int
) -> Dict[str, Any]:
    """Reduces all elements of matrix A modulo q."""
    if q <= 1:
        raise ValueError(f"Modulus q must be greater than 1 (received {q}).")
    A = np.array(matrix_a, dtype=int)
    reduced = ((A % q + q) % q).tolist()
    return {
        "operation": "matrix_modular_reduction",
        "matrix_a": matrix_a,
        "modulus_q": q,
        "result": reduced,
        "explanation": f"Reduced all entries of matrix modulo {q} into range [0, {q - 1}]."
    }
