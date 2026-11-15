import { useEffect, useState } from 'react';
import Overview from './pages/Overview';
import KeyValue from './pages/KeyValue';
import Health from './pages/Health';
import ApiExplorer from './pages/ApiExplorer';
import Concepts from './pages/Concepts';

const ROUTES = {
  '/': { label: 'Overview', component: Overview },
  '/kv': { label: 'Key/Value', component: KeyValue },
  '/health': { label: 'Health', component: Health },
  '/api': { label: 'API Explorer', component: ApiExplorer },
  '/concepts': { label: 'Concepts', component: Concepts }
};

const currentPath = () => window.location.hash.replace(/^#/, '') || '/';

export default function App() {
  const [path, setPath] = useState(currentPath());

  useEffect(() => {
    const onHash = () => setPath(currentPath());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const route = ROUTES[path] || ROUTES['/'];
  const Page = route.component;

  return (
    <div className="layout">
      <header className="topbar">
        <h1>Redis POC</h1>
        <nav>
          {Object.entries(ROUTES).map(([p, r]) => (
            <a key={p} href={`#${p}`} className={p === path ? 'active' : ''}>
              {r.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="page">
        <Page />
      </main>
    </div>
  );
}
