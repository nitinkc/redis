import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

export default function KeyValue() {
  const [keys, setKeys] = useState([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState('');
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const k = await api.keys();
      setKeys(k.keys || []);
      setError('');
    } catch (e) {
      setError(`backend unreachable: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh]);

  const save = async (e) => {
    e.preventDefault();
    if (!key) return;
    const res = await api.set(key, value, ttl ? Number(ttl) : undefined);
    if (!res.ok) {
      setNotice(`error ${res.status}: ${res.body?.error || 'failed'}`);
      return;
    }
    setNotice(`set "${key}"${ttl ? ` (expires in ${ttl}s)` : ''}`);
    setKey('');
    setValue('');
    setTtl('');
    refresh();
  };

  const inspect = async (k) => {
    const res = await api.get(k);
    setSelected(res.ok ? res.body : { key: k, value: `error ${res.status}` });
  };

  const remove = async (k) => {
    const res = await api.del(k);
    setNotice(`deleted ${res.body?.deleted ?? 0} key(s)`);
    if (selected?.key === k) setSelected(null);
    refresh();
  };

  return (
    <div>
      {error && <div className="banner error">{error}</div>}
      {notice && <div className="banner info">{notice}</div>}

      <section className="card">
        <h2>Set a key</h2>
        <form onSubmit={save}>
          <input placeholder="key" value={key} onChange={(e) => setKey(e.target.value)} />
          <input placeholder="value" value={value} onChange={(e) => setValue(e.target.value)} />
          <input
            placeholder="TTL (s)"
            className="ttl"
            type="number"
            min="1"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <button type="submit">Set</button>
        </form>
        <p className="muted">
          Keys are Redis strings. Give a TTL to see expiry — set a short TTL and watch the key
          disappear on refresh.
        </p>
      </section>

      <section className="card">
        <h2>Keys ({keys.length})</h2>
        <ul>
          {keys.map((k) => (
            <li key={k}>
              <code>{k}</code>
              <button className="ghost" onClick={() => inspect(k)}>get</button>
              <button onClick={() => remove(k)}>delete</button>
            </li>
          ))}
          {keys.length === 0 && <li className="muted">no keys</li>}
        </ul>
      </section>

      {selected && (
        <section className="card">
          <h2>Value</h2>
          <p><code>{selected.key}</code></p>
          <pre className="value">{selected.value}</pre>
        </section>
      )}
    </div>
  );
}
