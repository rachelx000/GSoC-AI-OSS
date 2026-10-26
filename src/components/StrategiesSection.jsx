import { useState } from 'react';
import { strategyGroups, strategies } from '../data/research';
import { Excerpts, SourceNote } from './ResearchEvidence';
import strategyIcon from '../assets/strategy.svg';

export default function StrategiesSection() {
  const [groupId, setGroupId] = useState('all');
  const [query, setQuery] = useState('');
  const search = query.toLowerCase().trim();
  const visibleStrategies = strategies.filter(
    (strategy) =>
      (groupId === 'all' || strategy.groupId === groupId) &&
      [
        strategy.id,
        strategy.name,
        strategy.definition,
        ...strategy.excerpts.map((excerpt) => excerpt.text),
      ].some((text) => text.toLowerCase().includes(search)),
  );
  const visibleGroups = strategyGroups.filter((group) =>
    visibleStrategies.some((strategy) => strategy.groupId === group.id),
  );

  return (
    <main
      id="strategies-panel"
      className="research-page"
      role="tabpanel"
      aria-labelledby="strategies-tab"
    >
      <header className="page-heading">
        <div>
          <div className="page-title">
            <img src={strategyIcon} alt="" />
            <h1>GenAI Strategies</h1>
          </div>
          <p>
            Where an organization draws its GenAI boundary determines who
            carries the verification work.
          </p>
        </div>
        <p className="page-aside">
          Reported practices and proposed responses, organized by the
          manuscript’s three themes.
        </p>
      </header>
      <div className="strategy-layout">
        <aside className="strategy-sidebar">
          <label className="search-field">
            <span>Search strategies & excerpts</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “disclosure” or ST12"
            />
          </label>
          <nav className="strategy-group-nav" aria-label="Strategy groups">
            <button
              type="button"
              aria-pressed={groupId === 'all'}
              onClick={() => setGroupId('all')}
            >
              All groups <span aria-hidden="true">↗</span>
            </button>
            {strategyGroups.map((group) => (
              <button
                type="button"
                key={group.id}
                aria-pressed={groupId === group.id}
                onClick={() => setGroupId(group.id)}
                style={{ '--group-color': group.color }}
              >
                <i aria-hidden="true" />
                {group.name}
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </nav>
        </aside>
        <div className="strategy-groups" aria-live="polite">
          {visibleGroups.map((group) => (
            <section
              className="strategy-group"
              key={group.id}
              style={{ '--group-color': group.color }}
              aria-labelledby={`strategy-group-${group.id}`}
            >
              <header>
                <span className="eyebrow">
                  {group.id === 'trust'
                    ? 'Establish trust'
                    : group.id === 'accountability'
                      ? 'Maintain accountability'
                      : 'Share responsibility'}
                </span>
                <h2 id={`strategy-group-${group.id}`}>{group.name}</h2>
                <p>{group.description}</p>
              </header>
              <div className="strategy-records">
                {visibleStrategies
                  .filter((strategy) => strategy.groupId === group.id)
                  .map((strategy) => (
                    <details className="strategy-record" key={strategy.id}>
                      <summary>
                        <span className="code-pill">{strategy.id}</span>
                        <strong>{strategy.name}</strong>
                        {strategy.status && (
                          <span className="practice-status">
                            {strategy.status}
                          </span>
                        )}
                        <span className="disclosure-chevron" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <div className="strategy-record-detail">
                        <p className="detail-label">
                          Strategy definition · Manuscript RQ2
                        </p>
                        <p className="strategy-definition-copy">
                          {strategy.definition}
                        </p>
                        <Excerpts
                          items={strategy.excerpts}
                          label={`${strategy.id} interview excerpts`}
                        />
                      </div>
                    </details>
                  ))}
              </div>
            </section>
          ))}
          {!visibleGroups.length && (
            <div className="empty-search">
              <h2>No matching strategy</h2>
              <p>Try another term or select All groups.</p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setQuery('');
                  setGroupId('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
