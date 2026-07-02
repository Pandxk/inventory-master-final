# Inventory Master API & Frontend

Este es un sistema completo de inventario que cuenta con una API en **Node.js/Express** conectada a una base de datos **PostgreSQL**, y una interfaz de usuario desarrollada en **React + Vite**.

## 🚀 Arquitectura del Proyecto

* **Frontend:** React + Vite (ubicado en `fronend/vite-project`)
* **Backend:** Node.js + Express (ubicado en `herramientas-node-api`)
* **Base de Datos:** PostgreSQL

## 💻 Entorno Local (Desarrollo)

Tienes dos opciones para ejecutar este proyecto en tu computadora:

### Opción 1: Usando Docker (Recomendado)
Levanta todos los servicios (Base de Datos, Backend y Frontend) con un solo comando. Debes estar en la carpeta raíz del proyecto.
```bash
docker compose up -d
```
* **Frontend:** Disponible en `http://localhost:80`
* **Backend:** Disponible en `http://localhost:3000`

### Opción 2: Ejecución Manual
Ideal si quieres ver los logs directamente o desarrollar sin contenedores para el código fuente (requiere tener Node.js instalado).

**1. Levantar el Backend:**
```bash
cd herramientas-node-api
npm install
npm run dev
```

**2. Levantar el Frontend (en otra terminal):**
```bash
cd fronend/vite-project
npm install
npm run dev
```

---

## 🌍 Despliegue en Producción (Cloud)

Este proyecto está diseñado para ser desplegado en una arquitectura dividida:

### 1. Backend y Base de Datos (Ubuntu VPS)
El backend y la base de datos se alojan juntos en un servidor privado (VPS) usando el archivo optimizado `docker-compose.prod.yml`.

**Pasos en la VPS:**
1. Instalar Docker y Docker Compose en Ubuntu.
2. Clonar este repositorio.
3. Crear un archivo `.env` en la raíz con las credenciales de la base de datos.
4. Ejecutar el entorno de producción:
```bash
docker compose -f docker-compose.prod.yml up -d
```
Esto levantará PostgreSQL y el Backend en el puerto 3000.

### 2. Frontend (Vercel)
El frontend se sube a **Vercel** gratuitamente.
* Se debe conectar el repositorio de GitHub a Vercel.
* **Root Directory:** `fronend/vite-project`
* En Vercel, configurar la variable de entorno `VITE_API_URL` apuntando a la IP de tu VPS:
  `VITE_API_URL = http://<IP_DE_TU_VPS>:3000/api`
