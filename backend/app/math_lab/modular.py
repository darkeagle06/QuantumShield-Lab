"""Modular arithmetic, congruences, number theory, and primality calculations.
Provides dynamic step-by-step educational explanations and intermediate traces.
"""
from typing import Dict, Any, List, Tuple
import math


def calculate_modular_add(a: int, b: int, q: int) -> Dict[str, Any]:
    """Computes (a + b) mod q with division algorithm decomposition."""
    raw_sum = a + b
    res = raw_sum % q
    quotient = raw_sum // q
    return {
        "operation": "modular_addition",
        "formula": f"({a} + {b}) mod {q}",
        "a": a,
        "b": b,
        "modulus": q,
        "raw_sum": raw_sum,
        "quotient": quotient,
        "result": res,
        "explanation": f"{raw_sum} = {quotient} × {q} + {res}. The remainder modulo {q} is {res}."
    }


def calculate_modular_sub(a: int, b: int, q: int) -> Dict[str, Any]:
    """Computes (a - b) mod q, correctly explaining negative remainder congruences."""
    raw_diff = a - b
    res = (raw_diff % q + q) % q
    quotient = raw_diff // q
    return {
        "operation": "modular_subtraction",
        "formula": f"({a} - {b}) mod {q}",
        "a": a,
        "b": b,
        "modulus": q,
        "raw_diff": raw_diff,
        "quotient": quotient,
        "result": res,
        "explanation": (
            f"{raw_diff} = {quotient} × {q} + {res}. "
            f"In modular arithmetic, remainders are normalized to [0, {q - 1}], so {raw_diff} ≡ {res} (mod {q})."
        )
    }


def calculate_modular_mul(a: int, b: int, q: int) -> Dict[str, Any]:
    """Computes (a * b) mod q."""
    raw_product = a * b
    res = raw_product % q
    quotient = raw_product // q
    return {
        "operation": "modular_multiplication",
        "formula": f"({a} × {b}) mod {q}",
        "a": a,
        "b": b,
        "modulus": q,
        "raw_product": raw_product,
        "quotient": quotient,
        "result": res,
        "explanation": f"{raw_product} = {quotient} × {q} + {res}. The remainder modulo {q} is {res}."
    }


def calculate_congruence(a: int, q: int) -> Dict[str, Any]:
    """Computes a mod q demonstrating the Division Algorithm: a = k*q + r with 0 <= r < q."""
    res = (a % q + q) % q
    k = a // q
    return {
        "operation": "remainder_congruence",
        "formula": f"{a} mod {q}",
        "dividend": a,
        "modulus": q,
        "quotient": k,
        "remainder": res,
        "result": res,
        "congruence_statement": f"{a} ≡ {res} (mod {q})",
        "explanation": f"By the Euclidean Division Algorithm, {a} = ({k}) × {q} + {res}, where 0 ≤ {res} < {q}."
    }


def calculate_modular_exp(base: int, exponent: int, q: int) -> Dict[str, Any]:
    """Computes base^exponent mod q with square-and-multiply binary exponentiation trace."""
    steps: List[Dict[str, Any]] = []

    curr_base = base % q
    result = 1
    exp = exponent
    step_num = 1
    binary_exp = bin(exponent)[2:] if exponent >= 0 else "0"

    while exp > 0:
        bit = exp % 2
        prev_res = result
        if bit == 1:
            result = (result * curr_base) % q
            action = f"Odd bit (1): multiply accumulator by current base ({prev_res} × {curr_base}) mod {q} = {result}"
        else:
            action = f"Even bit (0): accumulator unchanged ({result})"

        next_base = (curr_base * curr_base) % q
        steps.append({
            "step": step_num,
            "remaining_exp": exp,
            "bit": bit,
            "current_base": curr_base,
            "action": action,
            "accumulator": result,
            "next_base_squared": next_base
        })
        curr_base = next_base
        exp = exp // 2
        step_num += 1

    final_result = pow(base, exponent, q) if q > 0 else 0
    return {
        "operation": "modular_exponentiation",
        "formula": f"{base}^{exponent} mod {q}",
        "base": base,
        "exponent": exponent,
        "modulus": q,
        "binary_exponent": binary_exp,
        "steps": steps,
        "result": final_result,
        "explanation": f"Using square-and-multiply exponentiation, {base}^{exponent} mod {q} = {final_result} in {len(steps)} steps."
    }


def extended_gcd(a: int, b: int) -> Tuple[int, int, int, List[Dict[str, Any]]]:
    """Computes gcd(a, b) and Bézout coefficients (x, y) such that a*x + b*y = gcd(a, b)."""
    steps = []
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r != 0:
        quotient = old_r // r
        steps.append({
            "step": len(steps) + 1,
            "old_r": old_r,
            "r": r,
            "quotient": quotient,
            "remainder": old_r - quotient * r,
            "s": old_s - quotient * s,
            "t": old_t - quotient * t
        })
        old_r, r = r, old_r - quotient * r
        old_s, s = s, old_s - quotient * s
        old_t, t = t, old_t - quotient * t

    return old_r, old_s, old_t, steps


def calculate_gcd(a: int, b: int) -> Dict[str, Any]:
    """Computes GCD and Bézout identity ax + by = gcd(a, b)."""
    gcd_val, x, y, steps = extended_gcd(a, b)
    is_coprime = (gcd_val == 1)
    return {
        "operation": "extended_euclidean_gcd",
        "a": a,
        "b": b,
        "gcd": gcd_val,
        "is_coprime": is_coprime,
        "bezout_x": x,
        "bezout_y": y,
        "bezout_identity": f"({a}) × ({x}) + ({b}) × ({y}) = {gcd_val}",
        "steps": steps,
        "explanation": (
            f"gcd({a}, {b}) = {gcd_val}. "
            f"By Bézout's identity: ({a})({x}) + ({b})({y}) = {gcd_val}. "
            + ("Since gcd = 1, the numbers are coprime." if is_coprime else "The numbers share a common factor > 1.")
        )
    }


def calculate_modular_inverse(a: int, q: int) -> Dict[str, Any]:
    """Computes the modular multiplicative inverse x such that a * x ≡ 1 (mod q)."""
    gcd_val, x, _, steps = extended_gcd(a, q)
    has_inverse = (gcd_val == 1)
    inv = (x % q + q) % q if has_inverse else None

    return {
        "operation": "modular_inverse",
        "formula": f"{a} · x ≡ 1 (mod {q})",
        "a": a,
        "modulus": q,
        "gcd": gcd_val,
        "has_inverse": has_inverse,
        "inverse": inv,
        "steps": steps,
        "explanation": (
            f"gcd({a}, {q}) = {gcd_val}. "
            + (f"Since gcd({a}, {q}) = 1, the modular inverse exists: {a}⁻¹ mod {q} = {inv}. Verification: ({a} × {inv}) mod {q} = {(a * inv) % q}."
               if has_inverse else f"Since gcd({a}, {q}) = {gcd_val} ≠ 1, {a} and {q} are not coprime, so no multiplicative inverse exists.")
        )
    }


def check_primality(n: int) -> Dict[str, Any]:
    """Tests if n is prime, provides factors, and checks primality."""
    if n <= 1:
        return {
            "n": n,
            "is_prime": False,
            "factors": [],
            "reason": f"{n} is not prime because prime numbers must be strictly greater than 1."
        }

    # Factorization
    d = 2
    temp = n
    factors = []
    while d * d <= temp:
        if temp % d == 0:
            count = 0
            while temp % d == 0:
                count += 1
                temp //= d
            factors.append({"prime": d, "exponent": count})
        d += 1 if d == 2 else 2
    if temp > 1:
        factors.append({"prime": temp, "exponent": 1})

    is_prime = (len(factors) == 1 and factors[0]["exponent"] == 1 and factors[0]["prime"] == n)

    if is_prime:
        explanation = f"{n} is a prime number. Its only divisors are 1 and {n}."
    else:
        decomp = " × ".join([f"{f['prime']}^{f['exponent']}" if f['exponent'] > 1 else str(f['prime']) for f in factors])
        explanation = f"{n} is composite. Prime factorization: {n} = {decomp}."

    return {
        "n": n,
        "is_prime": is_prime,
        "factors": factors,
        "explanation": explanation
    }
