#!/bin/bash
set -euo pipefail

echo "Checking..."
npm run check
echo "Building..."
npm run build

echo "Build complete. Push the main branch to let GitHub Actions deploy Pages."
