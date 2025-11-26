#!/usr/bin/env bash

# Build both web and api apps.
# Usage: ./scripts/build.sh

set -e

npm run build --workspace @chaos-merge/web
npm run build --workspace @chaos-merge/api

echo "✅ Build completed for web and api."
