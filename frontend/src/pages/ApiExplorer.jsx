import { useState } from 'react';
import { api } from '../api';

const PRESETS = [
  { label: 'GET /api/info', method: 'GET', path: '/api/info' },
  { label: 'GET /health', method: 'GET', path: '/health' },
  { label: 'GET /ready', method: 'GET', path: '/ready' },
  { label: 'GET /api/kv', method: 'GET', path: '/api/kv' },
  {
    label: 'PUT /api/kv/:key',
    method: 'PUT',
    path: '/api/kv/demo',
    body: '{\n  "value": "hello",\n  "ttlSeconds": 60\n}'
  },
  { label: 'DELETE /api/kv/:key', method: 'DELETE', path: '/api/kv/demo' }
];

export default function ApiExplorer() {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/api/info');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  const send = async () => {
    let parsed;
    if (body.trim()) {
      try {
        parsed = JSON.parse(body);
      } catch {
        setResponse({ status: 0, body: { error: 'request body is not valid JSON' } });
        return;
      }
    }
    const t0 = performance.now();
    const res = await api.raw(method, path, parsed);
    setElapsed(Math.round(performance.now() - t0));
    setResponse(res);
  };

  const applyPreset = (p) => {
    setMethod(p.method);
    setPath(p.path);
    setBody(p.body || '');
    setResponse(null);
  };

  return (
    <div>
      <section className="card">
        <h2>Request</h2>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.label} className="ghost" onClick={() => applyPreset(p)}>
              {p.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {['GET', 'PUT', 'DELETE'].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/path" />
          <button type="submit">Send</button>
        </form>
        {(method === 'PUT' || body) && (
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"value": "..."}'
          />
        )}
      </section>

      {response && (
        <section className="card">
          <h2>
            Response <span className={`badge ${response.ok ? 'ok' : 'bad'}`}>{response.status}</span>
            {elapsed !== null && <span className="muted"> {elapsed} ms</span>}
          </h2>
          <pre className="value">{JSON.stringify(response.body, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
