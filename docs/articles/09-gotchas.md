# 9 · Gotchas & limits

Everything that will surprise you, in one place. Each item links back to the
step that explains it.

## Redis

| Gotcha | Impact | Step |
|---|---|---|
| No persistence, volume, or replica | restart ⇒ all keys gone | [4](04-redis-data.md) |
| No `maxmemory`/eviction policy | memory full ⇒ writes fail (`noeviction` default) | [4](04-redis-data.md) |
| `KEYS *` for listing | blocks Redis on big datasets | [4](04-redis-data.md) |
| Re-PUT without `ttlSeconds` | silently clears the TTL | [4](04-redis-data.md) |
| No auth/ACL/TLS on `redis://` | anyone on the network has full access | [1](01-big-picture.md) |
| `REDIS_URL` logged at startup | credential leak if the URL has a password | [4](04-redis-data.md) |
| No command timeout | requests **queue** during outages instead of failing | [5](05-health-readiness.md) |

## Backend

| Gotcha | Impact | Step |
|---|---|---|
| `String(value)` on all values | objects become `"[object Object]"` | [4](04-redis-data.md) |
| `ttlSeconds: 0` = no TTL; `"abc"` → 503 | truthiness ≠ validation | [4](04-redis-data.md) |
| Malformed JSON → 500 not 400 | middleware drops parser status | [3](03-request-flow.md) |
| `/ready` flag set only on `ready`/`end` | stale 200 during reconnects | [5](05-health-readiness.md) |
| CORS `*`, errors leak internals | trusted networks only | [1](01-big-picture.md) |
| `depends_on` isn't readiness | backend starts before Redis accepts | [2](02-run-locally.md) |

## Frontend

| Gotcha | Impact | Step |
|---|---|---|
| `proxy_connect_timeout 2s` in nginx | dead backend ⇒ fast `/api` failure (the banner) | [7](07-frontend.md) |
| Stale `BACKEND_URL` | needs container restart, not rebuild | [7](07-frontend.md) |
| UI "shared state" demo | only means same-Redis views — no cross-region sync | [8](08-multi-region.md) |

## Architecture

| Gotcha | Impact | Step |
|---|---|---|
| No cross-region replication | data is per-cluster | [8](08-multi-region.md) |
| No global LB/DNS | failover is manual/DNS | [8](08-multi-region.md) |
| Release workflow tags lightweight tags pushed with `--follow-tags` | tag may not reach remote | [deploy ref](frontend-deployment.md) |

## If this went to production

AuthN/Z, restricted CORS/ingress, secrets + log redaction, input validation,
bounded requests and Redis timeouts, durable/HA storage (persistence,
replica, or managed Redis), `SCAN` not `KEYS`, eviction policy decision,
observability, and a real cross-region consistency strategy. All future work —
none of it is here today.

---

Done. Reference: [API guide](api-guide.md) ·
[Configuration](configuration.md) ·
[Deployment](frontend-deployment.md) ·
[Maintaining docs](documentation.md)
