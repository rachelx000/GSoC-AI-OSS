import { useEffect, useId, useRef, useState } from 'react';
import {
  crossCuttingChallenges,
  getStageChallenges,
  pipelinePhases,
  pipelineStages,
} from '../data/challenges';
import { respondentColor, respondentTextColor } from '../data/challengeColors';

export default function LifecycleStageNavigator({
  selection,
  onBack,
  onStageSelect,
  onGovernanceSelect,
}) {
  const titleId = useId().replaceAll(':', '');
  const selectedOptionRef = useRef(null);
  const [governanceOpen, setGovernanceOpen] = useState(selection.kind === 'governance');
  const stageOptions = pipelineStages.map((stage) => ({
    id: stage.id,
    kind: 'stage',
    item: stage,
  }));
  const governanceOptions = crossCuttingChallenges.map((challenge) => ({
    id: challenge.id,
    kind: 'governance-challenge',
    item: challenge,
  }));
  const navigationOptions = [
    ...stageOptions,
    { id: 'X', kind: 'governance-parent' },
    ...(governanceOpen ? governanceOptions : []),
  ];
  const selectedId = selection.kind === 'governance'
    ? selection.challengeId ?? 'X'
    : selection.stageId;
  const selectedIndex = Math.max(0, navigationOptions.findIndex((option) => option.id === selectedId));
  const selectedOption = navigationOptions[selectedIndex];

  useEffect(() => {
    selectedOptionRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedId]);

  useEffect(() => {
    if (selection.kind === 'governance' && selection.challengeId) setGovernanceOpen(true);
  }, [selection.kind, selection.challengeId]);

  const selectOption = (option) => {
    if (option.kind === 'stage') onStageSelect(option.item.id);
    if (option.kind === 'governance-parent') {
      setGovernanceOpen((current) => !current);
      onGovernanceSelect();
    }
    if (option.kind === 'governance-challenge') onGovernanceSelect(option.item.id);
  };

  const step = (direction) => {
    const nextIndex = (
      selectedIndex + direction + navigationOptions.length
    ) % navigationOptions.length;
    selectOption(navigationOptions[nextIndex]);
  };

  return (
    <section
      className="flow-navigator"
      aria-labelledby={`${titleId}-title`}
    >
      <header className="flow-navigator-header">
        <button className="back-to-lifecycle" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Full lifecycle
        </button>
        <h2 id={`${titleId}-title`}>Pipeline stages &amp; governance</h2>
        <p>Choose any stage for associated challenges.</p>
      </header>

      <div className="flow-options" aria-label="S0 through S7, followed by expandable X Governance challenges">
        <div className="flow-stage-list">
          {stageOptions.map((option) => {
            const { item } = option;
            const isSelected = item.id === selectedId;
            const phase = pipelinePhases.find((candidate) => candidate.id === item.phaseId);
            const optionChallenges = getStageChallenges(item.id);

            return (
              <div key={item.id} className="flow-stage-group" data-selected={isSelected ? 'true' : 'false'}>
                <button
                  className="flow-stage-option"
                  ref={isSelected ? selectedOptionRef : null}
                  type="button"
                  aria-current={isSelected ? 'true' : undefined}
                  style={{ '--stage-color': phase.stageColor }}
                  onClick={() => selectOption(option)}
                >
                  <span>{item.id}</span>
                  <strong>{item.name}</strong>
                  <small>{phase.name}</small>
                </button>

                {isSelected && (
                  <div className="flow-stage-challenges" aria-label={`${item.name} challenges`}>
                    {optionChallenges.length ? optionChallenges.map((challenge) => (
                      <button
                        key={challenge.id}
                        type="button"
                        aria-current={challenge.id === selection.challengeId ? 'true' : undefined}
                        style={{
                          '--challenge-color': respondentColor(challenge.participantCount),
                          '--challenge-ink': respondentTextColor(challenge.participantCount),
                        }}
                        onClick={() => onStageSelect(item.id, challenge.id)}
                      >
                        <span>{challenge.id.replace('CH-', '')}</span>
                        <strong>{challenge.name}</strong>
                        <small>n = {challenge.participantCount}</small>
                      </button>
                    )) : (
                      <p>No stage-specific challenge is assigned in the current codebook.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flow-governance-group" data-expanded={governanceOpen ? 'true' : 'false'}>
          <button
            className="flow-stage-option flow-governance-parent"
            ref={selectedId === 'X' ? selectedOptionRef : null}
            type="button"
            aria-current={selectedId === 'X' ? 'true' : undefined}
            aria-expanded={governanceOpen}
            data-active={selection.kind === 'governance' ? 'true' : 'false'}
            style={{ '--stage-color': '#eadff1' }}
            onClick={() => selectOption({ kind: 'governance-parent' })}
          >
            <span>X</span>
            <strong>Governance</strong>
            <small>{governanceOpen ? 'Hide X.1–X.4' : 'Show X.1–X.4'}</small>
          </button>

          {governanceOpen && (
            <div className="flow-governance-children" aria-label="X Governance challenges">
              {governanceOptions.map((option) => {
                const { item } = option;
                const isSelected = item.id === selectedId;

                return (
                  <button
                    key={item.id}
                    className="flow-governance-option"
                    ref={isSelected ? selectedOptionRef : null}
                    type="button"
                    aria-current={isSelected ? 'true' : undefined}
                    style={{
                      '--challenge-color': respondentColor(item.participantCount),
                      '--challenge-ink': respondentTextColor(item.participantCount),
                    }}
                    onClick={() => selectOption(option)}
                  >
                    <span>{item.id.replace('CH-', '')}</span>
                    <strong>{item.name}</strong>
                    <small>n = {item.participantCount}</small>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flow-step-controls" aria-label="Previous or next focus item">
        <button type="button" onClick={() => step(-1)} aria-label="Previous focus item">↑</button>
        <span aria-live="polite">
          {selectedIndex + 1} / {navigationOptions.length} · {selectedOption.id.replace('CH-', '')}
        </span>
        <button type="button" onClick={() => step(1)} aria-label="Next focus item">↓</button>
      </div>
    </section>
  );
}
