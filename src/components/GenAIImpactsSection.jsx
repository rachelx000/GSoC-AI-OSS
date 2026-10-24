import { useEffect, useRef, useState } from 'react';
import {
  groups,
  stages,
  effects,
  impacts,
  byId,
  groupsForImpact,
} from '../data/research';
import PipelineCycle from './PipelineCycle';
import ExpandedImpactMap from './ExpandedImpactMap';
import FocusedImpactMap from './FocusedImpactMap';
import { SourceNote } from './ResearchEvidence';

const findings = [
  {
    id: '01',
    title: 'The work reveals less about its author.',
    copy: 'Proposals, entry contributions, and review answers became weaker evidence of what newcomers understand and can do.',
    tone: 'entry',
  },
  {
    id: '02',
    title: 'Mentoring shifts toward verification.',
    copy: 'Mentors make up the difference by checking code, understanding, and compliance—using time they would otherwise spend teaching.',
    tone: 'mentoring',
  },
  {
    id: '03',
    title: 'That effort puts renewal under pressure.',
    copy: 'Verification draws on the same time and goodwill GSoC needs to develop future maintainers and mentors.',
    tone: 'retention',
  },
];

export default function GenAIImpactsSection() {
  const [view, setView] = useState('cycle');
  const [groupId, setGroupId] = useState(null);
  const [selection, setSelection] = useState(null);
  const [pickerId, setPickerId] = useState(null);
  const focusTitle = useRef(null);
  const pickerTitle = useRef(null);
  const activeGroup = byId(groups, groupId);

  useEffect(() => {
    if (groupId) focusTitle.current?.focus({ preventScroll: true });
  }, [groupId]);
  useEffect(() => {
    if (pickerId) pickerTitle.current?.focus();
  }, [pickerId]);

  const focusGroup = (id, node = null) => {
    setGroupId(id);
    setSelection(node);
    setPickerId(null);
  };
  const showOverview = (nextView = view) => {
    setView(nextView);
    setGroupId(null);
    setSelection(null);
    setPickerId(null);
  };
  const selectStage = (id) =>
    focusGroup(byId(stages, id).groupId, { type: 'stage', id });
  const selectEffect = (id) =>
    focusGroup(byId(effects, id).groupId, { type: 'effect', id });
  const selectImpact = (id) => {
    const linkedGroups = groupsForImpact(id);
    if (linkedGroups.length === 1)
      focusGroup(linkedGroups[0].id, { type: 'impact', id });
    else setPickerId(id);
  };

  return (
    <main
      id="impacts-panel"
      className="research-page impacts-page"
      role="tabpanel"
      aria-labelledby="impacts-tab"
    >
      <header className="page-heading">
        <div>
          <span className="eyebrow">
            RQ1 · GenAI across the mentoring pipeline
          </span>
          <h1>GenAI Impacts</h1>
          <p>
            Cheaper production changes what work reveals about a newcomer and
            who has to do the checking.
          </p>
        </div>
        <p className="page-aside">
          Trace challenges and opportunities to the sustainability functions
          they put under pressure or support.
        </p>
      </header>

      <section className="impact-findings" aria-label="High-level manuscript findings">
        {findings.map((finding) => (
          <article
            className={`finding-card finding-${finding.tone}`}
            key={finding.id}
          >
            <span className="finding-number">{finding.id}</span>
            <div>
              <h2>{finding.title}</h2>
              <p>{finding.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        className="impact-workspace"
        aria-label="Interactive GenAI impacts"
      >
        <div className="impact-toolbar">
          <div className="view-switch" aria-label="Pipeline visualization">
            <button
              type="button"
              aria-pressed={!groupId && view === 'cycle'}
              onClick={() => showOverview('cycle')}
            >
              <span aria-hidden="true">⟳</span> Cycle view
            </button>
            <button
              type="button"
              aria-pressed={!groupId && view === 'expanded'}
              onClick={() => showOverview('expanded')}
            >
              <span aria-hidden="true">⤢</span> Expand impact map
            </button>
          </div>
          {groupId ? (
            <button
              type="button"
              className="text-button"
              onClick={() => showOverview()}
            >
              ← All stage groups
            </button>
          ) : (
            <span className="toolbar-hint">
              Select a stage or a group to inspect its evidence.
            </span>
          )}
        </div>

        <nav className="group-navigation" aria-label="Focus a stage group">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-pressed={groupId === group.id}
              onClick={() => focusGroup(group.id)}
              style={{
                '--group-color': group.color,
                '--group-tint': group.tint,
              }}
            >
              <i aria-hidden="true" />
              <span>
                <strong>{group.range}</strong>
                {group.name}
              </span>
            </button>
          ))}
        </nav>

        {pickerId && (
          <aside
            className="impact-picker"
            aria-labelledby="impact-picker-title"
          >
            <div>
              <span className="eyebrow">
                {pickerId} · {byId(impacts, pickerId).figureName}
              </span>
              <h2 id="impact-picker-title" ref={pickerTitle} tabIndex={-1}>
                Choose a linked stage group
              </h2>
              <p>
                This function receives figure pathways from more than one group.
                Choose one to keep the evidence in context.
              </p>
            </div>
            <div className="picker-options">
              {groupsForImpact(pickerId).map((group) => (
                <button
                  type="button"
                  key={group.id}
                  onClick={() =>
                    focusGroup(group.id, { type: 'impact', id: pickerId })
                  }
                >
                  <strong>{group.range}</strong>
                  {group.name}
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="picker-close"
              aria-label="Close linked-group picker"
              onClick={() => setPickerId(null)}
            >
              ×
            </button>
          </aside>
        )}

        {activeGroup ? (
          <>
            <header
              className="focus-heading"
              style={{ '--group-color': activeGroup.color }}
            >
              <div>
                <span className="eyebrow">
                  Focused stage group · {activeGroup.range}
                </span>
                <h2 tabIndex={-1} ref={focusTitle}>
                  {activeGroup.name}
                </h2>
              </div>
              <p>
                Expand a stage definition, an interview excerpt, or a
                sustainability function below.
              </p>
            </header>
            <FocusedImpactMap
              groupId={groupId}
              selection={selection}
              onSelect={setSelection}
            />
          </>
        ) : view === 'cycle' ? (
          <PipelineCycle
            onStageSelect={selectStage}
            onGroupSelect={focusGroup}
          />
        ) : (
          <ExpandedImpactMap
            onStageSelect={selectStage}
            onEffectSelect={selectEffect}
            onImpactSelect={selectImpact}
            onGroupSelect={focusGroup}
          />
        )}
      </section>
    </main>
  );
}
