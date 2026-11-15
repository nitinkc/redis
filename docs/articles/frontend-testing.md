# Testing Guide

There is no automated test suite — this UI is a manual test harness for the
backend. Use the scenarios below to verify each demonstrated behavior.

## Prerequisites

- `poc-backend` and Redis running locally:
  `docker compose up` (from the repository root)
- UI running locally: `npm install && npm run dev` → http://localhost:3000

## Scenario checklist

### 1. Serving region info

- [ ] Page loads and the **Serving region** card shows `region`, `cluster`,
      `pod`, `version`, `redis`, and `startedAt` populated.
- [ ] Wait ~5s: values refresh automatically without a reload.
- [ ] `redis` field shows the backend's Redis connection status.

### 2. Redis key/value round-trip

- [ ] Enter `key = foo`, `value = bar`, click **Set** — `foo` appears in the list.
- [ ] Repeat with a second key; both persist across a page reload.
- [ ] Click **delete** next to `foo` — it disappears from the list.
- [ ] Submitting with an empty key does nothing (guard in `save()`).

### 3. Multi-region / shared state (requires ≥2 deployments)

- [ ] Open the UI served by region A, set a key.
- [ ] Open the UI served by region B (or reload while traffic shifts) — the
      same key is listed, proving shared Redis state.
- [ ] The region/cluster/pod fields differ between the two views.

### 4. Backend failure handling

- [ ] Stop the backend (`docker compose stop` or kill the container).
- [ ] Within ~5s the UI shows a red `backend unreachable` banner.
- [ ] Restart the backend — the banner clears and data reappears.

### 5. Container image behavior

```sh
docker build -t poc-ui .
docker run -p 8080:8080 -e BACKEND_URL=http://host.docker.internal:8080 poc-ui
```

- [ ] http://localhost:8080 serves the UI.
- [ ] `curl localhost:8080/healthz` returns `ok`.
- [ ] `/api/info` responds through the nginx proxy.
- [ ] Changing `BACKEND_URL` repoints the proxy **without rebuilding the image**.

### 6. Build sanity

- [ ] `npm run build` completes; `dist/` is produced.
- [ ] `npm run preview` serves the production build locally.

## Verifying the API directly

```sh
curl localhost:8080/api/info
curl localhost:8080/api/kv
curl -X PUT localhost:8080/api/kv/foo -H 'Content-Type: application/json' -d '{"value":"bar"}'
curl -X DELETE localhost:8080/api/kv/foo
```
