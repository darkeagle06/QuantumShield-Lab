"""Educational textbook RSA demonstration and Cryptographic Hash comparison.
Corresponds to Master Prompt 2 Module 2 & Module 5.
"""
from typing import Dict, Any, Optional, List
import hashlib
import math
from .modular import check_primality, extended_gcd


def calculate_educational_rsa(
    p: int = 61,
    q: int = 53,
    message_int: int = 65,
    e: Optional[int] = 17
) -> Dict[str, Any]:
    """Demonstrates complete textbook RSA key generation, encryption, and decryption."""
    # 1. Validate primality of p and q
    p_info = check_primality(p)
    q_info = check_primality(q)

    if not p_info["is_prime"]:
        raise ValueError(f"Parameter p = {p} is not prime: {p_info['explanation']}")
    if not q_info["is_prime"]:
        raise ValueError(f"Parameter q = {q} is not prime: {q_info['explanation']}")
    if p == q:
        raise ValueError(f"Primes p and q must be distinct primes (received p = q = {p}).")

    # 2. Modulus n = p * q
    n = p * q

    # 3. Euler's totient phi(n) = (p - 1) * (q - 1)
    phi = (p - 1) * (q - 1)

    # 4. Find/Validate public exponent e such that 1 < e < phi and gcd(e, phi) == 1
    valid_e_candidates = [candidate for candidate in [3, 5, 17, 257, 65537] if candidate < phi and math.gcd(candidate, phi) == 1]
    if not valid_e_candidates:
        # scan for any small odd coprime
        for candidate in range(3, min(phi, 1000), 2):
            if math.gcd(candidate, phi) == 1:
                valid_e_candidates.append(candidate)
                if len(valid_e_candidates) >= 5:
                    break

    selected_e = e if (e is not None and 1 < e < phi and math.gcd(e, phi) == 1) else (valid_e_candidates[0] if valid_e_candidates else 3)
    gcd_e_phi, x, _, ext_steps = extended_gcd(selected_e, phi)

    # 5. Private exponent d = e^(-1) mod phi(n)
    d = (x % phi + phi) % phi

    # 6. Validate message integer: 0 <= m < n
    if message_int < 0 or message_int >= n:
        raise ValueError(f"Message integer m = {message_int} must satisfy 0 ≤ m < n (n = {n}).")

    m = message_int

    # 7. Encrypt: c = m^e mod n
    c = pow(m, selected_e, n)

    # 8. Decrypt: recovered = c^d mod n
    recovered = pow(c, d, n)

    # Step-by-step trace
    steps_narrative = [
        {
            "step_number": 1,
            "title": "Select Primes p and q",
            "formula": f"p = {p}, q = {q}",
            "description": f"Chosen primes p={p} and q={q}. Both verified prime."
        },
        {
            "step_number": 2,
            "title": "Calculate RSA Modulus n",
            "formula": f"n = p × q = {p} × {q} = {n}",
            "description": f"Modulus n is public. Its bit length is approximately {n.bit_length()} bits."
        },
        {
            "step_number": 3,
            "title": "Calculate Euler's Totient φ(n)",
            "formula": f"φ(n) = (p - 1) × (q - 1) = ({p - 1}) × ({q - 1}) = {phi}",
            "description": "Counts positive integers up to n that are coprime to n. Essential trapdoor information."
        },
        {
            "step_number": 4,
            "title": "Choose Public Exponent e",
            "formula": f"e = {selected_e}, gcd({selected_e}, {phi}) = 1",
            "description": f"Public key is (e = {selected_e}, n = {n}). e must be coprime to φ(n)."
        },
        {
            "step_number": 5,
            "title": "Calculate Private Exponent d",
            "formula": f"d = e⁻¹ mod φ(n) = {selected_e}⁻¹ mod {phi} = {d}",
            "description": f"Computed via Extended Euclidean algorithm such that ({selected_e} × {d}) mod {phi} = {(selected_e * d) % phi}. Private key is (d = {d}, n = {n})."
        },
        {
            "step_number": 6,
            "title": "Encryption",
            "formula": f"c = mᵉ mod n = {m}^{selected_e} mod {n} = {c}",
            "description": f"Plaintext message integer m = {m} transformed into ciphertext c = {c}."
        },
        {
            "step_number": 7,
            "title": "Decryption & Recovery",
            "formula": f"m' = cᵈ mod n = {c}^{d} mod {n} = {recovered}",
            "description": f"Using private exponent d, ciphertext {c} is decrypted back to recovered message {recovered}."
        }
    ]

    return {
        "operation": "educational_rsa",
        "primes": {"p": p, "q": q},
        "modulus_n": n,
        "totient_phi": phi,
        "public_key": {"e": selected_e, "n": n},
        "private_key": {"d": d, "n": n},
        "message_m": m,
        "ciphertext_c": c,
        "recovered_m": recovered,
        "success": (m == recovered),
        "steps": steps_narrative,
        "valid_e_candidates": valid_e_candidates,
        "extended_gcd_steps": ext_steps,
        "disclaimer": (
            "TEXTBOOK RSA FOR EDUCATIONAL PURPOSES ONLY. "
            "Real-world RSA requires >= 2048-bit primes and randomized padding schemes (such as OAEP for encryption and PSS for signatures) "
            "to prevent homomorphic and small-exponent attacks. Furthermore, Shor's quantum algorithm can factor n in polynomial time O((log n)³)."
        )
    }


def hash_demonstration(input_text: str, modified_text: Optional[str] = None) -> Dict[str, Any]:
    """Demonstrates SHA-256 properties, character modification comparison, and explains
    the difference between Hashing, Encryption, and Digital Signatures.
    """
    if not modified_text or modified_text == input_text:
        # Default modification: change single character (case or trailing symbol)
        if input_text:
            modified_text = input_text[:-1] + ("!" if not input_text.endswith("!") else "?")
        else:
            modified_text = "!"

    hash1_bytes = hashlib.sha256(input_text.encode("utf-8")).digest()
    hash2_bytes = hashlib.sha256(modified_text.encode("utf-8")).digest()

    hex1 = hash1_bytes.hex()
    hex2 = hash2_bytes.hex()

    bin1 = "".join(f"{b:08b}" for b in hash1_bytes)
    bin2 = "".join(f"{b:08b}" for b in hash2_bytes)

    # Compute bit-level differences
    diff_bits = sum(b1 != b2 for b1, b2 in zip(bin1, bin2))
    diff_percentage = round((diff_bits / 256) * 100, 2)

    # Character-level differences
    char_diff = sum(c1 != c2 for c1, c2 in zip(input_text, modified_text)) + abs(len(input_text) - len(modified_text))

    return {
        "operation": "sha256_demonstration",
        "input_a": {
            "text": input_text,
            "length": len(input_text),
            "sha256_hex": hex1,
            "sha256_bin": bin1[:64] + "...",
        },
        "input_b": {
            "text": modified_text,
            "length": len(modified_text),
            "sha256_hex": hex2,
            "sha256_bin": bin2[:64] + "...",
        },
        "avalanche_analysis": {
            "input_characters_changed": char_diff,
            "output_bits_flipped": diff_bits,
            "total_output_bits": 256,
            "avalanche_percentage": diff_percentage,
            "ideal_avalanche_range": "45% – 55%",
            "passes_avalanche_criterion": (40 <= diff_percentage <= 60),
        },
        "paradigms_distinction": {
            "hashing": {
                "name": "Cryptographic Hash (e.g., SHA-256)",
                "reversible": False,
                "key_used": "No key",
                "purpose": "One-way deterministic fingerprint for data integrity and Merkle trees (SLH-DSA)."
            },
            "encryption": {
                "name": "Encryption (e.g., AES-GCM, ML-KEM shared secret)",
                "reversible": True,
                "key_used": "Symmetric or Asymmetric Key",
                "purpose": "Confidentiality; allows authorized parties holding the key to decrypt the original data."
            },
            "digital_signature": {
                "name": "Digital Signature (e.g., ML-DSA, SLH-DSA)",
                "reversible": False,
                "key_used": "Private key (sign) & Public key (verify)",
                "purpose": "Authenticity & Non-repudiation; proves who created the message and that it has not been altered."
            }
        }
    }
