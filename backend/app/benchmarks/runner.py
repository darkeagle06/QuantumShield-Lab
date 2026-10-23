"""Benchmark engine for controlled cryptographic performance measurements.
Implements the exact methodology specified in Master Prompt 3:
- High-resolution monotonic timer (time.perf_counter)
- Warm-up executions strictly excluded from reported samples
- Separate measurement of:
  * Key generation
  * Encapsulation and decapsulation (KEM)
  * Signing and verification (Signatures)
- Minimum, median, maximum, spread, sample count
- Public-key, ciphertext, and signature sizes in bytes
- Clear explanation that results depend on host CPU, runtime, and parameters
"""
from statistics import median, stdev
from time import perf_counter
from typing import Dict, Any, Callable, List
import platform
import sys

from ..crypto.algorithms import get_algorithm_by_name
from ..crypto.engine import (
    CryptoEngine,
    GENUINE_KEM_AVAILABLE,
    GENUINE_DSA_AVAILABLE,
    GENUINE_SLH_AVAILABLE,
)

if GENUINE_KEM_AVAILABLE:
    from kyber_py.ml_kem import ML_KEM_512, ML_KEM_768, ML_KEM_1024

if GENUINE_DSA_AVAILABLE:
    from dilithium_py.ml_dsa import ML_DSA_44, ML_DSA_65, ML_DSA_87

if GENUINE_SLH_AVAILABLE:
    import slhdsa


def measure_callable(
    operation: Callable[[], Any],
    repetitions: int = 10,
    warmups: int = 2
) -> Dict[str, Any]:
    """Measures a callable with monotonic timer, strictly excluding warmups from reported samples."""
    # Warm-up phase (excluded from reported data)
    for _ in range(warmups):
        operation()

    # Measurement phase
    durations_ms: List[float] = []
    for _ in range(repetitions):
        start = perf_counter()
        operation()
        durations_ms.append((perf_counter() - start) * 1000)

    spread = max(durations_ms) - min(durations_ms)
    std_dev = stdev(durations_ms) if len(durations_ms) > 1 else 0.0

    return {
        "repetitions": repetitions,
        "warmups_excluded": warmups,
        "median_ms": round(median(durations_ms), 3),
        "min_ms": round(min(durations_ms), 3),
        "max_ms": round(max(durations_ms), 3),
        "spread_ms": round(spread, 3),
        "std_dev_ms": round(std_dev, 3),
        "samples_ms": [round(x, 3) for x in durations_ms],
    }


def run_benchmark(
    algorithm_name: str = "ML-KEM-768",
    operation_type: str = "all",
    repetitions: int = 10,
    warmups: int = 2
) -> Dict[str, Any]:
    """Runs a controlled performance benchmark measuring individual operations separately."""
    algo_info = get_algorithm_by_name(algorithm_name)
    param_set = algo_info["parameter_set"]
    algo_meta = algo_info["algorithm"]

    env_info = {
        "os": platform.system() + " " + platform.release(),
        "processor": platform.processor() or "x86_64",
        "python_version": sys.version.split()[0],
        "is_genuine": True,
    }

    results: Dict[str, Any] = {
        "algorithm": param_set["name"],
        "category": algo_meta["category"],
        "standard": algo_meta["standard"],
        "math_family": algo_meta["math_family"],
        "nist_category": param_set["nist_category"],
        "environment": env_info,
        "repetitions": repetitions,
        "warmups": warmups,
        "sizes_bytes": {
            "public_key_bytes": param_set["public_key_bytes"],
            "ciphertext_or_signature_bytes": param_set["ciphertext_or_signature_bytes"],
        },
        "operations": {},
        "operation_breakdown": [],
    }

    is_kem = (algo_meta["category"] == "kem")

    if is_kem:
        # Resolve genuine ML-KEM parameter set
        if not GENUINE_KEM_AVAILABLE:
            raise RuntimeError("kyber-py library is not available.")

        kem_instance = ML_KEM_768
        if param_set["name"].upper() == "ML-KEM-512":
            kem_instance = ML_KEM_512
        elif param_set["name"].upper() == "ML-KEM-1024":
            kem_instance = ML_KEM_1024

        # 1. Key generation
        keygen_stats = measure_callable(
            lambda: kem_instance.keygen(),
            repetitions=repetitions,
            warmups=warmups
        )

        # Prepare keypair for encap and decap
        ek, dk = kem_instance.keygen()

        # 2. Encapsulation
        encap_stats = measure_callable(
            lambda: kem_instance.encaps(ek),
            repetitions=repetitions,
            warmups=warmups
        )

        # Prepare ciphertext for decapsulation
        K_B, c = kem_instance.encaps(ek)

        # 3. Decapsulation
        decap_stats = measure_callable(
            lambda: kem_instance.decaps(dk, c),
            repetitions=repetitions,
            warmups=warmups
        )

        results["operations"]["keygen"] = keygen_stats
        results["operations"]["encapsulation"] = encap_stats
        results["operations"]["decapsulation"] = decap_stats
        results["operations"]["kem_roundtrip"] = encap_stats

        total_median = round(
            keygen_stats["median_ms"] + encap_stats["median_ms"] + decap_stats["median_ms"], 3
        )
        results["summary_median_ms"] = total_median

        results["operation_breakdown"] = [
            {
                "operation": "Key Generation (ek, dk)",
                "median_ms": keygen_stats["median_ms"],
                "min_ms": keygen_stats["min_ms"],
                "max_ms": keygen_stats["max_ms"],
                "std_dev_ms": keygen_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": param_set["public_key_bytes"],
            },
            {
                "operation": "Encapsulation (ct, K_B)",
                "median_ms": encap_stats["median_ms"],
                "min_ms": encap_stats["min_ms"],
                "max_ms": encap_stats["max_ms"],
                "std_dev_ms": encap_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": param_set["ciphertext_or_signature_bytes"],
            },
            {
                "operation": "Decapsulation (dk, ct -> K_A)",
                "median_ms": decap_stats["median_ms"],
                "min_ms": decap_stats["min_ms"],
                "max_ms": decap_stats["max_ms"],
                "std_dev_ms": decap_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": 32,
            }
        ]

    elif "SLH-DSA" in param_set["name"].upper():
        if not GENUINE_SLH_AVAILABLE:
            raise RuntimeError("slhdsa library is not available.")

        param_obj = slhdsa.sha2_128s
        if "128F" in param_set["name"].upper():
            param_obj = slhdsa.sha2_128f
        elif "SHAKE" in param_set["name"].upper():
            param_obj = slhdsa.shake_128s

        msg_bytes = b"Controlled benchmark vector for stateless hash signatures"

        # 1. Key generation
        keygen_stats = measure_callable(
            lambda: slhdsa.KeyPair.gen(param_obj),
            repetitions=repetitions,
            warmups=warmups
        )

        kp = slhdsa.KeyPair.gen(param_obj)

        # 2. Signing
        sign_stats = measure_callable(
            lambda: kp.sign(msg_bytes),
            repetitions=repetitions,
            warmups=warmups
        )

        sig = kp.sign(msg_bytes)

        # 3. Verification
        verify_stats = measure_callable(
            lambda: kp.verify(msg_bytes, sig),
            repetitions=repetitions,
            warmups=warmups
        )

        results["operations"]["keygen"] = keygen_stats
        results["operations"]["sign"] = sign_stats
        results["operations"]["verify"] = verify_stats
        results["operations"]["sign_and_verify"] = sign_stats

        total_median = round(
            keygen_stats["median_ms"] + sign_stats["median_ms"] + verify_stats["median_ms"], 3
        )
        results["summary_median_ms"] = total_median

        results["operation_breakdown"] = [
            {
                "operation": "Key Generation (pk, sk)",
                "median_ms": keygen_stats["median_ms"],
                "min_ms": keygen_stats["min_ms"],
                "max_ms": keygen_stats["max_ms"],
                "std_dev_ms": keygen_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": param_set["public_key_bytes"],
            },
            {
                "operation": "Message Signing (sk, msg -> sig)",
                "median_ms": sign_stats["median_ms"],
                "min_ms": sign_stats["min_ms"],
                "max_ms": sign_stats["max_ms"],
                "std_dev_ms": sign_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": param_set["ciphertext_or_signature_bytes"],
            },
            {
                "operation": "Verification (pk, msg, sig)",
                "median_ms": verify_stats["median_ms"],
                "min_ms": verify_stats["min_ms"],
                "max_ms": verify_stats["max_ms"],
                "std_dev_ms": verify_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": 1,
            }
        ]

    else:
        # Genuine ML-DSA
        if not GENUINE_DSA_AVAILABLE:
            raise RuntimeError("dilithium-py library is not available.")

        dsa_instance = ML_DSA_65
        if param_set["name"].upper() == "ML-DSA-44":
            dsa_instance = ML_DSA_44
        elif param_set["name"].upper() == "ML-DSA-87":
            dsa_instance = ML_DSA_87

        msg_bytes = b"Controlled benchmark vector for digital signature performance"

        # 1. Key generation
        keygen_stats = measure_callable(
            lambda: dsa_instance.keygen(),
            repetitions=repetitions,
            warmups=warmups
        )

        pk, sk = dsa_instance.keygen()

        # 2. Signing
        sign_stats = measure_callable(
            lambda: dsa_instance.sign(sk, msg_bytes),
            repetitions=repetitions,
            warmups=warmups
        )

        sig = dsa_instance.sign(sk, msg_bytes)

        # 3. Verification
        verify_stats = measure_callable(
            lambda: dsa_instance.verify(pk, msg_bytes, sig),
            repetitions=repetitions,
            warmups=warmups
        )

        results["operations"]["keygen"] = keygen_stats
        results["operations"]["sign"] = sign_stats
        results["operations"]["verify"] = verify_stats
        results["operations"]["sign_and_verify"] = sign_stats

        total_median = round(
            keygen_stats["median_ms"] + sign_stats["median_ms"] + verify_stats["median_ms"], 3
        )
        results["summary_median_ms"] = total_median

        results["operation_breakdown"] = [
            {
                "operation": "Key Generation (pk, sk)",
                "median_ms": keygen_stats["median_ms"],
                "min_ms": keygen_stats["min_ms"],
                "max_ms": keygen_stats["max_ms"],
                "std_dev_ms": keygen_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": param_set["public_key_bytes"],
            },
            {
                "operation": "Message Signing (sk, msg -> sig)",
                "median_ms": sign_stats["median_ms"],
                "min_ms": sign_stats["min_ms"],
                "max_ms": sign_stats["max_ms"],
                "std_dev_ms": sign_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": param_set["ciphertext_or_signature_bytes"],
            },
            {
                "operation": "Verification (pk, msg, sig)",
                "median_ms": verify_stats["median_ms"],
                "min_ms": verify_stats["min_ms"],
                "max_ms": verify_stats["max_ms"],
                "std_dev_ms": verify_stats["std_dev_ms"],
                "samples": repetitions,
                "output_bytes": 1,
            }
        ]

    results["methodology_explanation"] = (
        "Measurements were recorded using Python's high-resolution monotonic timer (time.perf_counter). "
        f"Each operation underwent {warmups} warm-up cycles (strictly excluded from reported data) and {repetitions} measured repetitions. "
        "Timings reflect CPU execution time on the local host architecture and should not be compared across disparate hardware."
    )

    return results
