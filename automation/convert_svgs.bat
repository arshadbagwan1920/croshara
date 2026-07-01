@echo off
title CROSHARA - SVG to PNG Converter
echo ====================================
echo   CROSHARA SVG to PNG Converter
echo ====================================
echo.
echo This script will convert SVG files to PNG for Instagram posting.
echo.
echo Option 1: Use the free online converter
echo   Go to: https://convertio.co/svg-png/
echo   Upload all SVGs from the content folders
echo   Download PNGs back to the same folders as "image.jpg"
echo.
echo Option 2: Use Inkscape (free)
echo   Download: https://inkscape.org/
echo   Then run:
echo.
setlocal enabledelayedexpansion
echo Processing SVG files in content folders...
echo.
for /d %%f in (content\*) do (
  if exist "%%f\*.svg" (
    echo [FOUND] %%f
    for %%s in (%%f\*.svg) do (
      echo   SVG: %%~nxs
    )
  )
)
echo.
echo ====================================
echo Folders with SVGs only (no photos):
echo   04-testimonial (post-review.svg)
echo   08-bts (post-28-bones.svg, post-bts.svg)
echo   09-gift (post-winter.svg, post-pediatrician.svg)
echo   10-care (post-mom-hack.svg)
echo   11-compare (post-comparison.svg)
echo   12-festival (post-unpopular.svg)
echo ====================================
echo.
echo Quick way: Open each SVG in Chrome, screenshot (Win+Shift+S), save as image.jpg
echo.
pause