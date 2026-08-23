import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChallengeCollection,
  LiteratureEvidence,
} from './ChallengeEvidence';
import LifecycleStageNavigator from './LifecycleSectorNavigator';
import MentoringLifecycle from './MentoringLifecycle';
import {
  crossCuttingChallenges,
  getStageChallenges,
  pipelinePhases,
  pipelineStages,
} from '../data/challenges';

const evidenceTabs = ['definition', 'challenges'];
const governanceDefinition = 'It captures empirically derived challenges that affect multiple stages of the GSoC mentoring pipeline. They share concerns related to OSS governance, accountability, confidentiality, and the management of risks introduced or intensified in the AI-era.';
const governanceLiteratureBoundary = 'Only S0-S7 are supported by previous literature, and this X stage is empirical.';

function GovernanceSummary({ showSelectedDefinition = false }) {
  return showSelectedDefinition && (
    <section className="governance-definition">
      <span className="evidence-provenance">Interview-derived stage</span>
      <p>{governanceDefinition}</p>
      <p className="governance-literature-boundary">{governanceLiteratureBoundary}</p>
    </section>
  );
}

function EvidenceTabs({ activeTab, onChange, scope }) {
  const moveFocus = (event, direction) => {
    event.preventDefault();
    const currentIndex = evidenceTabs.indexOf(activeTab);
    const nextTab = evidenceTabs[(currentIndex + direction + evidenceTabs.length) % evidenceTabs.length];
    onChange(nextTab);
    event.currentTarget.parentElement.querySelector(`[data-tab="${nextTab}"]`)?.focus();
  };

  return (
    <div className="evidence-tabs" role="tablist" aria-label="Stage evidence views">
      {evidenceTabs.map((tab) => (
        <button
          key={tab}
          id={`${scope}-${tab}-tab`}
          className="evidence-tab"
          data-tab={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls={`${scope}-${tab}-panel`}
          tabIndex={activeTab === tab ? 0 : -1}
          onClick={() => onChange(tab)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') moveFocus(event, -1);
            if (event.key === 'ArrowRight') moveFocus(event, 1);
          }}
        >
          {tab === 'definition' ? 'Definition' : 'Challenges'}
        </button>
      ))}
    </div>
  );
}

function orderedBySelection(challengeList, selectedId) {
  if (!selectedId) return challengeList;
  return [...challengeList].sort((a, b) => (
    Number(b.id === selectedId) - Number(a.id === selectedId)
  ));
}

export default function ChallengesSection() {
  const [showChallenges, setShowChallenges] = useState(false);
  const [selection, setSelection] = useState({ kind: 'overview' });
  const [detailTab, setDetailTab] = useState('definition');
  const evidenceTitleRef = useRef(null);
  const previousSelectionKindRef = useRef(selection.kind);
  const stage = selection.kind === 'phase'
    ? pipelineStages.find((item) => item.id === selection.stageId)
    : null;
  const phase = selection.kind === 'phase'
    ? pipelinePhases.find((item) => item.id === selection.phaseId)
    : null;
  const stageChallengeList = useMemo(
    () => (stage ? getStageChallenges(stage.id) : []),
    [stage],
  );
  const activeGovernanceChallenge = selection.kind === 'governance' && selection.challengeId
    ? crossCuttingChallenges.find((challenge) => challenge.id === selection.challengeId) ?? null
    : null;
  const visibleChallenges = useMemo(() => {
    const challengeList = selection.kind === 'governance' && selection.challengeId
      ? crossCuttingChallenges.filter((challenge) => challenge.id === selection.challengeId)
      : selection.kind === 'governance'
        ? crossCuttingChallenges
        : stageChallengeList;
    return orderedBySelection(challengeList, selection.challengeId);
  }, [selection.kind, selection.challengeId, stageChallengeList]);

  useEffect(() => {
    if (previousSelectionKindRef.current === 'overview' && selection.kind !== 'overview') {
      evidenceTitleRef.current?.focus();
    }
    previousSelectionKindRef.current = selection.kind;
  }, [selection.kind]);

  const inspectStage = (stageId, challengeId) => {
    const nextStage = pipelineStages.find((item) => item.id === stageId);
    const nextChallenges = getStageChallenges(stageId);
    setSelection({
      kind: 'phase',
      phaseId: nextStage.phaseId,
      stageId,
      challengeId: challengeId ?? nextChallenges[0]?.id ?? null,
    });
    setDetailTab(challengeId ? 'challenges' : 'definition');
  };

  const inspectPhase = (phaseId) => {
    const nextPhase = pipelinePhases.find((item) => item.id === phaseId);
    inspectStage(nextPhase.stageIds[0]);
  };

  const inspectGovernance = (challengeId) => {
    const selectedChallengeId = typeof challengeId === 'string' ? challengeId : null;
    setSelection({
      kind: 'governance',
      challengeId: selectedChallengeId,
    });
    setDetailTab(selectedChallengeId ? 'challenges' : 'definition');
  };

  return (
    <main
      id="challenges-panel"
      className="challenges-page"
      role="tabpanel"
      aria-labelledby="challenges-tab"
    >
      <div className="challenges-frame">
        <div className="challenges-workspace" data-view={selection.kind === 'overview' ? 'overview' : 'selected'}>
          <section className="lifecycle-panel" aria-label="Mentoring pipeline navigation">
            {selection.kind === 'overview' ? (
              <MentoringLifecycle
                showChallenges={showChallenges}
                onToggleChallenges={() => setShowChallenges((current) => !current)}
                onPhaseSelect={inspectPhase}
                onStageSelect={inspectStage}
                onGovernanceSelect={inspectGovernance}
              />
            ) : (
              <LifecycleStageNavigator
                selection={selection}
                onBack={() => setSelection({ kind: 'overview' })}
                onStageSelect={inspectStage}
                onGovernanceSelect={inspectGovernance}
              />
            )}
          </section>

          {selection.kind === 'phase' && stage && phase && (
            <section className="stage-evidence" aria-labelledby={`stage-evidence-${stage.id}`}>
              <header className="stage-evidence-header">
                <div>
                  <span style={{ '--phase-color': phase.color }}>{phase.name}</span>
                  <small>{stage.id}</small>
                </div>
                <h2 id={`stage-evidence-${stage.id}`} ref={evidenceTitleRef} tabIndex="-1">{stage.name}</h2>
              </header>

              <EvidenceTabs
                activeTab={detailTab}
                onChange={setDetailTab}
                scope={`stage-${stage.id}`}
              />

              <div
                id={`stage-${stage.id}-definition-panel`}
                className="evidence-tab-panel"
                role="tabpanel"
                aria-labelledby={`stage-${stage.id}-definition-tab`}
                hidden={detailTab !== 'definition'}
              >
                <section className="pipeline-stage-definition">
                  <span className="evidence-provenance">Stage definition</span>
                  <p>{stage.pipelineDefinition}</p>
                </section>
                <LiteratureEvidence stage={stage} />
              </div>

              <div
                id={`stage-${stage.id}-challenges-panel`}
                className="evidence-tab-panel"
                role="tabpanel"
                aria-labelledby={`stage-${stage.id}-challenges-tab`}
                hidden={detailTab !== 'challenges'}
              >
                <section className="stage-challenge-evidence" aria-labelledby={`challenges-${stage.id}`}>
                  <header>
                    <div>
                      <span className="evidence-provenance">Interview-derived open coding</span>
                      <h3 id={`challenges-${stage.id}`}>Challenge evidence</h3>
                    </div>
                    <strong>{stageChallengeList.length}</strong>
                  </header>
                  <p className="evidence-disclosure-note">
                    Expand each example to read the workbook's exact verbatim.
                  </p>
                  <ChallengeCollection challenges={visibleChallenges} />
                </section>
              </div>
            </section>
          )}

          {selection.kind === 'governance' && (
            <section className="stage-evidence governance-evidence" aria-labelledby="governance-evidence-title">
              <header className="stage-evidence-header">
                <div>
                  <span style={{ '--phase-color': '#eadff1' }}>Cross-pipeline stage</span>
                  <small>{activeGovernanceChallenge?.id.replace('CH-', '') ?? 'X'}</small>
                </div>
                <h2 id="governance-evidence-title" ref={evidenceTitleRef} tabIndex="-1">Governance</h2>
              </header>

              <EvidenceTabs
                activeTab={detailTab}
                onChange={setDetailTab}
                scope="governance"
              />

              <div
                id="governance-definition-panel"
                className="evidence-tab-panel"
                role="tabpanel"
                aria-labelledby="governance-definition-tab"
                hidden={detailTab !== 'definition'}
              >
                <GovernanceSummary showSelectedDefinition/>
              </div>

              <div
                id="governance-challenges-panel"
                className="evidence-tab-panel"
                role="tabpanel"
                aria-labelledby="governance-challenges-tab"
                hidden={detailTab !== 'challenges'}
              >
                <GovernanceSummary selectedChallenge={activeGovernanceChallenge} />
                <section className="stage-challenge-evidence governance-challenge-detail" aria-labelledby="governance-challenges-heading">
                  <header>
                    <div>
                      <span className="evidence-provenance">Interview-derived open coding</span>
                      <h3 id="governance-challenges-heading">Challenge evidence</h3>
                    </div>
                    <strong>{visibleChallenges.length}</strong>
                  </header>
                  <p className="evidence-disclosure-note">
                    Expand each example to read the workbook's exact verbatim.
                  </p>
                  <ChallengeCollection challenges={visibleChallenges} />
                </section>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
