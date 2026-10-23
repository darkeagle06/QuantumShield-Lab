from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_list_algorithms():
    response = client.get("/api/crypto/algorithms")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 3
    algo_names = [a["id"] for a in data["algorithms"]]
    assert "ml-kem" in algo_names
    assert "ml-dsa" in algo_names
    assert "slh-dsa" in algo_names


def test_genuine_kem_workflow_ml_kem_768():
    response = client.post("/api/crypto/kem", json={"algorithm": "ML-KEM-768"})
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "ML-KEM-768"
    assert data["verification"]["secrets_match"] is True
    assert data["verification"]["status"] == "VALIDATED"
    assert data["output_sizes_bytes"]["public_key_bytes"] == 1184
    assert data["output_sizes_bytes"]["ciphertext_bytes"] == 1088
    assert data["output_sizes_bytes"]["shared_secret_bytes"] == 32
    assert data["is_genuine_cryptography"] is True


def test_genuine_sign_workflow_ml_dsa_65_with_tamper():
    response = client.post("/api/crypto/sign", json={
        "algorithm": "ML-DSA-65",
        "message": "Authentic discrete mathematics test vector",
        "tamper_test": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verification"]["valid"] is True
    assert data["tamper_test"]["tamper_detected"] is True
    assert data["tamper_test"]["tampered_verification"] is False
    assert data["output_sizes_bytes"]["public_key_bytes"] == 1952
    assert data["output_sizes_bytes"]["signature_bytes"] == 3309
    assert data["is_genuine_cryptography"] is True


def test_genuine_sign_workflow_slh_dsa_with_tamper():
    response = client.post("/api/crypto/sign", json={
        "algorithm": "SLH-DSA-SHA2-128s",
        "message": "Stateless hash-based signature payload",
        "tamper_test": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verification"]["valid"] is True
    assert data["tamper_test"]["tamper_detected"] is True
    assert data["tamper_test"]["tampered_verification"] is False
    assert data["output_sizes_bytes"]["public_key_bytes"] == 32
    assert data["output_sizes_bytes"]["signature_bytes"] == 7856
    assert data["is_genuine_cryptography"] is True


def test_benchmark_studio_execution():
    response = client.post("/api/benchmarks/run", json={
        "algorithm": "ML-KEM-768",
        "repetitions": 3,
        "warmups": 1
    })
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "ML-KEM-768"
    assert data["repetitions"] == 3
    assert len(data["operation_breakdown"]) >= 3
    assert data["summary_median_ms"] > 0
