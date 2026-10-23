"""Relational Database Layer for QuantumShield Lab.
Implements the exact relational schema defined in Master Prompt Section 2.6:
- Experiments (experiment_id, name, description, created_at)
- AlgorithmConfigurations (configuration_id, algorithm, parameter_set, library_version)
- BenchmarkRuns (run_id, experiment_id, configuration_id, machine_info, repetitions, timestamp)
- BenchmarkMeasurements (measurement_id, run_id, operation, duration_ms, output_size_bytes)

Guarantees:
- ACID transactions with foreign key enforcement
- SQLite portable file-based storage (quantumshield.db)
- Never persists private keys or shared secrets
"""
import sqlite3
import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

DB_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "quantumshield.db")


def get_db_connection() -> sqlite3.Connection:
    """Creates a connection with row factory and foreign key enforcement enabled."""
    conn = sqlite3.connect(DB_FILE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_database() -> None:
    """Initializes tables, constraints, and indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS experiments (
        experiment_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS algorithm_configurations (
        configuration_id TEXT PRIMARY KEY,
        algorithm TEXT NOT NULL,
        parameter_set TEXT NOT NULL,
        library_version TEXT NOT NULL,
        UNIQUE(algorithm, parameter_set, library_version)
    );

    CREATE TABLE IF NOT EXISTS benchmark_runs (
        run_id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        configuration_id TEXT NOT NULL,
        machine_info TEXT,
        repetitions INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (experiment_id) REFERENCES experiments(experiment_id) ON DELETE CASCADE,
        FOREIGN KEY (configuration_id) REFERENCES algorithm_configurations(configuration_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS benchmark_measurements (
        measurement_id TEXT PRIMARY KEY,
        run_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        duration_ms REAL NOT NULL,
        output_size_bytes INTEGER,
        FOREIGN KEY (run_id) REFERENCES benchmark_runs(run_id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_runs_experiment ON benchmark_runs(experiment_id);
    CREATE INDEX IF NOT EXISTS idx_runs_config ON benchmark_runs(configuration_id);
    CREATE INDEX IF NOT EXISTS idx_runs_timestamp ON benchmark_runs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_measurements_run ON benchmark_measurements(run_id);
    CREATE INDEX IF NOT EXISTS idx_measurements_op ON benchmark_measurements(operation);
    """)

    conn.commit()
    conn.close()


def get_or_create_configuration(algorithm: str, parameter_set: str, library_version: str) -> str:
    """Retrieves an existing configuration_id or creates a new one."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT configuration_id FROM algorithm_configurations WHERE algorithm = ? AND parameter_set = ? AND library_version = ?",
        (algorithm, parameter_set, library_version)
    )
    row = cursor.fetchone()
    if row:
        config_id = row["configuration_id"]
    else:
        config_id = f"cfg_{uuid.uuid4().hex[:12]}"
        cursor.execute(
            "INSERT INTO algorithm_configurations (configuration_id, algorithm, parameter_set, library_version) VALUES (?, ?, ?, ?)",
            (config_id, algorithm, parameter_set, library_version)
        )
        conn.commit()
    conn.close()
    return config_id


def create_experiment(name: str, description: Optional[str] = None, experiment_id: Optional[str] = None) -> Dict[str, Any]:
    """Creates a new experiment record."""
    exp_id = experiment_id or f"exp_{uuid.uuid4().hex[:12]}"
    created_at = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO experiments (experiment_id, name, description, created_at) VALUES (?, ?, ?, ?)",
        (exp_id, name, description or "", created_at)
    )
    conn.commit()
    conn.close()
    return {
        "experiment_id": exp_id,
        "name": name,
        "description": description or "",
        "created_at": created_at
    }


def record_benchmark_run(
    experiment_id: str,
    algorithm: str,
    parameter_set: str,
    library_version: str,
    machine_info: str,
    repetitions: int,
    measurements: List[Dict[str, Any]],
    run_id: Optional[str] = None
) -> Dict[str, Any]:
    """Records a complete benchmark run with individual operations and measurements."""
    config_id = get_or_create_configuration(algorithm, parameter_set, library_version)
    r_id = run_id or f"run_{uuid.uuid4().hex[:12]}"
    now_ts = datetime.now(timezone.utc).isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO benchmark_runs (run_id, experiment_id, configuration_id, machine_info, repetitions, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
        (r_id, experiment_id, config_id, machine_info, repetitions, now_ts)
    )

    created_measurements = []
    for m in measurements:
        m_id = f"meas_{uuid.uuid4().hex[:12]}"
        op = m.get("operation", "unknown")
        duration = float(m.get("duration_ms", 0.0))
        size = m.get("output_size_bytes")
        cursor.execute(
            "INSERT INTO benchmark_measurements (measurement_id, run_id, operation, duration_ms, output_size_bytes) VALUES (?, ?, ?, ?, ?)",
            (m_id, r_id, op, duration, size)
        )
        created_measurements.append({
            "measurement_id": m_id,
            "operation": op,
            "duration_ms": duration,
            "output_size_bytes": size
        })

    conn.commit()
    conn.close()

    return {
        "run_id": r_id,
        "experiment_id": experiment_id,
        "configuration_id": config_id,
        "algorithm": algorithm,
        "parameter_set": parameter_set,
        "library_version": library_version,
        "machine_info": machine_info,
        "repetitions": repetitions,
        "timestamp": now_ts,
        "measurements": created_measurements
    }


def list_experiments() -> List[Dict[str, Any]]:
    """Lists all experiments with run count and aggregated statistics."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        e.experiment_id,
        e.name,
        e.description,
        e.created_at,
        COUNT(DISTINCT r.run_id) AS total_runs,
        COUNT(DISTINCT m.measurement_id) AS total_measurements
    FROM experiments e
    LEFT JOIN benchmark_runs r ON e.experiment_id = r.experiment_id
    LEFT JOIN benchmark_measurements m ON r.run_id = m.run_id
    GROUP BY e.experiment_id
    ORDER BY e.created_at DESC
    """)

    results = []
    for row in cursor.fetchall():
        results.append(dict(row))

    conn.close()
    return results


def get_experiment_details(experiment_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves full details for a single experiment including all runs and measurements."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM experiments WHERE experiment_id = ?", (experiment_id,))
    exp_row = cursor.fetchone()
    if not exp_row:
        conn.close()
        return None

    experiment = dict(exp_row)

    cursor.execute("""
    SELECT 
        r.run_id,
        r.machine_info,
        r.repetitions,
        r.timestamp,
        c.algorithm,
        c.parameter_set,
        c.library_version
    FROM benchmark_runs r
    JOIN algorithm_configurations c ON r.configuration_id = c.configuration_id
    WHERE r.experiment_id = ?
    ORDER BY r.timestamp DESC
    """, (experiment_id,))

    runs = []
    for r_row in cursor.fetchall():
        run_data = dict(r_row)
        cursor.execute(
            "SELECT measurement_id, operation, duration_ms, output_size_bytes FROM benchmark_measurements WHERE run_id = ?",
            (run_data["run_id"],)
        )
        run_data["measurements"] = [dict(m) for m in cursor.fetchall()]
        runs.append(run_data)

    experiment["runs"] = runs
    conn.close()
    return experiment


def delete_experiment(experiment_id: str) -> bool:
    """Deletes an experiment and all cascaded runs and measurements."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM experiments WHERE experiment_id = ?", (experiment_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def export_all_records_as_rows() -> List[Dict[str, Any]]:
    """Exports all benchmark measurements joined with run, experiment, and configuration metadata."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        e.experiment_id,
        e.name AS experiment_name,
        e.created_at AS experiment_created_at,
        r.run_id,
        r.timestamp AS run_timestamp,
        r.repetitions,
        r.machine_info,
        c.algorithm,
        c.parameter_set,
        c.library_version,
        m.measurement_id,
        m.operation,
        m.duration_ms,
        m.output_size_bytes
    FROM benchmark_measurements m
    JOIN benchmark_runs r ON m.run_id = r.run_id
    JOIN experiments e ON r.experiment_id = e.experiment_id
    JOIN algorithm_configurations c ON r.configuration_id = c.configuration_id
    ORDER BY r.timestamp DESC, m.operation ASC
    """)

    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows


# Automatically initialize schema on module load
init_database()
