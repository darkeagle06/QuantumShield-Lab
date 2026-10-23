"""Tests for Experiment and Benchmark Persistence Database."""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_create_and_list_experiments():
    payload = {
        "name": "NIST PQC Latency Study",
        "description": "Evaluating keygen and signing latency across parameter sets",
        "runs": [
            {
                "algorithm": "ML-KEM",
                "parameter_set": "ML-KEM-768",
                "library_version": "NIST FIPS 203 Genuine",
                "machine_info": "AMD Ryzen / Host CPU",
                "repetitions": 20,
                "measurements": [
                    {"operation": "keygen", "duration_ms": 0.45, "output_size_bytes": 1184},
                    {"operation": "encapsulation", "duration_ms": 0.52, "output_size_bytes": 1088},
                    {"operation": "decapsulation", "duration_ms": 0.48, "output_size_bytes": 32}
                ]
            }
        ]
    }
    response = client.post("/api/experiments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "created"
    exp_id = data["experiment"]["experiment_id"]
    assert exp_id is not None
    assert len(data["runs"]) == 1

    # List all
    list_res = client.get("/api/experiments")
    assert list_res.status_code == 200
    exps = list_res.json()["experiments"]
    assert any(e["experiment_id"] == exp_id for e in exps)

    # Get single details
    det_res = client.get(f"/api/experiments/{exp_id}")
    assert det_res.status_code == 200
    det = det_res.json()
    assert det["name"] == "NIST PQC Latency Study"
    assert len(det["runs"]) == 1
    assert len(det["runs"][0]["measurements"]) == 3

    # Stats summary
    stats_res = client.get("/api/experiments/stats/summary")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_experiments"] >= 1
    assert "ML-KEM" in stats["algorithms_tested"]

    # Export CSV
    csv_res = client.get("/api/experiments/export/csv")
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
    assert "Experiment ID" in csv_res.text
    assert "ML-KEM-768" in csv_res.text

    # Export JSON
    json_res = client.get("/api/experiments/export/json")
    assert json_res.status_code == 200
    assert "application/json" in json_res.headers["content-type"]

    # Delete
    del_res = client.delete(f"/api/experiments/{exp_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

    # Verify deleted
    not_found_res = client.get(f"/api/experiments/{exp_id}")
    assert not_found_res.status_code == 404
