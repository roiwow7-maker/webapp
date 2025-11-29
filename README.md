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

