const request = async (path, options) => {
  const res = await fetch(path, options);
  const body = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, body };
};

export const api = {
  info: () => fetch('/api/info').then((r) => r.json()),
  keys: () => fetch('/api/kv').then((r) => r.json()),
  get: (key) => request(`/api/kv/${encodeURIComponent(key)}`),
  set: (key, value, ttlSeconds) =>
    request(`/api/kv/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ttlSeconds ? { value, ttlSeconds } : { value })
    }),
  del: (key) => request(`/api/kv/${encodeURIComponent(key)}`, { method: 'DELETE' }),
  health: () => request('/health'),
  ready: () => request('/ready'),
  raw: (method, path, body) =>
    request(path, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
};
