# 🛒 Rgamer-Store — Plataforma E-commerce con Django + Next.js  
**Proyecto académico y profesional de venta de hardware retro, reciclaje tecnológico y e-commerce moderno**

---

## 📌 Descripción general

**Rgamer-Store** es una plataforma de comercio electrónico desarrollada con **Django (backend/API)** y **Next.js (frontend)** que permite:

- Venta de hardware retro y moderno.
- Gestión de productos con variantes (precio, peso, atributos, etc.).
- Carrito de compras persistente (sesiones anónimas y usuarios).
- Sistema de checkout con órdenes registradas en backend.
- Módulo de reciclaje tecnológico (RAEE) con formulario especializado.
- Panel administrativo completo gracias a Django Admin.
- Integración con modelos 3D (GLB) para visualización interactiva de productos.
- Despliegue configurable en servidor propio con Nginx, Gunicorn y PostgreSQL.

Este proyecto forma parte del desarrollo académico (INACAP) y es también un sistema real utilizado por **Rgamer-Store.cl**, negocio de venta y reciclaje tecnológico.

---

## 🧱 Tecnologías principales

### 🖥️ **Backend (API)**
- Python 3.12
- Django 5
- Django REST Framework (DRF)
- PostgreSQL
- Gunicorn
- Sessions API para carrito persistente

### 🎨 **Frontend**
- Next.js 14 (App Router)
- TypeScript
- Zustand (carrito de compras)
- React Three Fiber / Three.js (modelos 3D)
- TailwindCSS

### 🔧 **Infraestructura**
- Nginx (reverse proxy)
- Servidor Linux (Ubuntu / Linux Mint)
- Certbot + SSL
- Staticfiles + media root

---

## 📦 Funcionalidades destacadas

### 🛒 **Carrito de compras**
- Se mantiene aunque el usuario no inicie sesión.
- Sincronizado automáticamente con la API a través de session key.
- Aumentar, disminuir y eliminar productos.
- Cálculo de total en CLP.
- Manejo de stock por variante.

### 📝 **Checkout**
- Envío de datos del cliente.
- Registro automático de orden en Django Admin.
- Preparado para integrar pasarela de pago (WebPay u otra).

### ♻️ **Sistema de reciclaje**
- Formulario dedicado a RAEE.
- Los datos se guardan en la base de datos.
- Se visualizan en Django Admin.

### 🛠️ **Panel administrativo**
- Administrador de productos, categorías, variantes.
- Gestión de imágenes, modelos 3D y stock.
- Vista ordenada para órdenes y solicitudes de reciclaje.

### 🧩 **Modelos 3D**
Ejemplos funcionando:
- Motherboard AM4
- Tarjeta 3dfx Voodoo Graphics

---

## 🗃️ Estructura del proyecto

webapp/
│
├── web/ # Proyecto Django
│ ├── apps/ # Apps (shop, index, user…)
│ ├── templates/ # Plantillas Django
│ ├── staticfiles/ # Archivos estáticos generados
│ ├── media/ # Imágenes y modelos 3D
│ ├── web/ # Configuración Django
│ └── manage.py
│
├── frontend/ (opcional) # Si existe Next.js fuera del backend
│
└── README.md


---

## ⚙️ Instalación local (Backend)

```bash
git clone https://github.com/roiwow7-maker/webapp.git
cd webapp

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

# Migraciones
python manage.py migrate

# Crear superusuario opcional
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver

⚙️ Instalación local (Frontend)
cd frontend   # si tu frontend está en carpeta aparte
npm install
npm run dev

🚀 Despliegue en producción
Nginx (ejemplo)
server {
    server_name rgamer-store.cl www.rgamer-store.cl;

    location /static/ {
        alias /ruta/web/staticfiles/;
    }

    location /media/ {
        alias /ruta/web/media/;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}

Gunicorn
gunicorn web.wsgi:application --bind 127.0.0.1:8000

Collectstatic
python manage.py collectstatic

📌 Variables de entorno sugeridas
SECRET_KEY=...
DEBUG=False
ALLOWED_HOSTS=rgamer-store.cl, www.rgamer-store.cl
DATABASE_URL=postgres://usuario:pass@localhost:5432/rgamerstore

📷 Capturas (agregar)

Puedes incluir:

Pantalla principal (catálogo)

Carrito de compras

Vista 3D

Formulario de reciclaje

Checkout

Django Admin

👤 Autor

Roy Zaio (roiwow7-maker)
Proyecto académico y real para negocio Rgamer-Store.cl
INACAP — Proyecto de Título y Evaluación de Proyectos 2025



---

# 🚀 ¿Quieres que lo haga MÁS PRO aún?
Puedo agregar:

✔ Badges (Build passing, Python version, Next.js version)  
✔ Instrucciones de API con ejemplos reales  
✔ Vista previa GIF del carrito y 3D  
✔ Tabla de endpoints  
✔ Diagrama de arquitectura en ASCII  
✔ Créditos y referencias académicas  


