.PHONY: all db backend frontend

# Inicializa todo: DB + backend + frontend
all: db backend frontend

# Inicia el contenedor de la base de datos
db:
	docker start EzeDB

# Levanta el backend (FastAPI con uvicorn)
backend:
	cd backend && ./.venv/bin/uvicorn app.main:app --reload --port 8003 &
# Levanta el frontend (Vite dev server)
frontend:
	cd frontend && pnpm dev &
