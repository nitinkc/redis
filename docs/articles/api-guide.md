# API guide

## OpenAPI, Swagger, and OpenAI

**OpenAPI** is the machine-readable contract describing HTTP paths, methods, parameters, request bodies, and responses. This project uses OpenAPI 3.0.3 in [openapi.yaml](../api/openapi.yaml).

**Swagger UI** renders that contract into browsable documentation and a **Try it out** request client. [Open Swagger UI](swagger.md) for instructions and an embedded explorer.

**OpenAI** is unrelated to OpenAPI. This repository does not contain an OpenAI integration or OpenAI-specific API documentation.

## Endpoints

Default API base URL: `http://localhost:8080`. All documented responses are JSON. Send `Content-Type: application/json` for PUT bodies. There is no authentication.

| Method | Path | Success | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | 200 | HTTP liveness, without checking Redis |
| GET | `/ready` | 200 / 503 | Redis-ready flag |
| GET | `/api/info` | 200 | Version, region, cluster, pod, start time, Redis state |
| GET | `/api/kv` | 200 | List all keys, not paginated |
| GET | `/api/kv/{key}` | 200 | Read a string; 404 if absent |
| PUT | `/api/kv/{key}` | 201 | Create or replace, optionally with TTL |
| DELETE | `/api/kv/{key}` | 200 | Return `deleted: 0` or `deleted: 1` |

OpenAPI uses `{key}` for a path parameter; the Express implementation writes the same route as `:key`.

## Request and response example

```sh
curl -i -X PUT http://localhost:8080/api/kv/example \
  -H 'Content-Type: application/json' \
  -d '{"value":"demo","ttlSeconds":60}'
```

Successful response (HTTP 201):

```json
{"key":"example","value":"demo"}
```

`value` must be present, but can be any JSON value. The service converts it with JavaScript `String(value)`: a number becomes a numeric string, `null` becomes `"null"`, and a typical object becomes `"[object Object]"`. Prefer string values. TTL should be a positive integer; see [Redis data & TTL](04-redis-data.md) for current validation limitations.

## Errors and implementation caveats

Errors handled by the application's middleware have the shape:

```json
{"error":"key not found"}
```

- Missing key on GET: **404**.
- Missing `value` on PUT: **400**, with `body must contain "value"`.
- Error messages matching `redis`, `ECONNREFUSED`, or `closed` (case-insensitive): **503**.
- Other errors passed to the handler: **500**. This includes malformed JSON/body-parser failures because the current handler does not preserve their original HTTP status.
- Redis errors do not all map consistently to 503. Reconnecting clients may queue operations, so do not expect every outage to fail immediately.
- Unknown paths use Express's default 404 response, which is not this JSON error envelope.

The OpenAPI contract describes the implemented behavior, not a stronger validation or reliability guarantee. Keep it synchronized when routes change.
