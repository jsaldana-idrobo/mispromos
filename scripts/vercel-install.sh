#!/usr/bin/env bash
set -e

APP="${1:-}"
if [[ -z "$APP" ]]; then
  echo "missing app name" >&2
  exit 1
fi

ROOT="."
if [[ ! -f "pnpm-workspace.yaml" && -f "../../pnpm-workspace.yaml" ]]; then
  ROOT="../.."
fi

if [[ -d "$ROOT/apps/$APP" ]]; then
  rm -rf "$ROOT/node_modules" "$ROOT/apps/api/node_modules" "$ROOT/apps/web/node_modules" "$ROOT/packages/shared/node_modules"
  pnpm -C "$ROOT" install --filter "@mispromos/$APP..." --filter "@mispromos/shared..."
else
  rm -rf node_modules "../packages/shared/node_modules"
  pnpm install
fi
