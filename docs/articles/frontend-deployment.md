# Deployment

## Docker

Single image, region-agnostic:

```sh
docker build -t poc-ui .
docker run -p 8080:8080 -e BACKEND_URL=http://host.docker.internal:8080 poc-ui
```

| Env var | Purpose |
|---|---|
| `BACKEND_URL` | Base URL the nginx `/api/` location proxies to. Injected via envsubst on `/etc/nginx/templates` at container start. |

The container also exposes `GET /healthz` → `200 ok` for load balancer /
Kubernetes probes.

## Versioning / releases

Every push to `main` (see `.github/workflows/release.yml`):

1. Bumps the patch version.
2. Tags the commit `vX.Y.Z`.
3. Pushes `IMAGE_NAME:X.Y.Z` and `IMAGE_NAME:latest` to Artifactory.

Same pattern as `poc-backend`, so UI and backend versions move independently
but predictably.

## Serving the docs

```sh
pip install mkdocs-material
mkdocs serve    # http://localhost:8000
mkdocs build    # static site in site/
```
