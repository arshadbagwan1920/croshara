@echo off
title CROSHARA Instagram Auto-Poster
cd /d "%~dp0"
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
echo ====================================
echo  CROSHARA Daily Poster
echo  Starting at %date% %time%
echo ====================================
echo.
python croshara_poster.py
if %errorlevel% neq 0 (
    echo.
    echo Error occurred. Check croshara_bot.log
    pause
)
pause
