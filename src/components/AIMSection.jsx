import { useEffect, useRef, useState } from 'react';
import aimIcon from '../assets/AIM.svg';
import { stances, capacity } from '../data/research';

const INTEGRATION = [
  { id: 'entry', name: 'Entry and early preparation', range: 'S0–S3' },
  {
    id: 'mentoring',
    name: 'Mentoring, review, and evaluation',
    range: 'S4–S6',
  },
  { id: 'governance', name: 'Governance', range: 'Across the cycle' },
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

export default function AIMSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scale = useRef(null);
  const stance = stances[activeIndex];

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
            <h1>AIM</h1>
          </div>
          <p>Choose GenAI responses that protect learning and mentor capacity.</p>
        </div> 
      </header>
      <div className="aim-definition" aria-label="What AIM means">
        <section>
          <span>A</span>
          <div>
            <h2>Acceptable GenAI use</h2>
            <p>What assistance does the project permit?</p>
          </div>
        </section>
        <section>
          <span>I</span>
          <div>
            <h2>Integration into the mentoring pipeline</h2>
            <p>How will mentors teach and check understanding?</p>
          </div>
        </section>
        <section>
          <span>M</span>
          <div>
            <h2>Mentoring capacity</h2>
            <p>How much of this work can mentors sustain?</p>
          </div>
        </section>
      </div>

      <section
        className="aim-stance-workspace"
        style={{ '--stance-color': stance.color, '--stance-tint': stance.tint }}
        aria-label="Explore acceptable GenAI use stances"
      >
        <div className="stance-scale" ref={scale}>
          <div className="scale-caption">
            <span>More restrictive</span>
            <strong>A · Acceptable GenAI use</strong>
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
        <article
          className="stance-profile"
          key={stance.id}
          aria-labelledby="stance-title"
        >
          <header>
            <div>
              <span className="eyebrow subheader">A · Stance definition</span>
              <h2 id="stance-title" aria-live="polite">
                {stance.name}
              </h2>
            </div>
            <p>Contributors remain accountable for what they submit.</p>
          </header>
          <Actions items={stance.actions.boundary} />
          {stance.id === 'advocate' && (
            <p className="conceptual-note">
              Conceptual extension beyond participants’ reported practices.
            </p>
          )}
        </article>
        <section
          className="integration-section"
          aria-labelledby="integration-title"
        >
          <header className="aim-section-heading">
            <span>I</span>
            <div>
              <h2 id="integration-title">
                Integration into the mentoring pipeline
              </h2>
              <p>
                Put the {stance.name.toLowerCase()} stance into practice, with
                checks that also support learning.
              </p>
            </div>
          </header>
          <div className="integration-grid">
            {INTEGRATION.map((row) => (
              <section className="integration-card" key={row.id}>
                <span className="eyebrow subheader">{row.range}</span>
                <h3>{row.name}</h3>
                <Actions items={stance.actions[row.id]} />
              </section>
            ))}
          </div>
        </section>
      </section>

      <section className="capacity-section" aria-labelledby="capacity-title">
        <header className="aim-section-heading">
          <span>M</span>
          <div>
            <h2 id="capacity-title">Mentoring capacity</h2>
            <p>
              Name who checks the work, budget their time, and protect their
              ability to return next cycle.
            </p>
          </div>
        </header>
        <div className="capacity-grid">
          {capacity.map((dimension) => (
            <section key={dimension.name}>
              <h3>{dimension.name}</h3>
              <Actions items={dimension.actions} />
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
