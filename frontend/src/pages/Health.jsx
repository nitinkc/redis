import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

const MAX_HISTORY = 20;

export default function Health() {
  const [history, setHistory] = useState([]);
  const [polling, setPolling] = useState(true);
  const timer = useRef(null);

  const probe = async () => {
    const at = new Date().toLocaleTimeString();
    try {
      const [h, r] = await Promise.all([api.health(), api.ready()]);
      setHistory((prev) =>
        [{ at, health: h.status, ready: r.status }, ...prev].slice(0, MAX_HISTORY)
      );
    } catch (e) {
      setHistory((prev) =>
        [{ at, health: 'unreachable', ready: 'unreachable' }, ...prev].slice(0, MAX_HISTORY)
      );
    }
  };

  useEffect(() => {
    if (!polling) return undefined;
    probe();
    timer.current = setInterval(probe, 2000);
    return () => clearInterval(timer.current);
  }, [polling]);

  const latest = history[0];

  return (
    <div>
      <section className="card">
        <h2>Liveness vs readiness</h2>
        <p className="muted">
          <code>/health</code> returns 200 whenever the process is alive. <code>/ready</code>{' '}
          returns 200 only when Redis is connected — stop Redis to watch readiness flip to 503
          while health stays green.
        </p>
        <div className="badges">
          <span className={`badge ${latest?.health === 200 ? 'ok' : 'bad'}`}>
            /health {latest ? latest.health : '…'}
          </span>
          <span className={`badge ${latest?.ready === 200 ? 'ok' : 'bad'}`}>
            /ready {latest ? latest.ready : '…'}
          </span>
          <button className="ghost" onClick={() => setPolling((p) => !p)}>
            {polling ? 'pause' : 'resume'}
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Probe history</h2>
        <table>
          <thead>
            <tr><th>time</th><th>/health</th><th>/ready</th></tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i}>
                <td>{row.at}</td>
                <td className={row.health === 200 ? 'ok-text' : 'bad-text'}>{row.health}</td>
                <td className={row.ready === 200 ? 'ok-text' : 'bad-text'}>{row.ready}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr><td colSpan="3" className="muted">no probes yet</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
