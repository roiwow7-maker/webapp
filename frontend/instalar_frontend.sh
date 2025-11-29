#!/usr/bin/env bash
set -e

echo "=== FRONTEND: instalando dependencias de Node (desde package.json) ==="
npm install

echo "=== Construyendo proyecto en modo producción ==="
npm run build

echo "=== Listo. Para desarrollarlo: npm run dev ==="
echo "=== Para producción: npm start (si lo configuraste) ==="

