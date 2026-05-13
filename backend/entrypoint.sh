#!/usr/bin/env bash
set -e

echo "[entrypoint] Running database migrations..."
python manage.py migrate --noinput

echo "[entrypoint] Collecting static files..."
python manage.py collectstatic --noinput || true

echo "[entrypoint] Launching application..."
exec "$@"
