# Swagger UI

Swagger UI turns the [OpenAPI specification](../api/openapi.yaml) into an interactive API explorer. It is part of this documentation site, **not an endpoint served by Express**.

## Open and use it

1. Start the backend and Redis: `docker compose up --build`.
2. Start the docs server using the [run-locally instructions](02-run-locally.md#serve-this-documentation-site).
3. Open <http://127.0.0.1:8000/api/swagger-ui.html> for the full-page explorer, or use the embedded view below.
4. Select the local backend under **Servers**. For another trusted environment, edit a local copy of `openapi.yaml` to add its server URL, then reload.
5. Expand `GET /health`, select **Try it out**, then **Execute**. Check the request URL, response status, and body.
6. Try `PUT /api/kv/{key}` with key `greeting` and body `{"value":"hello","ttlSeconds":60}`, followed by GET and DELETE for the same key.

**Try it out sends real requests.** PUT overwrites values and DELETE removes them in the selected backend. Use only disposable keys and synthetic data. There is no Authorize button because this POC has no authentication.

[Open full-page Swagger UI](../api/swagger-ui.html)

<iframe src="../api/swagger-ui.html" title="Interactive POC Backend Swagger UI" width="100%" height="900" loading="lazy"></iframe>

## Open the raw specification

- Browser: <http://127.0.0.1:8000/api/openapi.yaml> while MkDocs is running.
- Repository: `docs/api/openapi.yaml` in a text editor or an OpenAPI-compatible tool.
- You can import this local file into an API client that supports OpenAPI 3.0.

Opening the HTML directly with a `file://` URL may prevent the browser from fetching the YAML; serve it through MkDocs instead. Swagger assets load from a pinned jsDelivr CDN version and require network access. API requests originate from your browser and must be able to reach the selected server. See [troubleshooting](02-run-locally.md#troubleshooting) for network and mixed-content failures.
