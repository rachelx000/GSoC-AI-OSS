import { useState } from 'react';
import { strategyGroups, strategies } from '../data/research';
import { Excerpts } from './ResearchEvidence';
import strategyIcon from '../assets/strategy.svg';

const RESPONSE_FINDINGS = [
  {
    title: 'Organizations established trust in applicants through new forms of evidence.',
    tone: 'entry',
  },
  {
    title: 'Responses ranged from restricting GenAI to accepting it, and all kept contributors accountable.',
    tone: 'mentoring',
  },
  {
    title: 'Responsibility remained local, and participants asked the program to share it.',
    tone: 'retention',
  },
];

export default function StrategiesSection() {
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState(() => new Set([strategyGroups[0].id]));
  const search = query.toLowerCase().trim();
  const visibleStrategies = strategies.filter(
    (strategy) =>
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
  const searchStrategies = (value) => {
    setQuery(value);
    if (value.trim()) setOpenGroups(new Set(strategyGroups.map((group) => group.id)));
  };
  const toggleGroup = (id, open) => setOpenGroups((current) => {
    if (current.has(id) === open) return current;
    const next = new Set(current);
    if (open) next.add(id);
    else next.delete(id);
    return next;
  });

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
            Reported strategies about how to assess applicants, govern GenAI use, and
            keep contributors accountable, as well as the proposed program support.
          </p>
        </div>
      </header>
      <section className="impact-findings strategy-findings" aria-label="What GenAI responses require">
        {RESPONSE_FINDINGS.map((finding, index) => (
          <article
            className={`finding-card finding-${finding.tone}`}
            key={finding.title}
          >
            <span className="finding-number">0{index + 1}</span>
            <h3>{finding.title}</h3>
          </article>
        ))}
      </section>
      <div className="strategy-workspace">
        <label className="search-field strategy-search">
          <span>Search strategies & excerpts</span>
          <input
            type="search"
            value={query}
            onChange={(event) => searchStrategies(event.target.value)}
            placeholder="Try “disclosure” or ST12"
          />
        </label>
        <div className="strategy-groups" aria-live="polite">
          {visibleGroups.map((group) => {
            const codes = strategies.filter((strategy) => strategy.groupId === group.id).map((strategy) => strategy.id);
            return (
              <details
                className="strategy-group"
                key={group.id}
                style={{ '--group-color': group.color }}
                aria-labelledby={`strategy-group-${group.id}`}
                open={openGroups.has(group.id)}
                onToggle={(event) => {
                  if (event.target === event.currentTarget) toggleGroup(group.id, event.currentTarget.open);
                }}
              >
                <summary className="strategy-group-summary">
                  <div className="strategy-group-copy">
                    <h2 id={`strategy-group-${group.id}`}>{group.name}</h2>
                    <p>{group.description}</p>
                  </div>
                  <span className="strategy-code-range">{codes.length > 1 ? `${codes[0]}–${codes.at(-1)}` : codes[0]}</span>
                  <span className="strategy-group-chevron" aria-hidden="true">{openGroups.has(group.id) ? '−' : '+'}</span>
                </summary>
                <div className="strategy-records">
                  {visibleStrategies
                    .filter((strategy) => strategy.groupId === group.id)
                    .map((strategy) => (
                      <details className="strategy-record" key={strategy.id}>
                        <summary>
                          <span className="code-pill">{strategy.id}</span>
                          <strong>{strategy.name}</strong>
                          <span className="disclosure-chevron" aria-hidden="true">
                            +
                          </span>
                        </summary>
                        <div className="strategy-record-detail">
                          {strategy.status && (
                            <span className="practice-status">
                              {strategy.status}
                            </span>
                          )}
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
              </details>
            );
          })}
          {!visibleGroups.length && (
            <div className="empty-search">
              <h2>No matching strategy</h2>
              <p>Try another term or clear the search.</p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setQuery('')}
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
