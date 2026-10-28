import { useEffect, useRef, useState } from 'react';
import {
  groups,
  stages,
  effects,
  impacts,
  byId,
  getGroupScope,
  groupsForImpact,
} from '../data/research';
import PipelineCycle from './PipelineCycle';
import ExpandedImpactMap from './ExpandedImpactMap';
import FocusedImpactMap from './FocusedImpactMap';
import impactIcon from '../assets/impact.svg';

const findings = [
  {
    id: '01',
    groupId: 'entry',
    impactRange: 'IM1–IM3',
    title: 'Newcomers are harder to assess and develop.',
    copy: 'Proposals, contributions, and review answers reveal less about newcomers’ capability and learning.',
    tone: 'entry',
  },
  {
    id: '02',
    groupId: 'mentoring',
    impactRange: 'IM4–IM5',
    title: 'Mentoring time shifts toward verification.',
    copy: 'Checking code, understanding, and GenAI compliance draws time away from teaching.',
    tone: 'mentoring',
  },
  {
    id: '03',
    groupId: 'retention',
    impactRange: 'IM6–IM8',
    title: 'Verification work strains renewal.',
    copy: 'Accumulated demands erode the capacity and motivation needed to develop the next generation of mentors.',
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
  const workspace = useRef(null);
  const activeGroup = byId(groups, groupId);

  useEffect(() => {
    const header = document.querySelector('.site-header');
    const measure = () => {
      const top = header.getBoundingClientRect().height + 12;
      const element = workspace.current;
      if (!element) return;
      element.style.setProperty('--workspace-top', `${top}px`);
      element.style.setProperty('--workspace-height', `${Math.max(240, window.innerHeight - top - 12)}px`);
      if (element.dataset.fit === 'true')
        window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - top, behavior: 'instant' });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const revealWorkspace = () => requestAnimationFrame(() => {
    const element = workspace.current;
    if (!element) return;
    const top = parseFloat(getComputedStyle(element).getPropertyValue('--workspace-top'));
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - top, behavior: 'instant' });
  });

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
    revealWorkspace();
  };
  const showOverview = (nextView = view) => {
    setView(nextView);
    setGroupId(null);
    setSelection(null);
    setPickerId(null);
    revealWorkspace();
  };
  const selectStage = (id) =>
    focusGroup(byId(stages, id).groupId, { type: 'stage', id });
  const selectEffect = (id, focusedGroupId) =>
    focusGroup(focusedGroupId || byId(effects, id).groupId, { type: 'effect', id });
  const selectImpact = (id) => {
    const linkedGroups = groupsForImpact(id);
    if (linkedGroups.length === 1)
      focusGroup(linkedGroups[0].id, { type: 'impact', id });
    else setPickerId(id);
  };
  const connectionLabel = (groupId, impactId) => {
    const paths = getGroupScope(groupId).pathways.filter((path) => path.impactIds.includes(impactId));
    if (paths.some((path) => path.linkType === 'main')) return 'Main linkage';
    if (paths.some((path) => path.sourceType === 'group')) return 'Additional group linkage';
    return `Via ${paths.flatMap((path) => path.effectIds).join(', ')}`;
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
          <div className="page-title">
            <img src={impactIcon} alt="" />
            <h1>GenAI Impacts</h1>
          </div>
          <p>
            GenAI's effects compound from selection through review to renewal and
            converge on mentor capacity.
          </p>
        </div>
      </header>

      <section className="impact-findings" aria-label="High-level manuscript findings">
        {findings.map((finding) => (
          <article
            className={`finding-card finding-${finding.tone}`}
            key={finding.id}
          >
            <div>
              <button
                type="button"
                className="finding-group-link"
                onClick={() => focusGroup(finding.groupId)}
              >
                {finding.impactRange} <span aria-hidden="true">→</span>
              </button>
              <h2>{finding.title}</h2>
              <p>{finding.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        className="impact-workspace"
        ref={workspace}
        data-fit={Boolean(activeGroup || view === 'expanded')}
        aria-label="Interactive GenAI impacts"
      >
        <div className="impact-toolbar">
          <div className="view-switch" role="group" aria-label="Pipeline visualization">
            <button
              type="button"
              aria-pressed={!groupId && view === 'cycle'}
              onClick={() => showOverview('cycle')}
            >
              Cycle view
            </button>
            <button
              type="button"
              aria-pressed={!groupId && view === 'expanded'}
              onClick={() => showOverview('expanded')}
            >
              Expand impact map
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
          ) : view === 'cycle' ? (
            <span className="toolbar-hint">
              Select a stage or a group to inspect its evidence.
            </span>
          ) : null}
        </div>

        <nav className="group-navigation" aria-label="Focus a stage group">
          {groups.map((group) => (
            <button
              key={group.id}
              data-group={group.id}
              type="button"
              aria-pressed={groupId === group.id}
              onClick={() => focusGroup(group.id)}
              style={{
                '--group-color': group.color,
                '--group-tint': group.tint,
              }}
            >
              <i aria-hidden="true" />
              <strong>{group.range}</strong>
              <span>{group.name}</span>
            </button>
          ))}
        </nav>

        {pickerId && (
          <aside
            className="impact-picker"
            aria-labelledby="impact-picker-title"
          >
            <div>
              <span className="eyebrow subheader">
                {pickerId} · {byId(impacts, pickerId).figureName}
              </span>
              <h2 id="impact-picker-title" ref={pickerTitle} tabIndex={-1}>
                Choose a linked stage group
              </h2>
              <p>
                Select a group to explore its connection to {pickerId}.
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
                  <span className="picker-option-copy">
                    <span>{group.name}</span>
                    <small>{connectionLabel(group.id, pickerId)}</small>
                  </span>
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
                <span className="eyebrow subheader">
                  Focused stage group · {activeGroup.range}
                </span>
                <h2 tabIndex={-1} ref={focusTitle}>
                  {activeGroup.name}
                </h2>
              </div>
              <p>
                Explore the main impact group, additional links, and interview evidence.
              </p>
            </header>
            <FocusedImpactMap
              key={groupId}
              groupId={groupId}
              selection={selection}
              onSelect={(node) => {
                setSelection(node);
                revealWorkspace();
              }}
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
