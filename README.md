# Redis POC

Single local project combining the `poc-backend` Express microservice and the
`poc-ui` React test UI, plus a merged MkDocs documentation site.

## Layout

```
backend/    Express + Redis microservice (deploy/ kustomize manifests included)
frontend/   React + Vite UI served by nginx, proxies /api to the backend
docs/       MkDocs Material site covering the whole project
```

## Run locally

```sh
docker compose up --build
```

- UI: <http://localhost:3000>
- Backend: <http://localhost:8080>
- Redis: `localhost:6379`

Or run pieces individually:

```sh
cd backend && npm install && npm run dev     # :8080 (needs Redis on :6379)
cd frontend && npm install && npm run dev    # :3000, /api proxied to :8080
```

## Documentation

```sh
uv venv
uv pip install -r requirements-docs.txt
uv run --no-project mkdocs serve -a 127.0.0.1:8000
```

- Docs: <http://127.0.0.1:8000/>
- Swagger UI: <http://127.0.0.1:8000/articles/swagger/>
