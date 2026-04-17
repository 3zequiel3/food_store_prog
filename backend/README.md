# TP3 Backend

Backend realizado con FastAPI y SQLModel para el trabajo practico de Programacion III.

## Requisitos

- Python 3.11 o superior
- MySQL disponible con las credenciales configuradas en `.env`

## Instalacion

1. Crear entorno virtual.
2. Instalar dependencias con `pip install -r requirements.txt`.
3. Ajustar las variables del archivo `.env`.

## Ejecucion

Desde la carpeta `backend`, ejecutar:

`python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001`

## Endpoints principales

- `GET /categorias`
- `POST /categorias`
- `GET /categorias/{id}`
- `PUT /categorias/{id}`
- `DELETE /categorias/{id}`
- `GET /productos`
- `POST /productos`
- `GET /productos/{id}`
- `PUT /productos/{id}`
- `DELETE /productos/{id}`
- `POST /productos/{producto_id}/categorias/{categoria_id}`
- `DELETE /productos/{producto_id}/categorias/{categoria_id}`

## REST Client

Se incluye el archivo `productos.http` para demostrar el CRUD de productos y la relacion producto-categoria.