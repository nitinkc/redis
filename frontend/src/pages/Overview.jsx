import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Overview() {
  const [info, setInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [ready, setReady] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [i, h, r] = await Promise.all([api.info(), api.health(), api.ready()]);
        setInfo(i);
        setHealth(h);
        setReady(r);
        setError('');
      } catch (e) {
        setError(`backend unreachable: ${e.message}`);
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {error && <div className="banner error">{error}</div>}

      <section className="card">
        <h2>Service instance</h2>
        {info ? (
          <table>
            <tbody>
              <tr><td>Service</td><td>{info.service}</td></tr>
              <tr><td>Region</td><td><b>{info.region}</b></td></tr>
              <tr><td>Cluster</td><td><b>{info.cluster}</b></td></tr>
              <tr><td>Pod</td><td>{info.pod}</td></tr>
              <tr><td>Version</td><td>{info.version}</td></tr>
              <tr><td>Redis</td><td>{info.redis}</td></tr>
              <tr><td>Uptime since</td><td>{info.startedAt}</td></tr>
            </tbody>
          </table>
        ) : (
          <p>loading…</p>
        )}
      </section>

      <section className="card">
        <h2>Probe status</h2>
        <div className="badges">
          <span className={`badge ${health?.ok ? 'ok' : 'bad'}`}>
            /health {health ? health.status : '…'}
          </span>
          <span className={`badge ${ready?.ok ? 'ok' : 'bad'}`}>
            /ready {ready ? ready.status : '…'}
          </span>
        </div>
        <p className="muted">
          Liveness says the process is up; readiness says Redis is reachable. See the Health page
          for a live probe history.
        </p>
      </section>

      <section className="card">
        <h2>Concepts covered</h2>
        <ul className="links">
          <li><a href="#/kv">Key/value strings + TTL expiry</a></li>
          <li><a href="#/health">Health vs readiness probes</a></li>
          <li><a href="#/api">REST API request flow</a></li>
          <li><a href="#/concepts">Region identity & multi-region routing</a></li>
        </ul>
      </section>
    </div>
  );
}
