@echo off
title QuantumShield Lab - FastAPI Backend (Port 8000)
cd /d "%~dp0"

echo ======================================================================
echo   QuantumShield Lab - Discrete Mathematics ^& Cryptography
echo   Backend Service (FastAPI + Uvicorn)
echo ======================================================================
echo Directory : %CD%
echo Host      : 127.0.0.1:8000
echo Swagger UI: http://localhost:8000/docs
echo ReDoc     : http://localhost:8000/redoc
echo Health    : http://localhost:8000/api/health
echo ======================================================================
echo.

:: Detect virtual environment if present
if exist ".venv\Scripts\activate.bat" (
    echo [*] Activating virtual environment (.venv)...
    call .venv\Scripts\activate.bat
) else if exist "venv\Scripts\activate.bat" (
    echo [*] Activating virtual environment (venv)...
    call venv\Scripts\activate.bat
)

:: Verify python is installed
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python was not found in your PATH.
    echo Please install Python 3.10+ and check "Add Python to PATH".
    pause
    exit /b 1
)

:: Check if required packages are installed
python -c "import fastapi, uvicorn, sympy, numpy, cryptography" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [*] Installing required Python dependencies from requirements.txt...
    python -m pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
)

echo [*] Starting FastAPI server on http://127.0.0.1:8000 with auto-reload...
echo [*] Press Ctrl+C to stop the server.
echo.

python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] FastAPI backend process exited unexpectedly (Exit Code: %ERRORLEVEL%).
    pause
)
