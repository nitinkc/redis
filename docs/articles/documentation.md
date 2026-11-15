# Maintaining documentation

## Tooling

Documentation uses MkDocs with the Material theme. Versions of the docs tools and OpenAPI validator are pinned in `requirements-docs.txt`; they are separate from the Node application dependencies.

From the repository root:

```sh
uv venv
uv pip install -r requirements-docs.txt
uv run --no-project mkdocs serve -a 127.0.0.1:8000
```

Open <http://127.0.0.1:8000/>. MkDocs reloads as Markdown and configuration change.

## Verify before publishing

```sh
uv run --no-project mkdocs build --strict
uv run --no-project openapi-spec-validator docs/api/openapi.yaml
```

The build writes static output to ignored `site/`. Publish the **entire directory** to your chosen static host so the Swagger HTML and OpenAPI YAML are included. There is no docs publishing workflow configured, and the backend container does not serve the site. Swagger's CDN assets require internet access; all other pages and the raw contract are static.

## Keep documentation accurate

When changing `src/server.js`:

1. Update endpoint methods, request/response schemas, status codes, and examples in `docs/api/openapi.yaml`.
2. Update the API guide and any affected setup, configuration, or concept pages.
3. If `package.json` changes version, keep the OpenAPI `info.version` aligned when maintaining the contract. The release workflow does not update the specification automatically.
4. Run strict build and schema validation, then smoke-test Swagger against a disposable local backend.

Navigation is declared in `mkdocs.yml`. The Swagger page embeds `docs/api/swagger-ui.html`; that HTML loads its sibling `openapi.yaml` using a relative URL so static hosting under a subpath works.

Schema validation checks the contract's structure, not whether the implementation matches it. Review against the actual routes and test real responses when updating the API.
