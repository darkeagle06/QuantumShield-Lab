"""API routes for Experiment History and Benchmark Persistence."""
import csv
import io
import json
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field

from ..db.database import (
    create_experiment,
    record_benchmark_run,
    list_experiments,
    get_experiment_details,
    delete_experiment,
    export_all_records_as_rows,
)

router = APIRouter(prefix="/experiments", tags=["Experiments & Persistence"])


class MeasurementInput(BaseModel):
    operation: str
    duration_ms: float
    output_size_bytes: Optional[int] = None


class RunInput(BaseModel):
    algorithm: str
    parameter_set: str
    library_version: str = "Genuine NIST FIPS"
    machine_info: str = "Host CPU"
    repetitions: int = 10
    measurements: List[MeasurementInput]


class CreateExperimentRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: Optional[str] = ""
    runs: Optional[List[RunInput]] = []


class RecordRunRequest(BaseModel):
    experiment_id: str
    algorithm: str
    parameter_set: str
    library_version: str = "Genuine NIST FIPS"
    machine_info: str = "Host CPU"
    repetitions: int = 10
    measurements: List[MeasurementInput]


@router.get("")
def get_all_experiments():
    """Returns all saved experiments with aggregated metadata."""
    return {"experiments": list_experiments()}


@router.post("")
def add_experiment(req: CreateExperimentRequest):
    """Creates a new experiment and optionally attaches benchmark runs."""
    exp = create_experiment(req.name, req.description)
    exp_id = exp["experiment_id"]

    created_runs = []
    if req.runs:
        for r in req.runs:
            meas_dicts = [m.model_dump() for m in r.measurements]
            run_record = record_benchmark_run(
                experiment_id=exp_id,
                algorithm=r.algorithm,
                parameter_set=r.parameter_set,
                library_version=r.library_version,
                machine_info=r.machine_info,
                repetitions=r.repetitions,
                measurements=meas_dicts
            )
            created_runs.append(run_record)

    return {
        "status": "created",
        "experiment": exp,
        "runs": created_runs
    }


@router.post("/runs")
def add_benchmark_run(req: RecordRunRequest):
    """Attaches a benchmark run to an existing experiment."""
    exp = get_experiment_details(req.experiment_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Experiment with ID '{req.experiment_id}' not found.")

    meas_dicts = [m.model_dump() for m in req.measurements]
    run_record = record_benchmark_run(
        experiment_id=req.experiment_id,
        algorithm=req.algorithm,
        parameter_set=req.parameter_set,
        library_version=req.library_version,
        machine_info=req.machine_info,
        repetitions=req.repetitions,
        measurements=meas_dicts
    )
    return {
        "status": "recorded",
        "run": run_record
    }


@router.get("/export/csv")
def export_csv():
    """Generates and downloads a CSV of all recorded benchmark measurements with metadata."""
    rows = export_all_records_as_rows()
    output = io.StringIO()
    writer = csv.writer(output)

    headers = [
        "Experiment ID",
        "Experiment Name",
        "Created At",
        "Run ID",
        "Run Timestamp",
        "Repetitions",
        "Machine Info",
        "Algorithm",
        "Parameter Set",
        "Library Version",
        "Measurement ID",
        "Operation",
        "Duration (ms)",
        "Output Size (Bytes)"
    ]
    writer.writerow(headers)

    for r in rows:
        writer.writerow([
            r.get("experiment_id", ""),
            r.get("experiment_name", ""),
            r.get("experiment_created_at", ""),
            r.get("run_id", ""),
            r.get("run_timestamp", ""),
            r.get("repetitions", ""),
            r.get("machine_info", ""),
            r.get("algorithm", ""),
            r.get("parameter_set", ""),
            r.get("library_version", ""),
            r.get("measurement_id", ""),
            r.get("operation", ""),
            r.get("duration_ms", ""),
            r.get("output_size_bytes", "")
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=quantumshield_experiments.csv"
        }
    )


@router.get("/export/json")
def export_json():
    """Generates and downloads full structured JSON of all experiments and runs."""
    all_exps = list_experiments()
    full_data = []
    for e in all_exps:
        det = get_experiment_details(e["experiment_id"])
        if det:
            full_data.append(det)

    return Response(
        content=json.dumps(full_data, indent=2),
        media_type="application/json",
        headers={
            "Content-Disposition": "attachment; filename=quantumshield_experiments.json"
        }
    )


@router.get("/stats/summary")
def get_stats_summary():
    """Returns high-level statistics across all benchmark runs for dashboard widgets."""
    rows = export_all_records_as_rows()
    total_measurements = len(rows)
    algorithms_tested = sorted(list(set(r["algorithm"] for r in rows if r.get("algorithm"))))
    experiments = list_experiments()

    return {
        "total_experiments": len(experiments),
        "total_measurements": total_measurements,
        "algorithms_tested": algorithms_tested,
    }


@router.get("/{experiment_id}")
def get_single_experiment(experiment_id: str):
    """Retrieves full details of a specific experiment."""
    exp = get_experiment_details(experiment_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Experiment '{experiment_id}' not found.")
    return exp


@router.delete("/{experiment_id}")
def remove_experiment(experiment_id: str):
    """Deletes an experiment and its associated runs."""
    deleted = delete_experiment(experiment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Experiment '{experiment_id}' not found.")
    return {"status": "deleted", "experiment_id": experiment_id}
