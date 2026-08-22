import { useMemo, useState } from 'react';
import {
  respondentBands,
  respondentColor,
  respondentTextColor,
} from '../data/challengeColors';
import { strategyDimensions } from '../data/strategies';

const SAMPLE_SIZE = 15;
const SOURCE_ORDER = [
  'ST-S2.1',
  'ST-S2.2',
  'ST-S2.3',
  'ST-S2.4',
  'ST-S4.3',
  'ST-S5.2',
  'ST-S5.3',
  'ST-S5.6',
  'ST-S6.1',
  'ST-G.1',
  'ST-G.2',
  'ST-G.3',
  'ST-G.5',
  'ST-G.6',
  'ST-G.7',
];
const SOURCE_INDEX = new Map(SOURCE_ORDER.map((id, index) => [id, index]));
const DIMENSION_COLORS = {
  ST1: '#bcd4e6',
  ST2: '#c5dedd',
  ST3: '#fde2e4',
  ST4: '#fad2e1',
  ST5: '#d6e2e9',
  ST6: '#eddcd2',
};

const allStrategies = strategyDimensions.flatMap((dimension) => dimension.strategies.map(
  (strategy) => ({
    ...strategy,
    dimension,
    sourceIndex: SOURCE_INDEX.get(strategy.id),
  }),
));

function matchesBand(strategy, activeBand) {
  return !activeBand
    || (strategy.respondentCount >= activeBand.min && strategy.respondentCount <= activeBand.max);
}

function rankStrategies(strategies) {
  return [...strategies].sort((first, second) => (
    second.respondentCount - first.respondentCount || first.sourceIndex - second.sourceIndex
  ));
}

function CoverageFilter({ activeBand, onChange, visibleCount }) {
  return (
    <aside className="strategy-filter" aria-labelledby="strategy-filter-title">
      <div className="strategy-filter-heading">
        <h2 id="strategy-filter-title">
          Number of respondents <span>(n = {SAMPLE_SIZE})</span>
        </h2>
      </div>

      <div className="strategy-filter-row">
        <p className="strategy-filter-status" aria-live="polite">
          {visibleCount} shown
        </p>

        <div className="strategy-filter-options"
          aria-label="Filter strategies by respondent count"
        >
          <button
            type="button"
            className="strategy-filter-button strategy-filter-all"
            aria-pressed={!activeBand}
            onClick={() => onChange(null)}
          >
            All
          </button>

          {respondentBands.map((band) => {
            const selected = activeBand?.label === band.label;

            return (
              <button
                type="button"
                className="strategy-filter-button"
                style={{ '--band-color': band.color, '--band-ink': band.ink }}
                aria-label={`${band.label} respondents`}
                aria-pressed={selected}
                key={band.label}
                onClick={() => onChange(selected ? null : band)}
              >
                <span>{band.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function ViewSwitcher({ activeView, onChange }) {
  return (
    <div className="strategy-view-switch" aria-label="Strategy organization">
      <button
        type="button"
        aria-pressed={activeView === 'dimension'}
        onClick={() => onChange('dimension')}
      >
        By Dimension
      </button>
      <button
        type="button"
        aria-pressed={activeView === 'all'}
        onClick={() => onChange('all')}
      >
        All Strategies
      </button>
    </div>
  );
}

function StrategyEvidence({ strategy, hidden }) {
  return (
    <div
      className="strategy-expanded-content"
      id={`strategy-details-${strategy.id}`}
      hidden={hidden}
    >
      <section className="strategy-definition" aria-labelledby={`strategy-definition-${strategy.id}`}>
        <h4 id={`strategy-definition-${strategy.id}`}>Strategy definition</h4>
        <p>{strategy.definition}</p>
      </section>

      <section className="strategy-open-codes" aria-labelledby={`strategy-codes-${strategy.id}`}>
        <div className="strategy-evidence-heading">
          <h4 id={`strategy-codes-${strategy.id}`}>Representative open codes</h4>
        </div>
        <div className="strategy-code-list">
          {strategy.representativeCodes.map((item, index) => (
            <article className="strategy-code" key={`${strategy.id}-${item.code}-${index}`}>
              <div className="strategy-code-heading">
                <strong>{item.code}</strong>
                <span>{item.source}</span>
              </div>
              <details>
                <summary>Verbatim excerpt</summary>
                <blockquote>{item.quote}</blockquote>
              </details>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function StrategyRow({ strategy, expanded, onToggle, showDimension = false }) {
  const coverageColor = respondentColor(strategy.respondentCount);
  const coverageInk = respondentTextColor(strategy.respondentCount);

  return (
    <article
      className="strategy-row"
      data-expanded={expanded ? 'true' : 'false'}
      style={{
        '--coverage-color': coverageColor,
        '--coverage-ink': coverageInk,
        '--dimension-color': DIMENSION_COLORS[strategy.dimension.id],
      }}
    >
      <button
        type="button"
        className="strategy-row-trigger"
        aria-expanded={expanded}
        aria-controls={`strategy-details-${strategy.id}`}
        onClick={onToggle}
      >
        <span className="strategy-row-title">
          <strong>{strategy.name}</strong>
          {showDimension && (
            <span className="strategy-dimension-tag">{strategy.dimension.name}</span>
          )}
        </span>
        <span
          className="strategy-coverage-track"
          role="img"
          aria-label={`${strategy.respondentCount} of ${SAMPLE_SIZE} interviewees`}
          style={{ '--coverage-width': `${(strategy.respondentCount / SAMPLE_SIZE) * 100}%` }}
        >
          <span className="strategy-coverage-fill" aria-hidden="true" />
          <span className="strategy-coverage-count" aria-hidden="true">
            <strong>{strategy.respondentCount}</strong>
            <span>&nbsp;/ {SAMPLE_SIZE}</span>
          </span>
        </span>
        <span className="strategy-expand-icon" aria-hidden="true">⌄</span>
      </button>
      <StrategyEvidence strategy={strategy} hidden={!expanded} />
    </article>
  );
}

function StrategyDimension({ dimension, strategies, expandedId, onToggle }) {
  return (
    <section
      className="strategy-dimension"
      style={{ '--dimension-color': DIMENSION_COLORS[dimension.id] }}
      aria-labelledby={`strategy-dimension-${dimension.id}`}
    >
      <header className="strategy-dimension-heading">
        <h2 id={`strategy-dimension-${dimension.id}`}>{dimension.name}</h2>
        <p>{dimension.definition}</p>
      </header>
      <div className="strategy-list">
        {strategies.map((strategy) => (
          <StrategyRow
            strategy={strategy}
            expanded={expandedId === strategy.id}
            key={strategy.id}
            onToggle={() => onToggle(strategy.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default function StrategiesSection() {
  const [activeBand, setActiveBand] = useState(null);
  const [activeView, setActiveView] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const rankedStrategies = useMemo(() => rankStrategies(
    allStrategies.filter((strategy) => matchesBand(strategy, activeBand)),
  ), [activeBand]);

  const filteredDimensions = useMemo(() => strategyDimensions
    .map((dimension) => ({
      ...dimension,
      strategies: rankStrategies(allStrategies.filter((strategy) => (
        strategy.dimension.id === dimension.id && matchesBand(strategy, activeBand)
      ))),
    }))
    .filter((dimension) => dimension.strategies.length > 0), [activeBand]);

  const toggleStrategy = (strategyId) => {
    setExpandedId((current) => (current === strategyId ? null : strategyId));
  };

  return (
    <main
      id="strategies-panel"
      className="strategies-page"
      role="tabpanel"
      aria-labelledby="strategies-tab"
    >
      <div className="strategies-frame">
        <header className="strategies-overview">
          <div className="strategies-intro">
            <h1>Strategies for GSoC mentoring in the AI-era</h1>
            <p>
              Bars show how many of 15 interviewees contributed evidence to each strategy. 
              Expanded rows to inspect the strategy's definition & example codes.
            </p>
          </div>
        </header>

        <div className="strategies-workspace">
          <div className="strategies-control-row">
            <ViewSwitcher activeView={activeView} onChange={setActiveView} />
            <CoverageFilter
              activeBand={activeBand}
              onChange={setActiveBand}
              visibleCount={rankedStrategies.length}
            />
          </div>

          <section className="strategies-content" aria-label="Strategy taxonomy">
            <div className="strategies-content-scroll" key={activeView}>
              {activeView === 'all' ? (
                <section className="strategy-all-panel" aria-label="All strategies ranked by coverage">
                  <div className="strategy-ranked-list">
                    {rankedStrategies.map((strategy) => (
                      <StrategyRow
                        strategy={strategy}
                        expanded={expandedId === strategy.id}
                        key={strategy.id}
                        onToggle={() => toggleStrategy(strategy.id)}
                        showDimension
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <div className="strategy-dimension-grid">
                  {filteredDimensions.map((dimension) => (
                    <StrategyDimension
                      dimension={dimension}
                      strategies={dimension.strategies}
                      expandedId={expandedId}
                      key={dimension.id}
                      onToggle={toggleStrategy}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
