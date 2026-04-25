# Food Store

Aplicación fullstack para gestionar el catálogo de una tienda de comida: categorías jerárquicas, productos con múltiples imágenes e ingredientes, validaciones de dominio y CRUD completo.

Proyecto integrador del primer parcial de **Programación 4** — Tecnicatura Universitaria en Programación a Distancia.

## 🎥 Video de presentación

🔗 **[LINK AL VIDEO AQUÍ]**

## 🧰 Stack

**Backend**
- FastAPI + SQLModel
- PostgreSQL 18 (en Docker)
- psycopg 3 como driver
- Arquitectura por capas: Router → Service → UnitOfWork → Repository → Model

**Frontend**
- React 19 + TypeScript + Vite
- Tailwind CSS 4
- TanStack Query (server state + cache)
- TanStack Table (tablas con paginación y sort)
- TanStack Form (formularios tipados)
- React Router (navegación con rutas dinámicas)
- react-select (multi-select con estilos consistentes)

## 🏗️ Arquitectura

### Backend
Cada módulo de dominio (`categoria`, `producto`, `ingrediente`) tiene:
- `models.py` — modelo SQLModel.
- `schemas.py` — DTOs Pydantic (Create, Update, Read).
- `repository.py` — queries tipadas.
- `service.py` — reglas de negocio.
- `unit_of_work.py` — transacción + repositories.
- `router.py` — endpoints FastAPI.
- `exceptions.py` — excepciones de dominio.

`app/core/` contiene el `BaseModel`, `BaseRepository`, `UnitOfWork` base, configuración de DB y excepciones compartidas.

### Frontend
Separación por responsabilidad:
- `types/` — contratos de datos.
- `api/` — cliente HTTP + funciones por dominio.
- `hooks/` — `useProductos`, `useCategorias`, `useIngredientes`, `useAdminCrudState`, `useTableFilters`.
- `components/ui/` — primitivos reusables (`Button`, `Table`, `Modal`, `Select`, `Form`).
- `components/admin/` — features específicas por dominio.
- `pages/admin/` — páginas con orquestación.

## 🔑 Reglas de negocio implementadas

1. **Los productos solo pueden asociarse a subcategorías** (categorías con `parent_id != null`). Las raíces son agrupadores semánticos para navegación.
2. **Un producto debe tener al menos una categoría y un ingrediente** al momento de crearse — validación atómica en el service, enforzada en el backend.
3. **Soft delete**: los `delete` no borran físicamente; marcan `deleted_at`. Los listados filtran automáticamente.
4. **Validación de ciclos** en la jerarquía de categorías: una categoría no puede ser su propio ancestro (ni directo ni indirecto).
5. **Nombres únicos** en Categoría e Ingrediente — violaciones devuelven 422 con mensaje claro.

## 🚀 Cómo correr localmente

### 1. Base de datos

```bash
docker run -d \
  --name EzePDB \
  -e POSTGRES_USER=ezequiel \
  -e POSTGRES_PASSWORD=ezequiel \
  -e POSTGRES_DB=food_store \
  -p 510:5432 \
  -v ezepdb_data:/var/lib/postgresql \
  postgres:18-alpine
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configurá el .env con las credenciales del contenedor:
# DB_USER=ezequiel
# DB_PASSWORD=ezequiel
# DB_HOST=localhost
# DB_PORT=510
# DB_NAME=food_store
# DB_ECHO=false

uvicorn app.main:app --reload --port 8003
```

El backend arranca en `http://localhost:8003`. La primera vez crea las tablas automáticamente con `create_db_and_tables()`.

Documentación interactiva (Swagger) en `http://localhost:8003/docs`.

### 3. Frontend

```bash
cd frontend
pnpm install

# Configurá el .env (copialo de .env.example):
# VITE_API_BASE_URL=http://localhost:8003

pnpm dev
```

La app corre en el puerto que indique Vite (por defecto `5173`).

## ✅ Checklist del TP

Ver [CHECKLIST.md](./CHECKLIST.md) para el cumplimiento punto por punto.


## 🗂️ Estructura del repositorio

```
food_store/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── modules/
│   │   │   ├── categoria/
│   │   │   ├── ingrediente/
│   │   │   └── producto/
│   │   └── main.py
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types/
│   ├── .env
│   └── package.json
├── docs/
│   └── GUION_VIDEO.md
├── CHECKLIST.md
├── README.md
└── Makefile
```
