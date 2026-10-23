"""Benchmark Studio endpoints."""
from fastapi import APIRouter
from ..benchmarks.runner import run_benchmark
from ..schemas.crypto_schemas import BenchmarkRunRequest

router = APIRouter(prefix="/benchmarks", tags=["Benchmarks"])


@router.post("/run")
def benchmark_run(request: BenchmarkRunRequest):
    """Executes a controlled benchmark run with repeated measurements and warmups."""
    return run_benchmark(
        algorithm_name=request.algorithm,
        operation_type=request.operation,
        repetitions=request.repetitions,
        warmups=request.warmups
    )
