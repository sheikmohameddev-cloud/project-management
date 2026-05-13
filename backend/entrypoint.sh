#!/usr/bin/env bash
set -e

echo "[entrypoint] Running database migrations..."
python manage.py migrate --noinput

echo "[entrypoint] Creating superuser if env vars are provided..."
python manage.py createsuperuser --noinput || true

echo "[entrypoint] Collecting static files..."
python manage.py collectstatic --noinput || true

echo "[entrypoint] Launching application..."
exec "$@"
