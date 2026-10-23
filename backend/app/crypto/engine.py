"""Cryptographic execution engine for QuantumShield Lab.
Directly implements genuine standardized post-quantum cryptography:
- NIST FIPS 203: ML-KEM via kyber_py.ml_kem (ML-KEM-512, ML-KEM-768, ML-KEM-1024)
- NIST FIPS 204: ML-DSA via dilithium_py.ml_dsa (ML-DSA-44, ML-DSA-65, ML-DSA-87)
- NIST FIPS 205: SLH-DSA via slhdsa (sha2_128s, sha2_128f, shake_128s)

Secret Hygiene: Never logs, persists, or returns private keys or shared secrets.
"""
import hashlib
import hmac
import time
from typing import Dict, Any, Optional

from .algorithms import get_algorithm_by_name

# Check genuine library availability
GENUINE_KEM_AVAILABLE = False
GENUINE_DSA_AVAILABLE = False
GENUINE_SLH_AVAILABLE = False

try:
    from kyber_py.ml_kem import ML_KEM_512, ML_KEM_768, ML_KEM_1024
    GENUINE_KEM_AVAILABLE = True
except ImportError:
    GENUINE_KEM_AVAILABLE = False

try:
    from dilithium_py.ml_dsa import ML_DSA_44, ML_DSA_65, ML_DSA_87
    GENUINE_DSA_AVAILABLE = True
except ImportError:
    GENUINE_DSA_AVAILABLE = False

try:
    import slhdsa
    GENUINE_SLH_AVAILABLE = True
except ImportError:
    GENUINE_SLH_AVAILABLE = False


def is_liboqs_available() -> bool:
    """Returns False since Open Quantum Safe native C bindings are replaced with genuine Python PQC implementations."""
    return False


def get_crypto_engine_status() -> Dict[str, Any]:
    return {
        "fips203_ml_kem": "kyber_py.ml_kem (NIST FIPS 203 Genuine)" if GENUINE_KEM_AVAILABLE else "Unavailable",
        "fips204_ml_dsa": "dilithium_py.ml_dsa (NIST FIPS 204 Genuine)" if GENUINE_DSA_AVAILABLE else "Unavailable",
        "fips205_slh_dsa": "slhdsa (NIST FIPS 205 Genuine)" if GENUINE_SLH_AVAILABLE else "Unavailable",
        "all_genuine": GENUINE_KEM_AVAILABLE and GENUINE_DSA_AVAILABLE and GENUINE_SLH_AVAILABLE,
    }


class CryptoEngine:
    """Orchestrates genuine post-quantum cryptographic workflows."""

    @staticmethod
    def run_kem_workflow(algorithm_name: str = "ML-KEM-768") -> Dict[str, Any]:
        """Runs genuine Alice & Bob key encapsulation handshake:
        1. Keygen (Alice generates encapsulation key ek and decapsulation key dk)
        2. Encapsulate (Bob encapsulates against ek, producing ciphertext c and shared secret K_B)
        3. Decapsulate (Alice decapsulates c with dk, recovering shared secret K_A)
        4. Consistency check (Confirm K_A == K_B inside backend without exposing secrets)
        """
        algo_info = get_algorithm_by_name(algorithm_name)
        param_set = algo_info["parameter_set"]
        algo_meta = algo_info["algorithm"]

        # Select genuine FIPS 203 implementation
        kem_instance = None
        if GENUINE_KEM_AVAILABLE:
            if param_set["name"].upper() == "ML-KEM-512":
                kem_instance = ML_KEM_512
            elif param_set["name"].upper() == "ML-KEM-1024":
                kem_instance = ML_KEM_1024
            else:
                kem_instance = ML_KEM_768

        if not kem_instance:
            raise RuntimeError(
                f"ML-KEM implementation is unavailable in current environment. "
                f"Please ensure kyber-py is installed via pip."
            )

        # Step 1: Alice KeyGen
        t0 = time.perf_counter()
        ek, dk = kem_instance.keygen()
        t_keygen = (time.perf_counter() - t0) * 1000

        # Step 2: Bob Encapsulation
        t1 = time.perf_counter()
        K_B, c = kem_instance.encaps(ek)
        t_encap = (time.perf_counter() - t1) * 1000

        # Step 3: Alice Decapsulation
        t2 = time.perf_counter()
        K_A = kem_instance.decaps(dk, c)
        t_decap = (time.perf_counter() - t2) * 1000

        # Step 4: Internal validation of shared secret equality
        secrets_match = hmac.compare_digest(K_A, K_B)

        # Secret Hygiene: Compute 1-way fingerprint of shared secret for UI display (NEVER raw secret)
        ss_bytes = bytes(K_A)
        ss_fingerprint = hashlib.sha256(ss_bytes).hexdigest()[:16]
        ss_preview = f"Zero-Knowledge Verified [SHA256:{ss_fingerprint}...]"

        return {
            "algorithm": param_set["name"],
            "standard": algo_meta["standard"],
            "math_family": algo_meta["math_family"],
            "nist_category": param_set["nist_category"],
            "implementation_engine": "kyber_py.ml_kem (NIST FIPS 203 Final)",
            "is_genuine_cryptography": True,
            "timings_ms": {
                "keygen_ms": round(t_keygen, 3),
                "encapsulation_ms": round(t_encap, 3),
                "decapsulation_ms": round(t_decap, 3),
                "total_ms": round(t_keygen + t_encap + t_decap, 3),
            },
            "output_sizes_bytes": {
                "public_key_bytes": len(ek),
                "ciphertext_bytes": len(c),
                "decapsulation_key_bytes": len(dk),
                "shared_secret_bytes": len(K_A),
            },
            "verification": {
                "secrets_match": secrets_match,
                "status": "VALIDATED" if secrets_match else "FAILED",
                "shared_secret_fingerprint": f"SHA256:{ss_fingerprint}",
                "shared_secret_preview": ss_preview,
            },
            "artifacts": {
                "public_key_preview": ek[:16].hex() + "..." + ek[-16:].hex(),
                "ciphertext_preview": c[:16].hex() + "..." + c[-16:].hex(),
            },
            "educational_note": (
                "ML-KEM (FIPS 203) operates over polynomial quotient rings R_q = Z_q[X]/(X^256 + 1) with q = 3329. "
                "Alice and Bob successfully derived identical 256-bit symmetric shared secrets. "
                "Notice that private decapsulation keys and shared secrets are never stored or logged."
            )
        }

    @staticmethod
    def run_sign_workflow(
        algorithm_name: str = "ML-DSA-65",
        message: str = "Quantum-resistant message authentication payload.",
        perform_tamper_test: bool = True,
        custom_tampered_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """Runs genuine digital signature workflow (ML-DSA or SLH-DSA) with tamper verification."""
        algo_info = get_algorithm_by_name(algorithm_name)
        param_set = algo_info["parameter_set"]
        algo_meta = algo_info["algorithm"]

        msg_bytes = message.encode("utf-8")
        is_slh = "SLH-DSA" in param_set["name"].upper()

        # Determine tampered message for verification rejection test
        if custom_tampered_message and custom_tampered_message != message:
            tampered_msg = custom_tampered_message
        else:
            tampered_msg = message[:-1] + ("!" if not message.endswith("!") else "?")

        if is_slh:
            # Genuine SLH-DSA via slhdsa
            if not GENUINE_SLH_AVAILABLE:
                raise RuntimeError("slhdsa library is not available.")

            param_obj = slhdsa.sha2_128s
            if "128F" in param_set["name"].upper():
                param_obj = slhdsa.sha2_128f
            elif "SHAKE" in param_set["name"].upper():
                param_obj = slhdsa.shake_128s

            t0 = time.perf_counter()
            kp = slhdsa.KeyPair.gen(param_obj)
            t_keygen = (time.perf_counter() - t0) * 1000

            t1 = time.perf_counter()
            sig = kp.sign(msg_bytes)
            t_sign = (time.perf_counter() - t1) * 1000

            t2 = time.perf_counter()
            original_verified = kp.verify(msg_bytes, sig)
            t_verify = (time.perf_counter() - t2) * 1000

            pk_bytes = kp.pub.digest()
            pk_len = len(pk_bytes)
            sig_len = len(sig)

            # Tamper verification
            tamper_results = None
            if perform_tamper_test:
                tampered_bytes = tampered_msg.encode("utf-8")
                tampered_verified = False
                try:
                    tampered_verified = kp.verify(tampered_bytes, sig)
                except Exception:
                    tampered_verified = False

                tamper_results = {
                    "original_message": message,
                    "tampered_message": tampered_msg,
                    "tampered_verification": tampered_verified,
                    "tamper_detected": not tampered_verified,
                    "explanation": (
                        "Altering even a single character in the message breaks the Merkle tree authentication path "
                        "and verification is rejected."
                    )
                }

            engine_label = "slhdsa (NIST FIPS 205 Genuine)"

        else:
            # Genuine ML-DSA via dilithium_py
            if not GENUINE_DSA_AVAILABLE:
                raise RuntimeError("dilithium-py library is not available.")

            dsa_instance = ML_DSA_65
            if param_set["name"].upper() == "ML-DSA-44":
                dsa_instance = ML_DSA_44
            elif param_set["name"].upper() == "ML-DSA-87":
                dsa_instance = ML_DSA_87

            t0 = time.perf_counter()
            pk, sk = dsa_instance.keygen()
            t_keygen = (time.perf_counter() - t0) * 1000

            t1 = time.perf_counter()
            sig = dsa_instance.sign(sk, msg_bytes)
            t_sign = (time.perf_counter() - t1) * 1000

            t2 = time.perf_counter()
            original_verified = dsa_instance.verify(pk, msg_bytes, sig)
            t_verify = (time.perf_counter() - t2) * 1000

            pk_bytes = pk
            pk_len = len(pk)
            sig_len = len(sig)

            # Tamper verification
            tamper_results = None
            if perform_tamper_test:
                tampered_bytes = tampered_msg.encode("utf-8")
                tampered_verified = dsa_instance.verify(pk, tampered_bytes, sig)
                tamper_results = {
                    "original_message": message,
                    "tampered_message": tampered_msg,
                    "tampered_verification": tampered_verified,
                    "tamper_detected": not tampered_verified,
                    "explanation": (
                        "Modifying even one message character changes the challenge hash c = H(μ || w_1) "
                        "and causes Fiat-Shamir verification to fail."
                    )
                }

            engine_label = "dilithium_py.ml_dsa (NIST FIPS 204 Genuine)"

        return {
            "algorithm": param_set["name"],
            "standard": algo_meta["standard"],
            "math_family": algo_meta["math_family"],
            "nist_category": param_set["nist_category"],
            "implementation_engine": engine_label,
            "is_genuine_cryptography": True,
            "message": message,
            "message_bytes_len": len(msg_bytes),
            "timings_ms": {
                "keygen_ms": round(t_keygen, 3),
                "sign_ms": round(t_sign, 3),
                "verify_ms": round(t_verify, 3),
                "total_ms": round(t_keygen + t_sign + t_verify, 3),
            },
            "output_sizes_bytes": {
                "public_key_bytes": pk_len,
                "signature_bytes": sig_len,
            },
            "verification": {
                "valid": original_verified,
                "status": "SIGNATURE_VALID" if original_verified else "SIGNATURE_INVALID",
            },
            "tamper_test": tamper_results,
            "artifacts": {
                "public_key_preview": pk_bytes[:16].hex() + "..." + pk_bytes[-16:].hex(),
                "signature_preview": sig[:16].hex() + "..." + sig[-16:].hex(),
            },
            "educational_note": (
                f"{param_set['name']} is standardized under {algo_meta['standard']}. "
                "Digital signatures provide authenticity and non-repudiation, not secrecy. "
                "The payload remains plaintext, while the signature mathematically certifies that the message came from the private key holder."
            )
        }
