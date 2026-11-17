@echo off
title SearchLab AI - FastAPI Backend Server
set "PATH=C:\Users\cheta\AppData\Local\Programs\Python\Python315;C:\Users\cheta\AppData\Local\Programs\Python\Python315\Scripts;C:\Python315;C:\Program Files\nodejs;%PATH%"
echo ========================================================
echo Starting SearchLab AI Backend Server (FastAPI + Uvicorn)
echo Port: http://127.0.0.1:8000
echo ========================================================
cd /d "%~dp0backend"
if exist "C:\Users\cheta\AppData\Local\Programs\Python\Python315\python.exe" (
    "C:\Users\cheta\AppData\Local\Programs\Python\Python315\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
) else (
    python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
)
pause
