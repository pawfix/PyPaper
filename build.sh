#!/usr/bin/env bash

if ! command -v pyinstaller >/dev/null 2>&1; then
    echo "PyInstaller is not installed."
    echo "Run the install script first."
    exit 1
fi

echo "PyInstaller found: $(command -v pyinstaller)"
echo "Starting builds..."

pwd


echo "Building OneDir"
pyinstaller --clean --distpath ./dist/OneDir/ spec/OneDir.spec
echo "===================="
echo "Done Building OneDir"
echo "===================="

pyinstaller --clean --distpath ./dist/OneFile spec/OneFile.spec
echo "===================="
echo "Done Building OneFile"
echo "===================="


echo "Build complete."
ls ./dist/
