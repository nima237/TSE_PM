@echo off
chcp 65001 >nul
cd /d "%~dp0"
git status
git add .
git commit -m "Fix vertical alignment of icons and text in info cards"
git remote -v
if %errorlevel% neq 0 (
    echo.
    echo Please add your GitHub repository URL:
    echo git remote add origin https://github.com/nima237/TSE_PM.git
    echo.
    pause
    exit /b
)
git branch -M main
git push -u origin main
pause

