import { useState } from 'react';
import {
  capacityOverlay,
  frameworkCitations,
  frameworkDimensions,
  strategyStances,
  universalMinimum,
} from '../data/strategyFrameworks';
import { strategyDimensions } from '../data/strategies';

const ATTITUDE_COLORS = ['#CF597E', '#EA9C75', '#E9E29C', '#6BBE86', '#009392'];
const LABEL_POSITIONS = [
  'calc(9px + clamp(1.8rem, 6vw, 3.25rem))',
  'calc(25% + 4.5px + clamp(0.9rem, 3vw, 1.625rem))',
  '50%',
  'calc(75% - 4.5px - clamp(0.9rem, 3vw, 1.625rem))',
  'calc(100% - 9px - clamp(1.8rem, 6vw, 3.25rem))',
];
const BUBBLE_POSITIONS = [
  'calc(0.7rem + 9px + clamp(1.8rem, 6vw, 3.25rem))',
  'calc(25% + 0.35rem + 4.5px + clamp(0.9rem, 3vw, 1.625rem))',
  '50%',
  'calc(75% - 0.35rem - 4.5px - clamp(0.9rem, 3vw, 1.625rem))',
  'calc(100% - 0.7rem - 9px - clamp(1.8rem, 6vw, 3.25rem))',
];
const taxonomyById = new Map(
  strategyDimensions.flatMap((dimension) => dimension.strategies).map((strategy) => [strategy.id, strategy]),
);

function frameworkStrategies(stance) {
  const ids = stance.strategyIds.match(/ST-(?:S\d+\.\d+|G\.\d+)/g) ?? [];
  return ids.map((id) => taxonomyById.get(id)).filter(Boolean);
}

function dimensionBullets(text) {
  return text
    .replace(/([.!?])\s+(?=[A-Z])/g, '$1|')
    .split(/\||;\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function FrameworkStrategyEvidence({ strategy, hidden }) {
  return (
    <div
      className="strategy-expanded-content"
      id={`framework-strategy-details-${strategy.id}`}
      hidden={hidden}
    >
      <section className="strategy-definition" aria-labelledby={`framework-definition-${strategy.id}`}>
        <h4 id={`framework-definition-${strategy.id}`}>Strategy definition</h4>
        <p>{strategy.definition}</p>
      </section>

      <section className="strategy-open-codes" aria-labelledby={`framework-codes-${strategy.id}`}>
        <div className="strategy-evidence-heading">
          <h4 id={`framework-codes-${strategy.id}`}>Representative open codes</h4>
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

function FrameworkStrategyRow({ strategy, expanded, onToggle }) {
  return (
    <article
      className="strategy-row framework-strategy-row"
      data-expanded={expanded ? 'true' : 'false'}
    >
      <button
        type="button"
        className="strategy-row-trigger"
        aria-expanded={expanded}
        aria-controls={`framework-strategy-details-${strategy.id}`}
        onClick={onToggle}
      >
        <span className="strategy-row-title">
          <span className="strategy-code-label">{strategy.id}</span>
          <strong>{strategy.name}</strong>
        </span>
        <span className="strategy-expand-icon" aria-hidden="true">⌄</span>
      </button>
      <FrameworkStrategyEvidence strategy={strategy} hidden={!expanded} />
    </article>
  );
}

function AttitudeScale({ activeIndex, onChange }) {
  return (
    <div
      className="framework-attitude-scale"
      style={{ '--scale-color': ATTITUDE_COLORS[activeIndex] }}
      aria-label="AI openness scale"
    >
      <div className="framework-gradient-control">
        <div className="framework-gradient-track" aria-hidden="true" />
        <input
          type="range"
          min="0"
          max={strategyStances.length - 1}
          step="1"
          value={activeIndex}
          aria-label="AI attitude"
          aria-valuetext={strategyStances[activeIndex].name}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <div className="framework-scale-labels">
        {strategyStances.map((stance, index) => (
          <button
            type="button"
            data-active={activeIndex === index ? 'true' : 'false'}
            style={{
              '--label-color': ATTITUDE_COLORS[index],
              '--label-position': LABEL_POSITIONS[index],
            }}
            aria-pressed={activeIndex === index}
            key={stance.id}
            onClick={() => onChange(index)}
          >
            <span aria-hidden="true" />
            {stance.shortName}
          </button>
        ))}
      </div>
    </div>
  );
}

function FrameworkCitations({ dimension, context }) {
  return (
    <div
      className="framework-citations"
      aria-label={`${dimension.label} ${context} references`}
    >
      <span>References</span>
      <div className="literature-links">
        {dimension.citationIds.map((citationId) => {
          const citation = frameworkCitations[citationId];
          return (
            <a key={citationId} href={citation.url} target="_blank" rel="noreferrer">
              {citation.label}
              <span aria-hidden="true">↗</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkBubble({ stance, activeIndex }) {
  return (
    <article
      className="framework-bubble"
      style={{
        '--stance-color': ATTITUDE_COLORS[activeIndex],
        '--stance-position': BUBBLE_POSITIONS[activeIndex],
      }}
      aria-labelledby={`framework-${stance.id}`}
    >
      <div className="framework-bubble-content" key={stance.id}>
        <header className="framework-bubble-header">
          <h2 id={`framework-${stance.id}`}>{stance.name}</h2>
          <div className="framework-definition-block">
            <div>
              <strong>Definition</strong>
              <p>{stance.definition}</p>
            </div>
            {stance.note && (
              <details className="framework-note">
                <summary aria-label={`Evidence note for ${stance.name}`}>!</summary>
                <p>{stance.note}</p>
              </details>
            )}
          </div>
          <div className="framework-evidence-chip" aria-label={`${stance.respondentCount} of 15 interviewees`}>
            <span><strong>{stance.respondentCount}</strong> / 15</span>
            <small>{stance.interviewees}</small>
          </div>
        </header>

        <section className="framework-decision-rule" aria-label={`${stance.name} decision rule`}>
          <strong>When to Use</strong>
          <p>{stance.decisionRule}</p>
        </section>

        <div className="framework-dimension-grid">
          {frameworkDimensions.map((dimension) => (
            <section
              className="framework-dimension-card"
              style={{ '--dimension-color': dimension.color }}
              key={dimension.id}
            >
              <h3>{dimension.label}</h3>
              <div className="framework-dimension-definition">
                <ul>
                  {dimensionBullets(stance.dimensions[dimension.id]).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <FrameworkCitations dimension={dimension} context="framework dimension" />
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function CapacityOverlay() {
  return (
    <article
      className="framework-capacity-overlay"
      style={{ '--stance-color': '#7b6c91' }}
      aria-labelledby="framework-capacity-title"
    >
      <header className="framework-capacity-header">
        <h2 id="framework-capacity-title">{capacityOverlay.name}</h2>
        <div className="framework-definition-block">
          <div>
            <strong>Definition</strong>
            <p>{capacityOverlay.definition}</p>
          </div>
          <details className="framework-note">
            <summary aria-label="Evidence note for the AI inevitability and capacity overlay">!</summary>
            <p>{capacityOverlay.note}</p>
          </details>
        </div>
      </header>

      <section className="framework-decision-rule" aria-label="Capacity overlay decision rule">
        <strong>When to Use</strong>
        <p>{capacityOverlay.decisionRule}</p>
      </section>

      <div className="framework-capacity-grid">
        {frameworkDimensions.map((dimension) => (
          <section
            className="framework-capacity-dimension"
            style={{ '--dimension-color': dimension.color }}
            key={dimension.id}
          >
            <h3>{dimension.label}</h3>
            <ul>
              {dimensionBullets(capacityOverlay.dimensions[dimension.id]).map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}

function UniversalMinimumPanel() {
  return (
    <details className="framework-universal-panel">
      <summary>
        <span>Universal Minimum Across Framework Dimensions</span>
        <i aria-hidden="true">›</i>
      </summary>
      <div className="framework-universal-content">
        <p>Baseline safeguards retained across every position on the AI-openness scale.</p>
        <div className="framework-universal-grid">
          {universalMinimum.map((dimension) => (
            <section
              className="framework-universal-dimension"
              style={{ '--dimension-color': dimension.color }}
              key={dimension.id}
            >
              <h3>{dimension.label}</h3>
              <div className="framework-universal-subdimensions">
                {dimension.subdimensions.map((subdimension) => (
                  <section className="framework-universal-subdimension" key={subdimension.label}>
                    <h4>{subdimension.label}</h4>
                    <ul>
                      {dimensionBullets(subdimension.definition).map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <FrameworkCitations dimension={dimension} context="universal minimum" />
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}

export function FrameworkOverlayToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      className="framework-overlay-toggle"
      role="switch"
      aria-checked={visible}
      onClick={onToggle}
    >
      <i aria-hidden="true"><span /></i>
      {visible ? 'Hide Overlay' : 'Show Overlay'}
    </button>
  );
}

export default function StrategyFrameworkSection({ overlayVisible }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const activeStance = strategyStances[activeIndex];
  const activeStrategies = frameworkStrategies(activeStance);
  const changeAttitude = (index) => {
    setActiveIndex(index);
    setExpandedId(null);
  };

  return (
    <section
      id="strategy-framework-view"
      className="strategy-framework"
      role="tabpanel"
      aria-labelledby="strategy-framework-tab"
    >
      <div className="framework-main-layout">
        <div className="framework-left-scroll">
          <AttitudeScale activeIndex={activeIndex} onChange={changeAttitude} />

          <FrameworkBubble
            stance={activeStance}
            activeIndex={activeIndex}
          />

          {overlayVisible && <CapacityOverlay />}

          <section className="framework-taxonomy-section" aria-labelledby="framework-taxonomy-title">
            <header>
              <h3 id="framework-taxonomy-title">Corresponding taxonomy strategies</h3>
              <p>Expand a strategy to inspect its definition and interview evidence.</p>
            </header>
            <div className="framework-anchor-list">
              {activeStrategies.map((strategy) => (
                <FrameworkStrategyRow
                  strategy={strategy}
                  expanded={expandedId === strategy.id}
                  key={strategy.id}
                  onToggle={() => setExpandedId((current) => (
                    current === strategy.id ? null : strategy.id
                  ))}
                />
              ))}
            </div>
          </section>
        </div>

        <UniversalMinimumPanel />
      </div>
    </section>
  );
}
