#!/usr/bin/env bash
set -e

echo "=== BACKEND: creando entorno virtual (.venv) con Python 3.12 ==="
python3.12 -m venv .venv

echo "=== Activando entorno ==="
source .venv/bin/activate

echo "=== Actualizando pip ==="
pip install --upgrade pip

echo "=== Instalando dependencias desde requirements.txt ==="
pip install -r requirements.txt

echo "=== Aplicando migraciones ==="
python manage.py migrate

echo "=== (Opcional) Colectando estáticos ==="
python manage.py collectstatic --noinput || echo "collectstatic falló (normal si estás en dev)"

echo "=== Listo. Para correr el backend: ==="
echo "cd web && source .venv/bin/activate && python manage.py runserver 0.0.0.0:8000"

