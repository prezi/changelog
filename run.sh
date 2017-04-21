#!/bin/bash

# Unofficial Bash strict mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

tweakables=(ALCHEMY_URL LISTEN_HOST LISTEN_PORT USE_SENTRY SENTRY_DSN)
export CHANGELOG_SETTINGS_PATH="${CHANGELOG_SETTINGS_PATH:-./custom_settings.py}"

is_tweakable_raw()
{
    test "$1" = 'USE_SENTRY'
}

for tweakable in "${tweakables[@]}"; do
    value="${!tweakable:-}"
    test -z "$value" && continue
    is_tweakable_raw "$tweakable" || value="'$value'"
    echo "$tweakable = $value"
done > "$CHANGELOG_SETTINGS_PATH"

gunicorn_worker_count="${GUNICORN_WORKER_COUNT:-2}"
listen_host="${LISTEN_HOST:-0.0.0.0}"
listen_port="${LISTEN_PORT:-5000}"

echo "Starting gunicorn with ${gunicorn_worker_count} workers, listening on ${listen_host}:${listen_port}"

exec ./virtualenv/bin/gunicorn -w "${GUNICORN_WORKER_COUNT:-2}" -k gevent -b "${LISTEN_HOST:-0.0.0.0}:${LISTEN_PORT:-5000}" application:app
