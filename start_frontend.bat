@echo off
title QuantumShield Lab - Next.js Frontend (Port 3000)
cd /d "%~dp0frontend"

echo ======================================================================
echo   QuantumShield Lab - Discrete Mathematics ^& Cryptography
echo   Frontend Service (Next.js + TypeScript)
echo ======================================================================
echo Directory : %CD%
echo Web App   : http://localhost:3000
echo ======================================================================
echo.

:: Check for node / npm in PATH
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm was not found in your PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [*] 'node_modules' directory not found. Running npm install...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [*] Starting Next.js development server on http://localhost:3000...
echo [*] Press Ctrl+C to stop the server.
echo.

call npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Next.js dev server exited unexpectedly (Exit Code: %ERRORLEVEL%).
    pause
)
