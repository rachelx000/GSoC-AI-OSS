import { useEffect } from 'react';
import { byId, getGroupScope } from '../data/research';
import { Excerpts, LiteratureReferences } from './ResearchEvidence';

function DisclosureButton({ id, label, code, selected, onClick, children }) {
  return (
    <>
      <button
        className="node-heading"
        type="button"
        aria-expanded={selected}
        aria-controls={`detail-${id}`}
        onClick={onClick}
      >
        <span className="code-pill">{code}</span>
        <strong>{label}</strong>
        <span className="disclosure-chevron" aria-hidden="true">
          {selected ? '−' : '+'}
        </span>
      </button>
      <div className="node-detail" id={`detail-${id}`} hidden={!selected}>
        {children}
      </div>
    </>
  );
}

export default function FocusedImpactMap({ groupId, selection, onSelect }) {
  const scope = getGroupScope(groupId);
  const isSelected = (type, id) =>
    selection?.type === type && selection.id === id;
  const toggle = (type, id) =>
    onSelect(isSelected(type, id) ? null : { type, id });
  useEffect(() => {
    if (!selection || selection.type === 'stage') return;
    document
      .getElementById(`${selection.type}-${selection.id}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selection]);

  return (
    <div
      className="focused-map"
      style={{
        '--group-color': scope.group.color,
        '--group-tint': scope.group.tint,
      }}
    >
      <section
        className="focus-column stage-column"
        aria-labelledby="focus-stages-title"
      >
        <header className="column-heading">
          <span className="eyebrow">Literature scaffold</span>
          <h3 id="focus-stages-title">
            Stages <span aria-hidden="true">→</span>
          </h3>
        </header>
        <div className="stage-sequence">
          {scope.stages.map((stage) => (
            <article
              className="stage-node"
              key={stage.id}
              data-selected={isSelected('stage', stage.id)}
            >
              <div className="stage-node-title">
                <span className="code-pill">{stage.id}</span>
                <h4>{stage.name}</h4>
              </div>
              <div
                className="stage-effect-tags"
                aria-label="Associated effects"
              >
                {stage.effectIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelect({ type: 'effect', id })}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <details className="stage-definition">
                <summary>Stage definition & literature</summary>
                <p>{stage.definition}</p>
                <LiteratureReferences ids={stage.referenceIds} />
              </details>
            </article>
          ))}
        </div>
      </section>

      <section
        className="focus-column effect-column"
        aria-labelledby="focus-effects-title"
      >
        <header className="column-heading">
          <span className="eyebrow">Interview findings</span>
          <h3 id="focus-effects-title">
            Challenges & opportunities <span aria-hidden="true">→</span>
          </h3>
        </header>
        <div className="effect-list">
          {scope.stages.map((stage) => (
            <section
              className="stage-effects"
              key={stage.id}
              aria-label={`Effects at ${stage.id}`}
            >
              <h4 className="effect-stage-label">
                {stage.id} · {stage.name}
              </h4>
              {stage.effectIds.map((id) => {
                const effect = byId(scope.effects, id);
                return (
                  <article
                    className={`effect-node effect-${effect.kind}`}
                    id={`effect-${id}`}
                    key={id}
                    data-selected={isSelected('effect', id)}
                  >
                    <DisclosureButton
                      id={id}
                      code={id}
                      label={effect.name}
                      selected={isSelected('effect', id)}
                      onClick={() => toggle('effect', id)}
                    >
                      <p className="detail-label">
                        {effect.kind === 'challenge'
                          ? 'Reported challenge or concern'
                          : 'Reported opportunity'}{' '}
                        · {stage.id}
                      </p>
                      <Excerpts
                        items={effect.excerpts}
                        label={`${id} interview excerpts`}
                      />
                    </DisclosureButton>
                  </article>
                );
              })}
            </section>
          ))}
        </div>
      </section>

      <section
        className="focus-column impact-column"
        aria-labelledby="focus-impacts-title"
      >
        <header className="column-heading">
          <span className="eyebrow">Linked functions</span>
          <h3 id="focus-impacts-title">GSoC sustainability</h3>
        </header>
        <div className="impact-list">
          {scope.impacts.map((impact) => {
            const paths = scope.pathways.filter((pathway) =>
              pathway.impactIds.includes(impact.id),
            );
            return (
              <article
                className="impact-node"
                id={`impact-${impact.id}`}
                key={impact.id}
                data-selected={isSelected('impact', impact.id)}
              >
                <DisclosureButton
                  id={impact.id}
                  code={impact.id}
                  label={impact.figureName}
                  selected={isSelected('impact', impact.id)}
                  onClick={() => toggle('impact', impact.id)}
                >
                  <p className="detail-label">
                    What GSoC contributes to sustainability
                  </p>
                  <p className="function-definition">{impact.definition}</p>
                  {impact.name !== impact.figureName && (
                    <p className="source-alias">
                      The supplement calls this “{impact.name}.”
                    </p>
                  )}
                  <Excerpts
                    items={impact.excerpts}
                    label={`${impact.id} sustainability evidence`}
                  />
                </DisclosureButton>
                <ul
                  className="implications"
                  aria-label={`${impact.id} GenAI implications in the manuscript figure`}
                >
                  {impact.implications.map((implication) => (
                    <li data-kind={implication.kind} key={implication.text}>
                      <span
                        className="polarity-symbol"
                        aria-label={
                          implication.kind === 'adverse'
                            ? 'Adverse implication'
                            : 'Beneficial implication'
                        }
                      >
                        {implication.kind === 'adverse' ? '−' : '+'}
                      </span>
                      <span>{implication.text}</span>
                    </li>
                  ))}
                </ul>
                <div
                  className="pathway-notes"
                  aria-label="Linked effect groups in the manuscript figure"
                >
                  {paths.map((path) => (
                    <p key={path.id}>
                      <i
                        style={{ background: path.color }}
                        aria-hidden="true"
                      />
                      <span>Figure pathway: {path.effectIds.join(', ')}</span>
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
