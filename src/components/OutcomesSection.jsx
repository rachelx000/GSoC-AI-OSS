import { useMemo, useState } from 'react';
import {
  respondentBands,
  respondentColor,
  respondentTextColor,
} from '../data/challengeColors';
import { outcomeDimensions, outcomes } from '../data/outcomes';
import DefinitionBlocks from './DefinitionBlocks';

const SAMPLE_SIZE = 15;
const LITERATURE_URL = 'https://doi.ieeecomputersociety.org/10.1109/CHASE66643.2025.00031';
const OUTCOME_COLORS = {
  OC1: '#bcd4e6',
  OC2: '#c5dedd',
  OC3: '#fde2e4',
  OC4: '#d6e2e9',
  OC5: '#eddcd2',
};

const dimensionById = new Map(outcomeDimensions.map((dimension) => [dimension.id, dimension]));
const outcomesWithDimensions = outcomes.map((outcome) => ({
  ...outcome,
  dimension: dimensionById.get(outcome.dimensionId),
}));

function matchesBand(outcome, activeBand) {
  return !activeBand
    || (outcome.respondentCount >= activeBand.min && outcome.respondentCount <= activeBand.max);
}

function rankOutcomes(items) {
  return [...items].sort((first, second) => (
    second.respondentCount - first.respondentCount || first.sourceOrder - second.sourceOrder
  ));
}

function OutcomeCoverageFilter({ activeBand, onChange, visibleCount }) {
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

function OutcomeViewSwitcher({ activeView, onChange }) {
  return (
    <div className="strategy-view-switch" aria-label="Outcome organization">
      <button
        type="button"
        aria-pressed={activeView === 'dimension'}
        onClick={() => onChange('dimension')}
      >
        By dimension
      </button>
      <button
        type="button"
        aria-pressed={activeView === 'all'}
        onClick={() => onChange('all')}
      >
        All outcomes
      </button>
    </div>
  );
}

function OutcomeEvidence({ outcome, hidden }) {
  return (
    <div className="strategy-expanded-content" id={`outcome-details-${outcome.id}`} hidden={hidden}>
      <section className="strategy-definition" aria-labelledby={`outcome-definition-${outcome.id}`}>
        <h4 id={`outcome-definition-${outcome.id}`}>Outcome definition</h4>
        <DefinitionBlocks
          definition={outcome.definition}
          referenceUrl={outcome.provenance === 'literature' ? LITERATURE_URL : undefined}
          referenceLabel="Feng et al. (2025)"
        />
      </section>

      <section className="strategy-open-codes" aria-labelledby={`outcome-codes-${outcome.id}`}>
        <div className="strategy-evidence-heading">
          <h4 id={`outcome-codes-${outcome.id}`}>Representative open codes</h4>
        </div>
        {outcome.representativeCodes.length > 0 ? (
          <div className="strategy-code-list">
            {outcome.representativeCodes.map((item, index) => (
              <article className="strategy-code" key={`${outcome.id}-${item.code}-${index}`}>
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
        ) : (
          <p className="outcome-empty-evidence">
            No directly coded interview excerpt is linked to this outcome in the workbook.
          </p>
        )}
      </section>
    </div>
  );
}

function OutcomeRow({ outcome, expanded, onToggle, showDimension = false }) {
  const coverageColor = outcome.respondentCount === 0
    ? '#f0efeb'
    : respondentColor(outcome.respondentCount);
  const coverageInk = outcome.respondentCount === 0
    ? '#36566a'
    : respondentTextColor(outcome.respondentCount);

  return (
    <article
      className="strategy-row"
      data-expanded={expanded ? 'true' : 'false'}
      style={{
        '--coverage-color': coverageColor,
        '--coverage-ink': coverageInk,
        '--dimension-color': OUTCOME_COLORS[outcome.dimensionId],
      }}
    >
      <button
        type="button"
        className="strategy-row-trigger"
        aria-expanded={expanded}
        aria-controls={`outcome-details-${outcome.id}`}
        onClick={onToggle}
      >
        <span className="strategy-row-title">
          <strong>{outcome.name}</strong>
          <span className="outcome-origin-tag" data-origin={outcome.provenance}>
            {outcome.provenance === 'new' ? 'AI-era addition' : 'Prior literature'}
          </span>
          {showDimension && (
            <span className="strategy-dimension-tag">{outcome.dimension.name}</span>
          )}
        </span>
        <span
          className="strategy-coverage-track"
          role="img"
          aria-label={`${outcome.respondentCount} of ${SAMPLE_SIZE} interviewees`}
          style={{ '--coverage-width': `${(outcome.respondentCount / SAMPLE_SIZE) * 100}%` }}
        >
          <span className="strategy-coverage-fill" aria-hidden="true" />
          <span className="strategy-coverage-count" aria-hidden="true">
            <strong>{outcome.respondentCount}</strong>
            <span>&nbsp;/ {SAMPLE_SIZE}</span>
          </span>
        </span>
        <span className="strategy-expand-icon" aria-hidden="true">⌄</span>
      </button>
      <OutcomeEvidence outcome={outcome} hidden={!expanded} />
    </article>
  );
}

function OutcomeDimension({ dimension, items, expandedId, onToggle }) {
  return (
    <section
      className="strategy-dimension"
      style={{ '--dimension-color': OUTCOME_COLORS[dimension.id] }}
      aria-labelledby={`outcome-dimension-${dimension.id}`}
    >
      <header className="strategy-dimension-heading">
        <h2 id={`outcome-dimension-${dimension.id}`}>{dimension.name}</h2>
        <p>{dimension.definition}</p>
      </header>
      <div className="strategy-list">
        {items.map((outcome) => (
          <OutcomeRow
            outcome={outcome}
            expanded={expandedId === outcome.id}
            key={outcome.id}
            onToggle={() => onToggle(outcome.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default function OutcomesSection() {
  const [activeBand, setActiveBand] = useState(null);
  const [activeView, setActiveView] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const rankedOutcomes = useMemo(() => rankOutcomes(
    outcomesWithDimensions.filter((outcome) => matchesBand(outcome, activeBand)),
  ), [activeBand]);

  const filteredDimensions = useMemo(() => outcomeDimensions
    .map((dimension) => ({
      ...dimension,
      outcomes: rankOutcomes(outcomesWithDimensions.filter((outcome) => (
        outcome.dimensionId === dimension.id && matchesBand(outcome, activeBand)
      ))),
    }))
    .filter((dimension) => dimension.outcomes.length > 0), [activeBand]);

  const toggleOutcome = (outcomeId) => {
    setExpandedId((current) => (current === outcomeId ? null : outcomeId));
  };

  return (
    <main
      id="outcomes-panel"
      className="strategies-page outcomes-page"
      role="tabpanel"
      aria-labelledby="outcomes-tab"
    >
      <div className="strategies-frame">
        <header className="strategies-overview">
          <div className="strategies-intro">
            <h1>What GSoC makes possible in the AI era</h1>
            <p>
              <em className="outcomes-subtitle">
                GSoC shapes AI-assisted output into maintainable contributions and longer-term participation in open source.
              </em>
              Bars show how many of 15 interviewees contributed evidence to each outcome. Expand rows to inspect the outcome's definition & example codes.
            </p>
          </div>
        </header>

        <div className="strategies-workspace">
          <div className="strategies-control-row">
            <OutcomeViewSwitcher activeView={activeView} onChange={setActiveView} />
            <OutcomeCoverageFilter
              activeBand={activeBand}
              onChange={setActiveBand}
              visibleCount={rankedOutcomes.length}
            />
          </div>

          <section className="strategies-content" aria-label="Outcome taxonomy">
            <div className="strategies-content-scroll" key={activeView}>
              {activeView === 'all' ? (
                <section className="strategy-all-panel" aria-label="All outcomes ranked by coverage">
                  <div className="strategy-ranked-list">
                    {rankedOutcomes.map((outcome) => (
                      <OutcomeRow
                        outcome={outcome}
                        expanded={expandedId === outcome.id}
                        key={outcome.id}
                        onToggle={() => toggleOutcome(outcome.id)}
                        showDimension
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <div className="strategy-dimension-grid">
                  {filteredDimensions.map((dimension) => (
                    <OutcomeDimension
                      dimension={dimension}
                      items={dimension.outcomes}
                      expandedId={expandedId}
                      key={dimension.id}
                      onToggle={toggleOutcome}
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
