const CONCEPTS = [
  {
    title: 'Key/value strings',
    body: 'Redis stores values as strings. The backend exposes GET/PUT/DELETE on /api/kv/:key, mapping REST verbs onto GET, SET and DEL.',
    tryIt: '#/kv'
  },
  {
    title: 'TTL & expiry',
    body: 'PUT accepts an optional ttlSeconds, which becomes SET key value EX <n>. Expired keys disappear automatically — no cleanup code needed.',
    tryIt: '#/kv'
  },
  {
    title: 'Health vs readiness',
    body: '/health reports the process is alive; /ready reports Redis connectivity. Kubernetes uses liveness to restart a pod and readiness to remove it from traffic.',
    tryIt: '#/health'
  },
  {
    title: 'Request flow',
    body: 'Browser → nginx (serves static files, proxies /api) → Express backend → Redis. The API Explorer lets you trace each endpoint and inspect raw responses.',
    tryIt: '#/api'
  },
  {
    title: 'Region & cluster identity',
    body: 'REGION and CLUSTER_NAME env vars identify where an instance runs. In a multi-region deploy, the info panel shows which region served your request.',
    tryIt: '#/'
  },
  {
    title: 'Statelessness',
    body: 'The backend keeps no local state — all data lives in Redis. Any pod can serve any request, which is what makes horizontal scaling and failover work.',
    tryIt: '#/kv'
  }
];

export default function Concepts() {
  return (
    <div>
      <section className="card">
        <h2>Concepts in this POC</h2>
        <p className="muted">
          Each card maps to something you can try live in the UI. Full write-ups live in the docs
          site (mkdocs).
        </p>
      </section>
      <div className="grid">
        {CONCEPTS.map((c) => (
          <section className="card" key={c.title}>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
            <a href={c.tryIt}>try it →</a>
          </section>
        ))}
      </div>
    </div>
  );
}
