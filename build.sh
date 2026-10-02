#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=== [1/2] Building React frontend (production bundle) ==="
cd frontend
npm install
npm run build
cd ..

echo "=== [2/2] Installing backend Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Build completed successfully! ==="
