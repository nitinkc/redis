# 6 · Explore the API

The full contract lives in OpenAPI — and it's interactive.

## Cheat sheet

| Method | Path | Success | Purpose |
|---|---|---|---|
| GET | `/health` | 200 | Liveness, ignores Redis |
| GET | `/ready` | 200 / 503 | Redis-ready flag |
| GET | `/api/info` | 200 | Version, region, cluster, pod, startedAt, Redis state |
| GET | `/api/kv` | 200 | List **all** keys (`KEYS *`) |
| GET | `/api/kv/{key}` | 200 / 404 | Read a string value |
| PUT | `/api/kv/{key}` | 201 | Create/replace, optional `ttlSeconds` |
| DELETE | `/api/kv/{key}` | 200 | `{"deleted": 0|1}` |

## Learn it hands-on

1. Stack running (`docker compose up`), docs running (`mkdocs serve`).
2. Open **[Swagger UI](swagger.md)** → pick the
   `http://localhost:8080` server → **Try it out**.
3. Exercise: `PUT greeting` → `GET greeting` → `GET /api/kv` →
   `DELETE greeting` → `GET` again (404).
4. Now `docker compose stop redis` and try `GET /api/kv` — watch how an
   outage presents (hang or 503), then `docker compose start redis`.

!!! warning "Try it out is real"
    PUT overwrites and DELETE removes — there is no auth and no undo.
    Disposable keys only.

## Terminology

- **OpenAPI** — the YAML contract ([openapi.yaml](../api/openapi.yaml))
- **Swagger UI** — renders that contract, sends real requests
- **OpenAI** — *unrelated*. Nothing AI here.

Deep dive: [API guide](api-guide.md) ·
[Swagger instructions](swagger.md) ·
[Configuration reference](configuration.md)

---

Next: [7 · Frontend tour](07-frontend.md)
