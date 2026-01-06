#!/usr/bin/env bash
set -e

APP="${1:-}"
if [ -z "$APP" ]; then
  echo "missing app name" >&2
  exit 1
fi

if [ -d "apps/$APP" ]; then
  rm -rf node_modules "apps/api/node_modules" "apps/web/node_modules" "packages/shared/node_modules"
  pnpm install --filter "@mispromos/$APP..." --filter "@mispromos/shared..."
else
  rm -rf node_modules "../packages/shared/node_modules"
  pnpm install
fi
