@echo off
title SearchLab AI - Launcher
set "PATH=C:\Users\cheta\AppData\Local\Programs\Python\Python315;C:\Users\cheta\AppData\Local\Programs\Python\Python315\Scripts;C:\Python315;C:\Program Files\nodejs;%PATH%"
echo ========================================================
echo Launching SearchLab AI (Backend & Frontend)
echo ========================================================
cd /d "%~dp0"
start "SearchLab AI - Backend" cmd /c "call run_backend.bat"
timeout /t 3 /nobreak > nul
start "SearchLab AI - Frontend" cmd /c "call run_frontend.bat"
echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo.
pause
