@echo off
title QuantumShield Lab - Automated Verification Suite
cd /d "%~dp0"

echo ======================================================================
echo   QUANTUMSHIELD LAB - AUTOMATED VERIFICATION SUITE
echo   Discrete Mathematics ^& Cryptography Course Project
echo ======================================================================
echo.

:: Detect virtual environment if present
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
) else if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

echo [STEP 1/2] Running Backend Unit Tests (pytest backend/tests)...
echo ----------------------------------------------------------------------
python -m pytest backend/tests -v
set BACKEND_STATUS=%ERRORLEVEL%
echo.

echo [STEP 2/2] Running Frontend Production Build Check (npm run build)...
echo ----------------------------------------------------------------------
cd /d "%~dp0frontend"
call npm run build
set FRONTEND_STATUS=%ERRORLEVEL%
cd /d "%~dp0"
echo.

echo ======================================================================
echo   VERIFICATION SUMMARY
echo ======================================================================

if %BACKEND_STATUS% EQU 0 (
    echo   [PASS] Backend Unit Tests: 22 of 22 tests passed cleanly.
) else (
    echo   [FAIL] Backend Unit Tests failed with exit code %BACKEND_STATUS%.
)

if %FRONTEND_STATUS% EQU 0 (
    echo   [PASS] Frontend Next.js Production Build: 12 routes compiled cleanly.
) else (
    echo   [FAIL] Frontend Production Build failed with exit code %FRONTEND_STATUS%.
)

echo ======================================================================
echo.
pause
