@echo off
title QuantumShield Lab - Server Stopper
cd /d "%~dp0"

echo ======================================================================
echo   QUANTUMSHIELD LAB - STOP ALL SERVERS
echo ======================================================================
echo.

echo [*] Checking for processes on port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    echo [*] Terminating Backend process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Checking for processes on port 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo [*] Terminating Frontend process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ======================================================================
echo   Ports 8000 and 3000 have been released.
echo   Servers stopped successfully.
echo ======================================================================
echo.
pause
