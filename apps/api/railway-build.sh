#!/bin/bash
set -e

# Build shared-types first
echo "Building shared-types..."
npm run build --workspace @chaos-merge/shared-types

# Then build the API
echo "Building API..."
npm run build --workspace @chaos-merge/api

