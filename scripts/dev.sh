#!/usr/bin/env bash

# Simple dev helper to run API and Web dev servers together.
# Usage: ./scripts/dev.sh

set -e

# Start API
npm run dev:api &

API_PID=$!

# Start Web
npm run dev:web &

WEB_PID=$!

# On Ctrl+C, kill both
trap "kill $API_PID $WEB_PID 2>/dev/null" INT

wait
