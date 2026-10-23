from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


# --- Module 1: Modular Arithmetic Tests ---
def test_modular_addition_examples():
    # Prompt example: (17 + 12) mod 7 = 1
    response = client.post("/api/math/modular-add", json={"a": 17, "b": 12, "q": 7})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 1
    assert data["raw_sum"] == 29
    assert data["quotient"] == 4


def test_modular_subtraction():
    # (17 - 12) mod 7 = 5
    response = client.post("/api/math/modular-sub", json={"a": 17, "b": 12, "q": 7})
    assert response.status_code == 200
    assert response.json()["result"] == 5

    # Negative remainder: (2 - 5) mod 7 = -3 = 4 mod 7
    response2 = client.post("/api/math/modular-sub", json={"a": 2, "b": 5, "q": 7})
    assert response2.status_code == 200
    assert response2.json()["result"] == 4


def test_modular_multiplication():
    # 5 * 8 mod 7 = 40 mod 7 = 5
    response = client.post("/api/math/modular-mul", json={"a": 5, "b": 8, "q": 7})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 5


def test_congruence_remainder_example():
    # Prompt example: 17 mod 5 = 2
    response = client.post("/api/math/congruence", json={"a": 17, "q": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 2
    assert data["quotient"] == 3
    assert data["remainder"] == 2


def test_modular_exponentiation_example():
    # Prompt example: 5^3 mod 7 = 125 mod 7 = 6
    response = client.post("/api/math/modular-exp", json={"base": 5, "exponent": 3, "q": 7})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 6
    assert len(data["steps"]) > 0


def test_gcd_and_extended_euclidean():
    # gcd(17, 7) = 1
    response = client.post("/api/math/gcd", json={"a": 17, "b": 7})
    assert response.status_code == 200
    data = response.json()
    assert data["gcd"] == 1
    assert data["is_coprime"] is True
    assert "bezout_identity" in data


def test_modular_inverse():
    # 3 * x = 1 mod 7 -> x = 5 (since 3*5 = 15 = 2*7 + 1)
    response = client.post("/api/math/modular-inv", json={"a": 3, "q": 7})
    assert response.status_code == 200
    data = response.json()
    assert data["has_inverse"] is True
    assert data["inverse"] == 5


def test_primality_checking():
    # 61 is prime
    res1 = client.post("/api/math/primality", json={"n": 61})
    assert res1.status_code == 200
    assert res1.json()["is_prime"] is True

    # 60 is composite (2^2 * 3 * 5)
    res2 = client.post("/api/math/primality", json={"n": 60})
    assert res2.status_code == 200
    assert res2.json()["is_prime"] is False
    assert len(res2.json()["factors"]) == 3


# --- Module 2: Educational RSA Tests ---
def test_rsa_toy_roundtrip():
    response = client.post("/api/math/rsa-toy", json={
        "p": 61,
        "q": 53,
        "m": 65,
        "e": 17
    })
    assert response.status_code == 200
    data = response.json()
    assert data["modulus_n"] == 61 * 53
    assert data["totient_phi"] == 60 * 52
    assert data["message_m"] == 65
    assert data["recovered_m"] == 65
    assert data["success"] is True
    assert len(data["steps"]) == 7


def test_rsa_non_prime_rejection():
    # p = 60 is not prime, must return 400
    response = client.post("/api/math/rsa-toy", json={
        "p": 60,
        "q": 53,
        "m": 65,
        "e": 17
    })
    assert response.status_code == 400
    assert "not prime" in response.json()["detail"].lower()


# --- Module 3: Matrix and Vector Tests ---
def test_matrix_addition():
    response = client.post("/api/math/matrix-add", json={
        "matrix_a": [[1, 2], [3, 4]],
        "matrix_b": [[5, 6], [7, 8]],
        "q": 7
    })
    assert response.status_code == 200
    data = response.json()
    assert data["raw_result"] == [[6, 8], [10, 12]]
    # Modulo 7: [[6, 1], [3, 5]]
    assert data["result"] == [[6, 1], [3, 5]]


def test_matrix_addition_incompatible_dimensions():
    response = client.post("/api/math/matrix-add", json={
        "matrix_a": [[1, 2], [3, 4]],
        "matrix_b": [[1, 2, 3], [4, 5, 6]],
        "q": 7
    })
    assert response.status_code == 400
    assert "mismatch" in response.json()["detail"].lower()


def test_matrix_multiplication():
    # [[2, 1], [1, 3]] * [[1, 2], [3, 0]]
    # row 0: [2*1 + 1*3, 2*2 + 1*0] = [5, 4]
    # row 1: [1*1 + 3*3, 1*2 + 3*0] = [10, 2]
    # mod 7: [[5, 4], [3, 2]]
    response = client.post("/api/math/matrix-mul", json={
        "matrix_a": [[2, 1], [1, 3]],
        "matrix_b": [[1, 2], [3, 0]],
        "q": 7
    })
    assert response.status_code == 200
    data = response.json()
    assert data["raw_result"] == [[5, 4], [10, 2]]
    assert data["result"] == [[5, 4], [3, 2]]


def test_matrix_vector_multiplication():
    # [[2, 1], [1, 3]] @ [1, 2] = [4, 7] = [4, 0] mod 7
    response = client.post("/api/math/matrix-vector", json={
        "matrix_a": [[2, 1], [1, 3]],
        "vector_v": [1, 2],
        "q": 7
    })
    assert response.status_code == 200
    data = response.json()
    assert data["raw_result"] == [4, 7]
    assert data["result"] == [4, 0]


# --- Module 4: Lattice and Noisy Linear Equation Tests ---
def test_noisy_linear_equation_known_example():
    # Master prompt example: A = [[2, 1], [1, 3]], s = [1, 2], e = [1, 0], q = 7 -> b = [5, 0]
    response = client.post("/api/math/noisy-equation", json={
        "matrix": [[2, 1], [1, 3]],
        "secret_vector": [1, 2],
        "noise_vector": [1, 0],
        "q": 7
    })
    assert response.status_code == 200
    data = response.json()
    assert data["result_vector_b"] == [5, 0]
    assert data["intermediate_steps"]["matrix_mult_As"] == [4, 7]
    assert data["intermediate_steps"]["noisy_sum_As_plus_e"] == [5, 7]
    assert len(data["basis_vectors"]) == 2
    assert len(data["lattice_sample_points"]) > 0


# --- Module 5: Hash Demonstration Tests ---
def test_hash_demonstration():
    response = client.post("/api/math/hash-avalanche", json={
        "input_text": "QuantumShield Lab FIPS 203",
        "modified_text": "Quantumshield Lab FIPS 203"
    })
    assert response.status_code == 200
    data = response.json()
    assert "input_a" in data
    assert "input_b" in data
    assert "avalanche_analysis" in data
    assert "paradigms_distinction" in data
    assert 30 <= data["avalanche_analysis"]["avalanche_percentage"] <= 70
