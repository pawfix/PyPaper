@echo off

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Create virtual environment
python -m venv .venv

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install Python dependencies
pip install -r requirements.txt

echo Installation complete. Run '.venv\Scripts\activate.bat' to activate the environment.
pause