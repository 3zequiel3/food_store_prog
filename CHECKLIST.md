# Lista de Verificación del Proyecto Integrador

## Backend (FastAPI + SQLModel)

- [x] **Entorno**: Uso de `.venv`, `requirements.txt` y FastAPI funcionando en modo dev.
- [x] **Modelado**: Tablas creadas con SQLModel incluyendo relaciones `Relationship`:
  - 1:N self-referential en `Categoria` (parent/subcategorias).
  - N:N entre `Producto` ↔ `Categoria` con `ProductoCategoriaLink`.
  - N:N entre `Producto` ↔ `Ingrediente` con `IngredienteProductoLink`.
- [x] **Validación**: Uso de `Annotated`, `Query` y `Path` para reglas de negocio:
  - `Path(gt=0)` en todos los path params de ID.
  - `Query(ge=0, le=100)` para paginación.
  - `Query(...)` con `Literal` para `sort_by` y `order`.
  - `Field(min_length, max_length, ge)` en todos los schemas.
- [x] **CRUD Persistente**: Endpoints funcionales para Crear, Leer, Actualizar y Borrar en PostgreSQL 18.
- [x] **Seguridad de Datos**: `response_model` en todos los endpoints (`ProductoRead`, `CategoriaRead`, `IngredienteRead`, `Page[T]`) — entrada y salida segregadas.
- [x] **Estructura**: Código organizado por módulos: `routers`, `schemas`, `services`, `models`, `repository`, `unit_of_work`, `exceptions`.

## Frontend (React + TypeScript + Tailwind)

- [x] **Setup**: Proyecto creado con Vite + TypeScript y estructura de carpetas limpia:
  - `types/` — interfaces de dominio.
  - `api/` — cliente HTTP con tipado genérico.
  - `hooks/` — TanStack Query hooks.
  - `components/ui/` — primitivos reusables.
  - `components/admin/` — componentes por dominio.
  - `pages/admin/` — páginas.
- [x] **Componentes**: Componentes funcionales con Props tipadas con `interface` (sin `any`).
- [x] **Estilos**: Interfaz construida con Tailwind CSS 4 (`^4.2.2`).
- [x] **Navegación**: `react-router-dom` con ruta dinámica `/admin/productos/:id` consumida con `useParams`.
- [x] **Estado Local**: `useState` para formularios, modales e interacciones; hook `useAdminCrudState<T>` para extraer el patrón CRUD admin.

## Integración y Server State

- [x] **Lectura (`useQuery`)**: Listados con paginación server-side y detalles individuales consumiendo datos reales de la API.
- [x] **Escritura (`useMutation`)**: Formularios que envían create/update/delete al backend.
- [x] **Sincronización**: `invalidateQueries` tras cada mutation para refrescar automáticamente la UI.
- [x] **Feedback**: Estados `isLoading` y `error` expuestos por los hooks y renderizados en la UI; mensajes de error del backend propagados al usuario.

## Video de Presentación

- [x] **Duración**: El video dura 15 minutos o menos.
- [x] **Audio/Video**: Voz clara y resolución que permite leer el código.
- [x] **Demo**: Se muestra el flujo completo desde la creación hasta la persistencia en la DB.
