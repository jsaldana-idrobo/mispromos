#!/usr/bin/env bash
set -e

APP="${1:-}"
if [[ -z "$APP" ]]; then
  echo "missing app name" >&2
  exit 1
fi

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR="${VERCEL_GIT_COMMIT_SHA:-}"
if [[ -z "$PREV" || -z "$CURR" ]]; then
  if git rev-parse HEAD^ >/dev/null 2>&1; then
    PREV="HEAD^"
    CURR="HEAD"
  else
    exit 1
  fi
fi
if ! git cat-file -e "$PREV"^{commit} >/dev/null 2>&1; then
  exit 1
fi
if ! git cat-file -e "$CURR"^{commit} >/dev/null 2>&1; then
  exit 1
fi

if [[ -d "apps/$APP" ]]; then
  git diff --quiet "$PREV" "$CURR" -- "apps/$APP" "packages/shared" "pnpm-lock.yaml" "package.json"
else
  git diff --quiet "$PREV" "$CURR" -- "." "../../packages/shared" "../../pnpm-lock.yaml" "../../package.json"
fi
