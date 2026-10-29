import { useEffect, useRef, useState } from 'react';
import aimIcon from '../assets/AIM.svg';
import { stances, capacity } from '../data/research';

const CONTEXTS = [
  { id: 'boundary', name: 'GenAI boundary', label: 'GenAI boundary', dimension: 'A' },
  { id: 'entry', name: 'Entry and early preparation', label: 'Entry & prep', range: 'S0–S3', dimension: 'I' },
  {
    id: 'mentoring',
    name: 'Mentoring, review, and evaluation',
    label: 'Mentoring & review',
    range: 'S4–S6',
    dimension: 'I',
  },
  { id: 'governance', name: 'Governance', label: 'Governance', range: 'Across the cycle', dimension: 'I' },
];

function Actions({ items }) {
  return (
    <ul className="aim-actions">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DimensionHeading({ id, title, question }) {
  return (
    <header className="aim-section-heading">
      <h2 id={id}>
        <span className={`aim-initial-${title[0].toLowerCase()}`}>{title[0]}</span>{title.slice(1)}
      </h2>
      <p>{question}</p>
    </header>
  );
}

export default function AIMSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contextIndex, setContextIndex] = useState(0);
  const scale = useRef(null);
  const contextTabs = useRef([]);
  const stance = stances[activeIndex];
  const context = CONTEXTS[contextIndex];
  const capacityGuidance = capacity.find((item) => item.name === context.name);

  const navigateContexts = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % CONTEXTS.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + CONTEXTS.length) % CONTEXTS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = CONTEXTS.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setContextIndex(next);
    contextTabs.current[next]?.focus();
  };

  useEffect(() => {
    const control = scale.current;
    let accumulated = 0;
    let lastStep = 0;
    const wheel = (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (!delta || event.ctrlKey) return;
      event.preventDefault();
      accumulated += delta * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(accumulated) < 30 || event.timeStamp - lastStep < 110)
        return;
      const direction = accumulated > 0 ? 1 : -1;
      setActiveIndex((current) =>
        Math.max(0, Math.min(stances.length - 1, current + direction)),
      );
      accumulated = 0;
      lastStep = event.timeStamp;
    };
    control.addEventListener('wheel', wheel, { passive: false });
    return () => control.removeEventListener('wheel', wheel);
  }, []);

  return (
    <main
      id="aim-panel"
      className="research-page aim-page"
      role="tabpanel"
      aria-labelledby="aim-tab"
    >
      <header className="page-heading">
        <div>
          <div className="page-title">
            <img src={aimIcon} alt="" />
            <h1 aria-label="AIM">
              <span className="aim-initial-a">A</span>
              <span className="aim-initial-i">I</span>
              <span className="aim-initial-m">M</span>
            </h1>
          </div>
          <p>Choose GenAI responses that protect learning and mentor capacity.</p>
        </div>
      </header>

      <section
        className="aim-stance-workspace"
        style={{ '--stance-color': stance.color, '--stance-tint': stance.tint }}
        aria-label="AIM mentoring and governance framework"
      >
        <div className="stance-scale" ref={scale}>
          <div className="scale-caption">
            <span>More restrictive</span>
            <h2 className="aim-current-stance" id="stance-title" aria-live="polite">
              <i aria-hidden="true" />{stance.name}
            </h2>
            <span>More permissive</span>
          </div>
          <div className="stance-control">
            <input
              className="stance-range"
              type="range"
              min="0"
              max="4"
              step="1"
              value={activeIndex}
              aria-label="Acceptable GenAI use stance"
              aria-valuetext={stance.name}
              onChange={(event) => setActiveIndex(Number(event.target.value))}
            />
            <div className="stance-labels">
              {stances.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                >
                  <i style={{ background: item.color }} aria-hidden="true" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="scale-help">
            Drag, scroll over the colorbar, use arrow keys, or select a stance.
          </p>
        </div>
        <nav className="aim-context-navigation" role="tablist" aria-label="Framework context">
          {['A', 'I'].map((dimension) => (
            <div className="aim-context-group" data-dimension={dimension} role="presentation" key={dimension}>
              <span className="aim-context-dimension" aria-hidden="true">{dimension}</span>
              {CONTEXTS.map((item, index) => item.dimension === dimension && (
                <button
                  type="button"
                  role="tab"
                  id={`aim-context-${item.id}`}
                  key={item.id}
                  ref={(element) => { contextTabs.current[index] = element; }}
                  aria-label={`${dimension === 'A' ? 'Acceptable GenAI use' : 'Integration'}: ${item.name}${item.range ? `, ${item.range}` : ''}`}
                  title={item.name}
                  aria-selected={contextIndex === index}
                  aria-controls="aim-context-panel"
                  tabIndex={contextIndex === index ? 0 : -1}
                  onClick={() => setContextIndex(index)}
                  onKeyDown={(event) => navigateContexts(event, index)}
                >
                  {item.range && <span className="aim-context-range">{item.range}</span>}
                  <span className="aim-context-label">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
          <div
            className="aim-context-static"
            aria-hidden="true"
            title="Mentoring capacity is shown alongside every context"
          >
            <span className="aim-context-dimension aim-initial-m">M</span>
            <span>Mentoring capacity</span>
          </div>
        </nav>
        <div
          className="aim-guidance"
          id="aim-context-panel"
          key={`${stance.id}-${context.id}`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`aim-context-${context.id}`}
        >
          <section className="aim-guidance-card" aria-labelledby="stance-guidance-title">
            <DimensionHeading
              id="stance-guidance-title"
              title={context.id === 'boundary' ? 'Acceptable GenAI Use' : 'Integration into the mentoring pipeline'}
              question={context.id === 'boundary' ? 'What assistance does the project permit?' : 'How will mentors teach and check understanding?'}
            />
            <Actions items={stance.actions[context.id]} />
          </section>
          <section className="aim-guidance-card aim-capacity-card" aria-labelledby="capacity-title">
            <DimensionHeading
              id="capacity-title"
              title="Mentoring capacity"
              question="How much of this work can mentors sustain?"
            />
            <Actions items={capacityGuidance.actions} />
          </section>
        </div>
      </section>
    </main>
  );
}
