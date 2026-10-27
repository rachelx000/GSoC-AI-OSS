import { groups, stages, effects, impacts, pathways, byId } from '../data/research';
import './ExpandedImpactMap.css';

const mainPaths = pathways.filter((path) => path.linkType === 'main');
const bridges = pathways.filter((path) => path.sourceType === 'effect');

function ImpactButtons({ ids, onSelect, compact = false }) {
  return (
    <span className={compact ? 'overview-impact-chips' : 'overview-impact-tiles'}>
      {ids.map((id) => {
        const impact = byId(impacts, id);
        return (
          <button
            type="button"
            key={id}
            aria-label={`${id}: ${impact.figureName}. Choose a linked stage group.`}
            title={impact.figureName}
            onClick={() => onSelect(id)}
          >
            <span>{id}</span>
            {!compact && <strong>{impact.figureName}</strong>}
          </button>
        );
      })}
    </span>
  );
}

function StageEffectMap({ group, path, onStageSelect, onEffectSelect, onGroupSelect }) {
  const effectIds = new Set(path.effectIds);
  const linkedStages = stages.filter((stage) => stage.effectIds.some((id) => effectIds.has(id)));
  const localStages = linkedStages.filter((stage) => stage.groupId === group.id);
  const sharedStages = linkedStages.filter((stage) => stage.groupId !== group.id);

  return (
    <div className="overview-stage-effect-map">
      <div className="overview-stage-effect-headings">
        <div className="overview-stage-group">
          <button type="button" className="overview-group-button" onClick={() => onGroupSelect(group.id)}>
            <span>{group.id === 'governance' ? 'X · Cross-stage' : group.range}</span>
            <strong>{group.name}</strong>
          </button>
        </div>
        <div className="overview-effect-group">
          <span className="overview-group-caption subheader">Collective effect group</span>
        </div>
      </div>
      <div className="overview-stage-effect-rows">
        {[...localStages, ...sharedStages].map((stage) => {
          const shared = stage.groupId !== group.id;
          const sourceGroup = byId(groups, stage.groupId);
          const stageEffects = stage.effectIds.filter((id) => effectIds.has(id));
          return (
            <div className="overview-stage-effect-row" key={stage.id} data-stage={stage.id} data-shared={shared}>
              <div className="overview-stage-cell">
                <button
                  type="button"
                  className="overview-stage-tile"
                  data-shared={shared}
                  aria-label={`${stage.id}: ${stage.name}. Linked to ${stageEffects.join(', ')}. Focus ${sourceGroup.range}.`}
                  onClick={() => onStageSelect(stage.id)}
                >
                  <span className="overview-code">{stage.id}</span>
                  <span className="overview-node-name">
                    {stage.name}
                    {shared && <small className="overview-stage-origin">Shared from {sourceGroup.range}</small>}
                  </span>
                </button>
              </div>
              <span className="overview-stage-link" aria-hidden="true" />
              <div className="overview-effect-buttons" role="group" aria-label={`Effects linked to ${stage.id}`}>
                {stageEffects.map((id) => {
                  const effect = byId(effects, id);
                  return (
                    <div className="overview-effect-branch" data-from={stage.id} data-to={id} key={id}>
                      <button
                        type="button"
                        data-kind={effect.kind}
                        data-shared={shared}
                        aria-label={`${id}: ${effect.name}. Inspect interview excerpts in ${group.range}.`}
                        title={`${effect.name} · ${stage.id}`}
                        onClick={() => onEffectSelect(id, group.id)}
                      >
                        <span className="overview-code">{id}</span>
                        <span className="overview-node-name">{effect.name}</span>
                        {shared && <small className="overview-source-stage">From {effect.stageId}</small>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExpandedImpactMap({
  onStageSelect,
  onEffectSelect,
  onImpactSelect,
  onGroupSelect,
}) {
  return (
    <figure className="impact-overview">
      <div className="overview-key">
        <h2>Main linkages</h2>
        <p>Three broad impact groups, with governance across the cycle.</p>
      </div>
      <div
        className="impact-overview-scroll"
        tabIndex={0}
        role="region"
        aria-label="Expanded impact map. Scroll to explore the main and additional linkages."
      >
        <div className="impact-overview-map">
          <div className="overview-column-headings subheader" aria-hidden="true">
            <span>Mentoring stages</span>
            <span />
            <span>Challenges & opportunities</span>
            <span />
            <span>Main sustainability impacts</span>
          </div>
          {mainPaths.map((path, index) => {
            const group = byId(groups, path.groupId);
            const additionalPaths = pathways.filter((item) =>
              item.linkType === 'additional' && item.sourceType === 'group' && item.groupId === group.id,
            );
            const incoming = bridges.filter((item) => item.linkedGroupId === group.id);
            const outgoing = bridges.filter((item) =>
              item.effectIds.some((id) => byId(effects, id).groupId === group.id),
            );
            return (
              <section
                className="overview-main-link"
                data-group={group.id}
                data-pathway={path.id}
                data-link-type="main"
                key={path.id}
                aria-label={`Main linkage ${group.id === 'governance' ? 'X' : group.range}`}
                style={{ '--overview-color': group.color, '--overview-tint': group.tint }}
              >
                <div className="overview-main-chain">
                  <StageEffectMap
                    group={group}
                    path={path}
                    onStageSelect={onStageSelect}
                    onEffectSelect={onEffectSelect}
                    onGroupSelect={onGroupSelect}
                  />
                  <span className="overview-main-arrow" aria-label="connects to">→</span>
                  <div className="overview-impact-group">
                    <header className="overview-impact-heading">
                      <span className="overview-group-caption subheader">
                        {index < 3 ? `Impact group ${index + 1}` : 'Cross-stage impacts'}
                      </span>
                      {path.impactTheme && <h3>{path.impactTheme}</h3>}
                    </header>
                    <ImpactButtons ids={path.impactIds} onSelect={onImpactSelect} />
                  </div>
                </div>
                {(additionalPaths.length > 0 || incoming.length > 0 || outgoing.length > 0) && (
                  <div className="overview-additional-links">
                    {additionalPaths.map((additional) => (
                      <div className="overview-additional-line" data-link-type="additional" key={additional.id}>
                        <span className="overview-additional-label">Additional group link</span>
                        <strong>{group.range}</strong>
                        <span aria-label="also connects to">⇢</span>
                        <ImpactButtons ids={additional.impactIds} onSelect={onImpactSelect} compact />
                      </div>
                    ))}
                    {incoming.map((bridge) => bridge.effectIds.map((id) => {
                      const effect = byId(effects, id);
                      return (
                        <div className="overview-additional-line" data-link-type="additional" key={`incoming-${id}`}>
                          <span className="overview-additional-label">Shared opportunity</span>
                          <button type="button" onClick={() => onEffectSelect(id, group.id)}>{id} · {effect.stageId}</button>
                          <span>joins this group</span>
                        </div>
                      );
                    }))}
                    {outgoing.map((bridge) => (
                      <div className="overview-additional-line" data-link-type="additional" key={`outgoing-${bridge.id}`}>
                        <span className="overview-additional-label">Shared opportunity</span>
                        <strong>{bridge.effectIds.join(', ')}</strong>
                        <span>also joins</span>
                        <button type="button" onClick={() => onGroupSelect(bridge.linkedGroupId)}>
                          {byId(groups, bridge.linkedGroupId).range}
                        </button>
                        <span aria-label="connects to">⇢</span>
                        <ImpactButtons ids={bridge.impactIds} onSelect={onImpactSelect} compact />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
      <figcaption className="overview-caption">
        Select a stage, code, or impact to explore its links and interview evidence.
      </figcaption>
    </figure>
  );
}
