const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');
const os = require('os');
const { version: VERSION } = require('../package.json');

const PORT = process.env.PORT || 8080;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REGION = process.env.REGION || 'local';
const CLUSTER = process.env.CLUSTER_NAME || 'local';
const startedAt = new Date().toISOString();

const app = express();
app.use(cors());
app.use(express.json());

const redis = createClient({ url: REDIS_URL });
let redisReady = false;
redis.on('ready', () => { redisReady = true; });
redis.on('end', () => { redisReady = false; });
redis.on('error', (err) => console.error('redis error:', err.message));
redis.connect().catch((err) => console.error('redis connect failed:', err.message));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/ready', (_req, res) => {
  res.status(redisReady ? 200 : 503).json({ ready: redisReady });
});

app.get('/api/info', (_req, res) => {
  res.json({
    service: 'poc-backend',
    version: VERSION,
    region: REGION,
    cluster: CLUSTER,
    pod: os.hostname(),
    startedAt,
    redis: redisReady ? 'connected' : 'disconnected'
  });
});

app.get('/api/kv', async (_req, res, next) => {
  try {
    res.json({ keys: await redis.keys('*') });
  } catch (err) { next(err); }
});

app.get('/api/kv/:key', async (req, res, next) => {
  try {
    const value = await redis.get(req.params.key);
    if (value === null) return res.status(404).json({ error: 'key not found' });
    res.json({ key: req.params.key, value });
  } catch (err) { next(err); }
});

app.put('/api/kv/:key', async (req, res, next) => {
  try {
    const { value, ttlSeconds } = req.body || {};
    if (value === undefined) return res.status(400).json({ error: 'body must contain "value"' });
    const opts = ttlSeconds ? { EX: Number(ttlSeconds) } : undefined;
    await redis.set(req.params.key, String(value), opts);
    res.status(201).json({ key: req.params.key, value: String(value) });
  } catch (err) { next(err); }
});

app.delete('/api/kv/:key', async (req, res, next) => {
  try {
    res.json({ deleted: await redis.del(req.params.key) });
  } catch (err) { next(err); }
});

app.use((err, _req, res, _next) => {
  const status = /redis|ECONNREFUSED|closed/i.test(err.message || '') ? 503 : 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`poc-backend ${VERSION} listening on :${PORT} region=${REGION} cluster=${CLUSTER} redis=${REDIS_URL}`);
});
