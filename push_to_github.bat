@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Checking git status...
git status
echo.
echo Adding all files...
git add .
echo.
echo Committing changes...
git commit -m "Fix vertical alignment of icons and text in info cards"
echo.
echo Checking remote configuration...
git remote -v
echo.
echo Setting branch to main...
git branch -M main
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo Done!
pause

