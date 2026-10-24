import { useEffect, useRef, useState } from 'react';
import CoverPage from './components/CoverPage';
import GenAIImpactsSection from './components/GenAIImpactsSection';
import StrategiesSection from './components/StrategiesSection';
import AIMSection from './components/AIMSection';
import AppendixModal from './components/AppendixModal';

const TABS = [
  { id: 'impacts', label: 'GenAI Impacts' },
  { id: 'strategies', label: 'GenAI Strategies' },
  { id: 'aim', label: 'AIM' },
];
const currentView = () => {
  const id =
    typeof window === 'undefined'
      ? ''
      : window.location.hash.replace(/^#\/?/, '');
  return TABS.some((tab) => tab.id === id) ? id : 'cover';
};

export default function App() {
  const [view, setView] = useState(currentView);
  const [appendixOpen, setAppendixOpen] = useState(false);
  const tabRefs = useRef([]);
  const appendixButton = useRef(null);

  useEffect(() => {
    const syncView = () => {
      setView(currentView());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', syncView);
    return () => window.removeEventListener('hashchange', syncView);
  }, []);

  const navigateTabs = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length;
    if (event.key === 'ArrowLeft')
      next = (index - 1 + TABS.length) % TABS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = TABS.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    window.location.hash = `/${TABS[next].id}`;
    tabRefs.current[next]?.focus();
  };
  const closeAppendix = () => {
    setAppendixOpen(false);
    requestAnimationFrame(() => appendixButton.current?.focus());
  };

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#/"
          aria-label="GSoC & GenAI home"
          onClick={() => window.scrollTo(0, 0)}
        >
          <span className="brand-cycle" aria-hidden="true">
            ↻
          </span>
          <span>GSoC-AI-OSS</span>
        </a>
        <nav className="tabs" role="tablist" aria-label="Research views">
          {TABS.map((tab, index) => (
            <button
              type="button"
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={view === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={
                view === tab.id || (view === 'cover' && index === 0) ? 0 : -1
              }
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              onClick={() => {
                window.location.hash = `/${tab.id}`;
              }}
              onKeyDown={(event) => navigateTabs(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          className="appendix-button"
          type="button"
          ref={appendixButton}
          aria-haspopup="dialog"
          aria-expanded={appendixOpen}
          onClick={() => setAppendixOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
            <path d="M14 3v5h5M8 12h8M8 16h8" />
          </svg>
          Appendix
        </button>
      </header>
      <div id="main-content" tabIndex={-1}>
        {view === 'cover' && <CoverPage />}
        {view === 'impacts' && <GenAIImpactsSection />}
        {view === 'strategies' && <StrategiesSection />}
        {view === 'aim' && <AIMSection />}
      </div>
      {appendixOpen && <AppendixModal onClose={closeAppendix} />}
    </>
  );
}
