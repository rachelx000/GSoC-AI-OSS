import { useEffect } from 'react';
import { byId, groups, stages, getGroupScope } from '../data/research';
import { Excerpts, LiteratureReferences } from './ResearchEvidence';

const groupLabel = (group) => group.id === 'governance' ? 'X · Governance' : group.range;

function codeSummary(ids) {
  const challenges = ids.filter((id) => id.startsWith('CH'));
  const opportunities = ids.filter((id) => id.startsWith('OP'));
  const challengeLabel = challenges.length > 2
    ? `${challenges[0]}–${challenges.at(-1)}`
    : challenges.join(', ');
  return [challengeLabel, opportunities.join(', ')].filter(Boolean).join(' + ');
}

function pathLabel(path) {
  if (path.sourceType === 'effect')
    return `${path.effectIds.join(', ')} joins ${groupLabel(byId(groups, path.linkedGroupId))}`;
  return `${path.linkType === 'main' ? 'Main' : 'Additional'} · ${groupLabel(byId(groups, path.groupId))}`;
}

function DisclosureButton({ id, label, selected, onClick, children }) {
  return (
    <>
      <button
        className="node-heading"
        type="button"
        aria-expanded={selected}
        aria-controls={`detail-${id}`}
        onClick={onClick}
      >
        <span className="code-pill">{id}</span>
        <strong>{label}</strong>
        <span className="disclosure-chevron" aria-hidden="true">{selected ? '−' : '+'}</span>
      </button>
      <div className="node-detail" id={`detail-${id}`} hidden={!selected}>{children}</div>
    </>
  );
}

function FigureConnections({ scope, selection, onSelect }) {
  return (
    <section className="figure-connections" aria-label="Main and additional linkages">
      <h3>Main and additional linkages</h3>
      <ul>
        {scope.pathways.map((path) => (
          <li
            key={path.id}
            data-source-type={path.sourceType}
            data-link-type={path.linkType}
            data-pathway={path.id}
            data-active={selection?.type === 'impact'
              ? path.impactIds.includes(selection.id)
              : selection?.type === 'effect' && path.effectIds.includes(selection.id)}
            style={{ '--path-color': path.color }}
          >
            <span className="connection-kind">
              {path.sourceType === 'effect' ? 'Cross-stage' : path.linkType === 'main' ? 'Main' : 'Additional'}
            </span>
            {path.sourceType === 'group' ? (
              <>
                <strong className="connection-source">{groupLabel(scope.group)}</strong>
                {path.linkType === 'main' && (
                  <>
                    <span className="connection-arrow" aria-hidden="true">→</span>
                    <span className="connection-codes">{codeSummary(path.effectIds)}</span>
                  </>
                )}
              </>
            ) : (
              <span className="connection-bridge">
                {path.effectIds.map((id) => (
                  <button
                    type="button"
                    key={id}
                    title={byId(scope.effects, id).name}
                    onClick={() => onSelect({ type: 'effect', id })}
                  >
                    {id} · {byId(scope.effects, id).stageId}
                  </button>
                ))}
                <span>joins {groupLabel(byId(groups, path.linkedGroupId))}</span>
              </span>
            )}
            <span className="connection-arrow" aria-label="connects to">→</span>
            <span className="connection-targets">
              {path.impactIds.map((id) => (
                <button
                  type="button"
                  key={id}
                  title={byId(scope.impacts, id).figureName}
                  onClick={() => onSelect({ type: 'impact', id })}
                >
                  {id}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EffectRecord({ effect, selected, onToggle }) {
  return (
    <article
      className={`effect-node effect-${effect.kind}`}
      id={`effect-${effect.id}`}
      data-selected={selected}
    >
      <DisclosureButton id={effect.id} label={effect.name} selected={selected} onClick={onToggle}>
        <p className="detail-label subheader">
          {effect.kind === 'challenge' ? 'Reported challenge or concern' : 'Reported opportunity'} · {effect.stageId}
        </p>
        <Excerpts items={effect.excerpts} label={`${effect.id} interview excerpts`} />
      </DisclosureButton>
    </article>
  );
}

function ImpactRecord({ impact, paths, selected, onToggle }) {
  return (
    <article className="impact-node" id={`impact-${impact.id}`} data-selected={selected}>
      <DisclosureButton id={impact.id} label={impact.figureName} selected={selected} onClick={onToggle}>
        <p className="detail-label subheader">What GSoC contributes to sustainability</p>
        <p className="function-definition">{impact.definition}</p>
        <Excerpts items={impact.excerpts} label={`${impact.id} sustainability evidence`} />
      </DisclosureButton>
      <ul className="implications" aria-label={`${impact.id} GenAI implications`}>
        {impact.implications.map((implication) => (
          <li data-kind={implication.kind} key={implication.text}>
            <span
              className="polarity-symbol"
              aria-label={implication.kind === 'adverse' ? 'Adverse implication' : 'Beneficial implication'}
            >
              {implication.kind === 'adverse' ? '−' : '+'}
            </span>
            <span>{implication.text}</span>
          </li>
        ))}
      </ul>
      <div className="pathway-notes" aria-label="Linkage sources">
        {paths.map((path) => (
          <p key={path.id} data-link-type={path.linkType}>
            <i style={{ background: path.color }} aria-hidden="true" />
            <span>{pathLabel(path)}</span>
          </p>
        ))}
      </div>
    </article>
  );
}

export default function FocusedImpactMap({ groupId, selection, onSelect }) {
  const scope = getGroupScope(groupId);
  const mainPath = scope.pathways.find((path) => path.linkType === 'main');
  const primaryIds = new Set(scope.primaryImpacts.map((impact) => impact.id));
  const additionalImpacts = scope.impacts.filter((impact) => !primaryIds.has(impact.id));
  const isSelected = (type, id) => selection?.type === type && selection.id === id;
  const toggle = (type, id) => onSelect(isSelected(type, id) ? null : { type, id });

  useEffect(() => {
    if (!selection || selection.type === 'stage') return;
    document.getElementById(`${selection.type}-${selection.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [selection]);

  const effectRecord = (effect) => (
    <EffectRecord
      key={effect.id}
      effect={effect}
      selected={isSelected('effect', effect.id)}
      onToggle={() => toggle('effect', effect.id)}
    />
  );
  const impactRecord = (impact) => (
    <ImpactRecord
      key={impact.id}
      impact={impact}
      paths={scope.pathways.filter((path) => path.impactIds.includes(impact.id))}
      selected={isSelected('impact', impact.id)}
      onToggle={() => toggle('impact', impact.id)}
    />
  );

  return (
    <div className="focused-map" style={{ '--group-color': scope.group.color, '--group-tint': scope.group.tint }}>
      <FigureConnections scope={scope} selection={selection} onSelect={onSelect} />
      <section className="focus-column stage-column" aria-labelledby="focus-stages-title">
        <header className="column-heading">
          <span className="eyebrow subheader">Literature-informed pipeline</span>
          <h3 id="focus-stages-title">Stages <span aria-hidden="true">→</span></h3>
        </header>
        <div className="stage-sequence">
          {scope.stages.map((stage) => (
            <article className="stage-node" key={stage.id} data-selected={isSelected('stage', stage.id)}>
              <div className="stage-node-title">
                <span className="code-pill">{stage.id}</span>
                <h4>{stage.name}</h4>
              </div>
              <div className="stage-effect-tags" aria-label="Associated effects">
                {stage.effectIds.map((id) => (
                  <button key={id} type="button" onClick={() => onSelect({ type: 'effect', id })}>{id}</button>
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
      <section className="focus-column effect-column" aria-labelledby="focus-effects-title">
        <header className="column-heading">
          <span className="eyebrow subheader">Interview findings</span>
          <h3 id="focus-effects-title">Challenges & opportunities <span aria-hidden="true">→</span></h3>
        </header>
        <div className="effect-list">
          {scope.stages.map((stage) => (
            <section className="stage-effects" key={stage.id} aria-label={`Effects at ${stage.id}`}>
              <h4 className="effect-stage-label">{stage.id} · {stage.name}</h4>
              {stage.effectIds.map((id) => effectRecord(byId(scope.effects, id)))}
            </section>
          ))}
          {scope.crossStageEffects.length > 0 && (
            <section className="stage-effects cross-stage-effects" aria-label="Cross-stage opportunities">
              <h4 className="effect-stage-label">Connected from another stage</h4>
              {scope.crossStageEffects.map((effect) => (
                <div className="cross-stage-effect" key={effect.id}>
                  <p>{effect.stageId} · {byId(stages, effect.stageId).name}</p>
                  {effectRecord(effect)}
                </div>
              ))}
            </section>
          )}
        </div>
      </section>
      <section className="focus-column impact-column" aria-labelledby="focus-impacts-title">
        <header className="column-heading">
          <span className="eyebrow subheader">Impact on GSoC</span>
          <h3 id="focus-impacts-title">GSoC sustainability</h3>
        </header>
        <section className="impact-subgroup" aria-label="Main impact group">
          <header className="impact-subgroup-heading">
            <span className="eyebrow subheader">{scope.group.id === 'governance' ? 'Cross-stage impacts' : 'Main impact group'} · {mainPath.impactIds.join(', ')}</span>
            {mainPath.impactTheme && <h4>{mainPath.impactTheme}</h4>}
          </header>
          <div className="impact-list">{scope.primaryImpacts.map(impactRecord)}</div>
        </section>
        {additionalImpacts.length > 0 && (
          <section className="impact-subgroup additional-impacts" aria-label="Additional linked impacts">
            <header className="impact-subgroup-heading"><h4>Additional linked impacts</h4></header>
            <div className="impact-list">{additionalImpacts.map(impactRecord)}</div>
          </section>
        )}
      </section>
    </div>
  );
}
