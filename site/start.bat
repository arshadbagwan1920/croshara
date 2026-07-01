@echo off
title CROSHARA — Live Server
cd /d "%~dp0"
echo.
echo   ^<^<^< CROSHARA — Live Storefront ^>^>^>
echo.
echo   Opening in your browser...
echo   Press Ctrl+C to stop the server
echo.
start http://localhost:3000
node server.js
pause
