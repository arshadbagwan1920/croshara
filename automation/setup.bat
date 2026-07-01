@echo off
title CROSHARA Auto-Poster Setup
echo ============================================
echo  CROSHARA Instagram Auto-Poster Setup
echo  One-time setup - takes 2 minutes
echo ============================================
echo.

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found! Please install Python from:
    echo https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH"
    pause
    exit /b
)
echo Python found!

echo [2/4] Installing required packages...
python -m pip install --upgrade pip -q
python -m pip install instagrapi Pillow cairosvg schedule playwright -q
python -m playwright install chromium 2>&1 | findstr /V "already"
echo Packages installed!

echo [3/4] Creating content folders...
set CONTENT_DIR=%~dp0content
if not exist "%CONTENT_DIR%" mkdir "%CONTENT_DIR%"
echo Content folders ready!

echo [4/4] Setting up Windows Task Scheduler...
set SCRIPT_DIR=%~dp0
set TASK_NAME=CROSHARA_Daily_Poster
schtasks /query /tn %TASK_NAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo Task already exists. Updating...
    schtasks /delete /tn %TASK_NAME% /f >nul
)
schtasks /create /tn %TASK_NAME% /tr "\"python %SCRIPT_DIR%croshara_poster.py\"" /sc daily /st 10:00 /f >nul
echo Task scheduled! Runs daily at 10:00 AM

echo.
echo ============================================
echo  ✅ Setup Complete!
echo ============================================
echo.
echo Next steps:
echo  1. Place your images/videos in:
echo     %CONTENT_DIR%\01-launch\image.jpg
echo     %CONTENT_DIR%\02-products\image.jpg
echo     (one image per folder)
echo.
echo  2. Run run_daily.bat to test:
echo     Double-click run_daily.bat
echo.
echo  3. First run will ask for Instagram login
echo     (saved locally, never shared)
echo.
echo  Daily posting starts automatically at 10 AM!
echo.
pause
