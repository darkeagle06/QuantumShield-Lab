"""Algorithm registry and official NIST FIPS specifications for QuantumShield Lab."""
from typing import Dict, Any, List

ALGORITHMS_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "ml-kem",
        "name": "ML-KEM (Module-Lattice Key Encapsulation Mechanism)",
        "standard": "NIST FIPS 203 (Final, August 2024)",
        "category": "kem",
        "math_family": "Lattice-based (Module-LWE)",
        "hardness_problem": "Module Learning With Errors (M-LWE) over polynomial rings R_q = Z_q[X]/(X^256 + 1)",
        "description": "NIST primary standard for post-quantum public-key encryption and key encapsulation. Establishes a shared secret between two communicating parties. Derived from the CRYSTALS-Kyber submission.",
        "official_nist_url": "https://csrc.nist.gov/pubs/fips/203/final",
        "parameter_sets": [
            {
                "name": "ML-KEM-512",
                "nist_category": 1,
                "public_key_bytes": 800,
                "ciphertext_or_signature_bytes": 768,
                "secret_key_bytes": 1632,
                "description": "Security equivalent to AES-128. Lightweight parameter set for constrained devices."
            },
            {
                "name": "ML-KEM-768",
                "nist_category": 3,
                "public_key_bytes": 1184,
                "ciphertext_or_signature_bytes": 1088,
                "secret_key_bytes": 2400,
                "description": "Recommended default. Security equivalent to AES-192. Balanced performance and security."
            },
            {
                "name": "ML-KEM-1024",
                "nist_category": 5,
                "public_key_bytes": 1568,
                "ciphertext_or_signature_bytes": 1568,
                "secret_key_bytes": 3168,
                "description": "High-security parameter set equivalent to AES-256 for long-term critical protection."
            }
        ]
    },
    {
        "id": "ml-dsa",
        "name": "ML-DSA (Module-Lattice Digital Signature Algorithm)",
        "standard": "NIST FIPS 204 (Final, August 2024)",
        "category": "signature",
        "math_family": "Lattice-based (Module-SIS)",
        "hardness_problem": "Module Short Integer Solution (M-SIS) and Module-LWE over polynomial rings",
        "description": "NIST primary standard for post-quantum digital signatures. Provides integrity and authenticity using Fiat-Shamir with Aborts. Derived from CRYSTALS-Dilithium.",
        "official_nist_url": "https://csrc.nist.gov/pubs/fips/204/final",
        "parameter_sets": [
            {
                "name": "ML-DSA-44",
                "nist_category": 2,
                "public_key_bytes": 1312,
                "ciphertext_or_signature_bytes": 2420,
                "secret_key_bytes": 2560,
                "description": "NIST Level 2 signature scheme. Efficient for general purpose signing."
            },
            {
                "name": "ML-DSA-65",
                "nist_category": 3,
                "public_key_bytes": 1952,
                "ciphertext_or_signature_bytes": 3309,
                "secret_key_bytes": 4032,
                "description": "Recommended standard default. NIST Level 3 (equivalent to AES-192 strength)."
            },
            {
                "name": "ML-DSA-87",
                "nist_category": 5,
                "public_key_bytes": 2592,
                "ciphertext_or_signature_bytes": 4627,
                "secret_key_bytes": 4896,
                "description": "Maximum security level (NIST Level 5, equivalent to AES-256)."
            }
        ]
    },
    {
        "id": "slh-dsa",
        "name": "SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)",
        "standard": "NIST FIPS 205 (Final, August 2024)",
        "category": "signature",
        "math_family": "Stateless Hash-Based",
        "hardness_problem": "Second preimage and collision resistance of cryptographic hash functions (SHA-2 / SHAKE)",
        "description": "Conservative backup digital signature standard relying strictly on hash function security rather than lattice assumptions. Derived from SPHINCS+.",
        "official_nist_url": "https://csrc.nist.gov/pubs/fips/205/final",
        "parameter_sets": [
            {
                "name": "SLH-DSA-SHA2-128s",
                "nist_category": 1,
                "public_key_bytes": 32,
                "ciphertext_or_signature_bytes": 7856,
                "secret_key_bytes": 64,
                "description": "Optimized for smaller signature sizes at NIST Level 1 using SHA-256."
            },
            {
                "name": "SLH-DSA-SHA2-128f",
                "nist_category": 1,
                "public_key_bytes": 32,
                "ciphertext_or_signature_bytes": 17088,
                "secret_key_bytes": 64,
                "description": "Optimized for faster signing speed with larger signature size at NIST Level 1."
            },
            {
                "name": "SLH-DSA-SHAKE-128s",
                "nist_category": 1,
                "public_key_bytes": 32,
                "ciphertext_or_signature_bytes": 7856,
                "secret_key_bytes": 64,
                "description": "Stateless hash signatures using SHAKE-256 sponge function."
            },
            {
                "name": "SLH-DSA-SHA2-256s",
                "nist_category": 5,
                "public_key_bytes": 64,
                "ciphertext_or_signature_bytes": 29792,
                "secret_key_bytes": 128,
                "description": "High-security hash-based signature (NIST Level 5)."
            }
        ]
    }
]

CLASSICAL_BASELINES: List[Dict[str, Any]] = [
    {
        "name": "RSA-2048",
        "category": "classical",
        "math_family": "Integer Factorization",
        "vulnerable_to": "Shor's Algorithm (Polynomial Time)",
        "public_key_bytes": 256,
        "ciphertext_or_signature_bytes": 256,
        "classical_security_bits": 112,
        "quantum_security_bits": 0,
        "note": "Standard legacy public key cryptosystem vulnerable to cryptanalytically relevant quantum computers (CRQC)."
    },
    {
        "name": "RSA-3072",
        "category": "classical",
        "math_family": "Integer Factorization",
        "vulnerable_to": "Shor's Algorithm (Polynomial Time)",
        "public_key_bytes": 384,
        "ciphertext_or_signature_bytes": 384,
        "classical_security_bits": 128,
        "quantum_security_bits": 0,
        "note": "Larger classical RSA key; still completely solvable via Shor's algorithm on a fault-tolerant quantum computer."
    },
    {
        "name": "ECDSA P-256",
        "category": "classical",
        "math_family": "Discrete Logarithm Problem (Elliptic Curves)",
        "vulnerable_to": "Shor's Algorithm for Elliptic Curve DLP",
        "public_key_bytes": 64,
        "ciphertext_or_signature_bytes": 64,
        "classical_security_bits": 128,
        "quantum_security_bits": 0,
        "note": "Widely used elliptic-curve signature scheme; compact keys but completely broken by Shor's quantum algorithm."
    }
]


def get_all_algorithms() -> List[Dict[str, Any]]:
    return ALGORITHMS_REGISTRY


def get_algorithm_by_name(param_name: str) -> Dict[str, Any]:
    param_upper = param_name.upper().replace("_", "-")
    for algo in ALGORITHMS_REGISTRY:
        for p in algo["parameter_sets"]:
            if p["name"].upper() == param_upper:
                return {
                    "algorithm": algo,
                    "parameter_set": p
                }
    # default fallback to ML-KEM-768
    return {
        "algorithm": ALGORITHMS_REGISTRY[0],
        "parameter_set": ALGORITHMS_REGISTRY[0]["parameter_sets"][1]
    }
