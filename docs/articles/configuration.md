# Configuration

The backend reads environment variables at process startup. It does not load a `.env` file itself.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | Express listening port |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `REGION` | `local` | Region label returned by `/api/info` |
| `CLUSTER_NAME` | `local` | Cluster label returned by `/api/info` |

The application version comes from `package.json`, the pod field from `os.hostname()`, and `startedAt` from the time the process initializes. These are not environment configuration fields.

## Environment-specific values

| Environment | Redis address | Region | Cluster |
| --- | --- | --- | --- |
| Direct Node.js defaults | `redis://localhost:6379` | `local` | `local` |
| Compose | `redis://redis:6379` | `local` | `docker-compose` |
| Kubernetes base | `redis://poc-redis:6379` | `unset` | `unset` |
| Region A overlay | `redis://poc-redis:6379` | `us-east1` | `poc-cluster-a` |
| Region B overlay | `redis://poc-redis:6379` | `us-central1` | `poc-cluster-b` |

Changing `PORT` also requires corresponding container port mappings, Service targets, and probe ports. The current Compose file sets values explicitly; exporting a host variable does not automatically override those Compose entries.

## Sensitive configuration

Do not commit credentials or real connection secrets. The current startup log prints `REDIS_URL`, so do not use a credential-bearing URL without first addressing that logging behavior. Kubernetes secret injection and log redaction are not configured in this POC.
