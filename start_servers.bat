@echo off
title QuantumShield Lab - Unified Launcher
cd /d "%~dp0"

echo ======================================================================
echo   QUANTUMSHIELD LAB - COURSE PROJECT LAUNCHER
echo   Discrete Mathematics ^& Post-Quantum Cryptography
echo ======================================================================
echo.
echo Student Contributors : Shaurya · Shaunak · Soham · Shantnu
echo.
echo [1/2] Launching FastAPI Backend Server (Port 8000)...
start "QuantumShield - Backend (8000)" cmd /k "%~dp0start_backend.bat"

echo [2/2] Launching Next.js Frontend Server (Port 3000)...
start "QuantumShield - Frontend (3000)" cmd /k "%~dp0start_frontend.bat"

echo.
echo ======================================================================
echo   SERVICES LAUNCHED SUCCESSFULLY
echo ======================================================================
echo   * Main Web Application: http://localhost:3000
echo   * FastAPI REST API    : http://localhost:8000
echo   * Interactive API Docs: http://localhost:8000/docs
echo.
echo   FOUR PRIMARY COURSE SECTIONS:
echo     1. Home             : http://localhost:3000/
echo     2. Mathematics Lab  : http://localhost:3000/math-lab
echo     3. Cryptography Lab : http://localhost:3000/crypto-lab
echo     4. Experiments      : http://localhost:3000/experiments
echo.
echo   * To stop all running servers at any time, run: stop_servers.bat
echo   * To run the automated verification suite, run: run_tests.bat
echo ======================================================================
echo.
echo Waiting 4 seconds for servers to initialize before opening browser...
timeout /t 4 >nul

start http://localhost:3000

echo.
echo Launcher complete. Both servers are active in their respective windows.
echo (You can safely close this launcher window now.)
timeout /t 3 >nul
