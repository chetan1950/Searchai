@echo off
title SearchLab AI - React Vite Frontend
set "PATH=C:\Program Files\nodejs;%PATH%"
echo ========================================================
echo Starting SearchLab AI Frontend (Vite Dev Server)
echo Port: http://localhost:5173
echo ========================================================
cd /d "%~dp0frontend"
if exist "C:\Program Files\nodejs\npm.cmd" (
    "C:\Program Files\nodejs\npm.cmd" run dev
) else (
    npm run dev
)
pause
