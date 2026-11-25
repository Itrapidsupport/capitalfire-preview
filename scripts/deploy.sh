#!/usr/bin/env bash
# Build + deploy to GitHub Pages: https://itrapidsupport.github.io/capitalfire-preview/
#   main     = app source (this folder, minus node_modules/dist/qa output)
#   gh-pages = built dist/ (Pages source)
# Token: $GH_TOKEN, else GITHUB_TOKEN from ~/openclaw-import/workspace/.env (never printed). PREVIEW ONLY.
set -euo pipefail
APP="$(cd "$(dirname "$0")/.." && pwd)"
REPO=Itrapidsupport/capitalfire-preview
TOKEN=${GH_TOKEN:-$(grep -E '^GITHUB_TOKEN=' ~/openclaw-import/workspace/.env | head -1 | cut -d= -f2- | tr -d '"'"'"' ')}
URL="https://x-access-token:${TOKEN}@github.com/${REPO}.git"
WORK=${DEPLOY_DIR:-$HOME/.hermes/cache/scratch/capitalfire-preview-deploy}
MSG=${1:-"preview build $(date '+%Y-%m-%d %H:%M %Z')"}

cd "$APP"
[ "${SKIP_BUILD:-}" = 1 ] || npm run build
grep -q 'noindex' dist/index.html || { echo "noindex missing"; exit 1; }
BIG=$(find dist -type f -size +10M); [ -z "$BIG" ] || { echo "files >10MB: $BIG"; exit 1; }

git_id() { git -c user.name="IT Rapid Support previews" -c user.email="itrapidsupport-previews@users.noreply.github.com" "$@"; }

SRC="$WORK/src"; rm -rf "$SRC"; mkdir -p "$SRC"
rsync -a --exclude node_modules --exclude dist --exclude dist-ssr --exclude qa/out --exclude .git "$APP/" "$SRC/"
cd "$SRC"; git init -q -b main; git add -A; git_id commit -qm "$MSG"; git push -q -f "$URL" main 2>&1 | sed "s/${TOKEN}/***/g"

PAGES="$WORK/pages"; rm -rf "$PAGES"; mkdir -p "$PAGES"
rsync -a "$APP/dist/" "$PAGES/"
cd "$PAGES"; git init -q -b gh-pages; git add -A; git_id commit -qm "$MSG"; git push -q -f "$URL" gh-pages 2>&1 | sed "s/${TOKEN}/***/g"
echo "pushed main + gh-pages to $REPO ($(git rev-parse --short HEAD))"
