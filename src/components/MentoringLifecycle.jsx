import { useId, useMemo } from 'react';
import { arc } from 'd3';
import {
  crossCuttingChallenges,
  getStageChallenges,
  pipelinePhases,
  pipelineStages,
} from '../data/challenges';
import {
  respondentColor,
  respondentBands,
  respondentTextColor,
} from '../data/challengeColors';

const TAU = Math.PI * 2;
const VIEW_HEIGHT = 660;
const CENTER_X = 600;
const CENTER_Y = 330;
const PHASE_LABEL_RADIUS = 121;

const MAP_CHALLENGE_SCALE = 0.9;

function phaseLabelPath({ startAngle, endAngle }) {
  const middleAngle = (startAngle + endAngle) / 2;
  const reverse = middleAngle > Math.PI / 2 && middleAngle < Math.PI * 1.5;
  const pathStart = reverse ? endAngle : startAngle;
  const pathEnd = reverse ? startAngle : endAngle;
  const start = [
    Math.sin(pathStart) * PHASE_LABEL_RADIUS,
    -Math.cos(pathStart) * PHASE_LABEL_RADIUS,
  ];
  const end = [
    Math.sin(pathEnd) * PHASE_LABEL_RADIUS,
    -Math.cos(pathEnd) * PHASE_LABEL_RADIUS,
  ];

  return `M ${start[0]} ${start[1]} A ${PHASE_LABEL_RADIUS} ${PHASE_LABEL_RADIUS} 0 0 ${reverse ? 0 : 1} ${end[0]} ${end[1]}`;
}

function wrapLeafLabel(label, maxLength = 31) {
  const words = label.split(' ');
  const lines = [''];

  words.forEach((word) => {
    const lineIndex = lines.length - 1;
    const nextLine = `${lines[lineIndex]} ${word}`.trim();
    if (nextLine.length <= maxLength || !lines[lineIndex]) {
      lines[lineIndex] = nextLine;
    } else {
      lines.push(word);
    }
  });

  return lines;
}

export default function MentoringLifecycle({
  showChallenges,
  onToggleChallenges,
  onPhaseSelect,
  onStageSelect,
  onGovernanceSelect,
}) {
  const titleId = useId().replaceAll(':', '');
  const stageAngle = TAU / pipelineStages.length;
  const stageArc = useMemo(
    () => arc().innerRadius(158).outerRadius(240).cornerRadius(8).padAngle(0.025),
    [],
  );
  const phaseArc = useMemo(
    () => arc().innerRadius(88).outerRadius(154).cornerRadius(10).padAngle(0.022),
    [],
  );
  const leafGroups = useMemo(() => {
    const leafWidth = 330;
    const leafGap = 4;
    const groupGap = 8;
    const stageGroups = pipelineStages
      .map((stage, index) => {
        const challenges = getStageChallenges(stage.id);
        const midAngle = (index + 0.5) * stageAngle;
        return {
          stage,
          challenges: challenges.map((challenge) => {
            const lines = wrapLeafLabel(challenge.name);
            return {
              ...challenge,
              lines,
              height: Math.max(49, 22 + lines.length * 15),
            };
          }),
          anchorX: CENTER_X + Math.sin(midAngle) * 240 * MAP_CHALLENGE_SCALE,
          anchorY: CENTER_Y - Math.cos(midAngle) * 240 * MAP_CHALLENGE_SCALE,
          side: Math.sin(midAngle) >= 0 ? 'right' : 'left',
          isGovernance: false,
        };
      })
      .filter((group) => group.challenges.length);
    const governanceGroup = {
      stage: { id: 'X', name: 'Governance' },
      challenges: crossCuttingChallenges.map((challenge) => {
        const lines = wrapLeafLabel(challenge.name);
        return {
          ...challenge,
          lines,
          height: Math.max(49, 22 + lines.length * 15),
        };
      }),
      anchorX: CENTER_X + 54 * MAP_CHALLENGE_SCALE,
      anchorY: CENTER_Y + 35 * MAP_CHALLENGE_SCALE,
      side: 'right',
      isGovernance: true,
    };
    const groups = [...stageGroups, governanceGroup];

    return ['left', 'right'].flatMap((side) => {
      const sideGroups = groups
        .filter((group) => group.side === side)
        .sort((a, b) => a.anchorY - b.anchorY);
      const totalHeight = sideGroups.reduce((sum, group, index) => (
        sum
        + group.challenges.reduce((leafSum, challenge) => leafSum + challenge.height, 0)
        + (group.challenges.length - 1) * leafGap
        + (index ? groupGap : 0)
      ), 0);
      let y = Math.max(8, (VIEW_HEIGHT - totalHeight) / 2);

      return sideGroups.map((group, groupIndex) => {
        if (groupIndex) y += groupGap;
        const leaves = group.challenges.map((challenge) => {
          const leaf = { ...challenge, y };
          y += challenge.height + leafGap;
          return leaf;
        });
        y -= leafGap;
        const startY = leaves[0].y;
        const endY = leaves.at(-1).y + leaves.at(-1).height;
        const leafX = side === 'right' ? 858 : 12;

        return {
          ...group,
          leaves,
          leafX,
          leafWidth,
          branchX: side === 'right' ? leafX : leafX + leafWidth,
          midY: (startY + endY) / 2,
        };
      });
    });
  }, [stageAngle]);

  return (
    <>
      <div className="lifecycle-map-controls">
        <button
          className="challenge-visibility-toggle"
          type="button"
          role="switch"
          aria-checked={showChallenges}
          onClick={onToggleChallenges}
        >
          <i aria-hidden="true"><span /></i>
          {showChallenges ? 'Hide challenges' : 'Show challenges'}
        </button>
      </div>

      <figure className="lifecycle-figure" data-challenges={showChallenges ? 'visible' : 'hidden'}>
        <figcaption id={`${titleId}-title`}>
          <div>
            <span className="section-kicker">Literature pipeline × empirical challenges</span>
            <h2>GSoC mentoring as a regenerative lifecycle</h2>
            <p>
              Select a broad phase, a specific stage, or cross-stage Governance to inspect the pipeline evidence & associated challenge(s).
            </p>
          </div>
        </figcaption>

      <svg
        className="lifecycle-disk"
        viewBox={showChallenges ? `0 0 1200 ${VIEW_HEIGHT}` : `280 0 640 ${VIEW_HEIGHT}`}
        role="group"
        aria-labelledby={`${titleId}-title`}
      >
        <g
          className="lifecycle-map-core"
          style={{ transform: `translate(${CENTER_X}px, ${CENTER_Y}px) scale(${showChallenges ? MAP_CHALLENGE_SCALE : 1.12})` }}
        >
          {pipelinePhases.map((phase) => {
            const startIndex = pipelineStages.findIndex((stage) => stage.id === phase.stageIds[0]);
            const phaseDatum = {
              startAngle: startIndex * stageAngle,
              endAngle: (startIndex + phase.stageIds.length) * stageAngle,
            };
            const labelPathId = `${titleId}-phase-label-${phase.id}`;

            return (
              <g
                key={phase.id}
                className={`lifecycle-phase lifecycle-phase-${phase.id}`}
                role="button"
                tabIndex={0}
                aria-label={`${phase.name}, ${phase.stageIds.length} sub-stages`}
                onClick={() => onPhaseSelect(phase.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onPhaseSelect(phase.id);
                  }
                }}
              >
                <path d={phaseArc(phaseDatum)} fill={phase.color}>
                  <title>{phase.name}</title>
                </path>
                <path
                  id={labelPathId}
                  className="lifecycle-phase-label-path"
                  d={phaseLabelPath(phaseDatum)}
                  fill="none"
                  stroke="none"
                  aria-hidden="true"
                />
                <text textAnchor="middle" dy="4" aria-hidden="true">
                  <textPath href={`#${labelPathId}`} startOffset="50%">
                    {phase.name}
                  </textPath>
                </text>
              </g>
            );
          })}

          {pipelineStages.map((stage, index) => {
            const datum = {
              startAngle: index * stageAngle,
              endAngle: (index + 1) * stageAngle,
            };
            const [x, y] = stageArc.centroid(datum);
            const midAngle = (index + 0.5) * stageAngle;
            const rotation = midAngle * 180 / Math.PI;
            const uprightRotation = rotation > 90 && rotation < 270 ? rotation + 180 : rotation;
            const challengeCount = getStageChallenges(stage.id).length;

            return (
              <g
                key={stage.id}
                className={`lifecycle-stage lifecycle-stage-${stage.phaseId}`}
                role="button"
                tabIndex={0}
                aria-label={`${stage.id}, ${stage.name}, ${challengeCount} stage-specific challenges`}
                onClick={() => onStageSelect(stage.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onStageSelect(stage.id);
                  }
                }}
              >
                <path d={stageArc(datum)}>
                  <title>{`${stage.id} · ${stage.name}`}</title>
                </path>
                <text
                  transform={`translate(${x},${y}) rotate(${uprightRotation})`}
                  y={stage.diskLines.length > 1 ? -15 : -9}
                  textAnchor="middle"
                  aria-hidden="true"
                >
                  <tspan className="lifecycle-stage-id" x="0">{stage.id}</tspan>
                  {stage.diskLines.map((line, lineIndex) => (
                    <tspan key={line} x="0" dy={lineIndex === 0 ? 20 : 17}>{line}</tspan>
                  ))}
                </text>
              </g>
            );
          })}

          <g className="lifecycle-center" aria-hidden="true">
            <circle r="73" />
            <text textAnchor="middle" y="-31">
              <tspan className="lifecycle-center-mark" x="0">GSoC</tspan>
              <tspan x="0" dy="18">mentoring</tspan>
              <tspan x="0" dy="16">pipeline</tspan>
            </text>
          </g>
          <g
            className="lifecycle-governance-stage"
            transform="translate(-54, 15)"
            role="button"
            tabIndex={0}
            aria-label={`Governance stage, ${crossCuttingChallenges.length} challenges`}
            onClick={() => onGovernanceSelect()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onGovernanceSelect();
              }
            }}
          >
            <rect width="108" height="29" rx="8" />
            <text x="54" y="19" textAnchor="middle" aria-hidden="true">Governance</text>
            <title>Governance · inspect X-coded pipeline challenges</title>
          </g>
        </g>

        {showChallenges && (
          <g className="challenge-leaf-layer" aria-label="Challenge labels connected to their pipeline stages">
            {leafGroups.map((group) => (
              <g key={group.stage.id} className="challenge-leaf-cluster">
                <path
                  className="challenge-branch-main"
                  d={`M ${group.anchorX} ${group.anchorY} Q ${(group.anchorX + group.branchX) / 2} ${group.anchorY} ${group.branchX} ${group.midY}`}
                />
                {group.leaves.map((challenge) => {
                  const centerY = challenge.y + challenge.height / 2;
                  const textColor = respondentTextColor(challenge.participantCount);
                  return (
                    <g
                      key={challenge.id}
                      className="challenge-leaf"
                      transform={`translate(${group.leafX},${challenge.y})`}
                      style={{ '--challenge-ink': textColor }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${challenge.id.replace('CH-', '')}, ${challenge.name}, ${challenge.participantCount} of 15 interviewees`}
                      onClick={() => (
                        group.isGovernance
                          ? onGovernanceSelect(challenge.id)
                          : onStageSelect(group.stage.id, challenge.id)
                      )}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          if (group.isGovernance) onGovernanceSelect(challenge.id);
                          else onStageSelect(group.stage.id, challenge.id);
                        }
                      }}
                    >
                      <title>{`${challenge.name} · n = ${challenge.participantCount}`}</title>
                      <line
                        className="challenge-branch-twig"
                        x1={group.branchX - group.leafX}
                        y1={group.midY - challenge.y}
                        x2={group.branchX - group.leafX}
                        y2={centerY - challenge.y}
                      />
                      <rect
                        width={group.leafWidth}
                        height={challenge.height}
                        rx="15"
                        style={{ fill: respondentColor(challenge.participantCount) }}
                      />
                      <text className="challenge-leaf-code" x="10" y="20" aria-hidden="true">
                        {challenge.id.replace('CH-', '')}
                      </text>
                      <text className="challenge-leaf-name" x="50" y="20" aria-hidden="true">
                        {challenge.lines.map((line, lineIndex) => (
                          <tspan key={`${challenge.id}-${line}`} x="50" dy={lineIndex === 0 ? 0 : 15}>{line}</tspan>
                        ))}
                      </text>
                      <text className="challenge-leaf-count" x={group.leafWidth - 13} y="20" textAnchor="end" aria-hidden="true">
                        n = {challenge.participantCount}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        )}

        {showChallenges && (
          <g
            className="respondent-scale-svg"
            transform="translate(456, 592)"
            role="img"
            aria-label="# of Interviewees Coded pre Challenge"
          >
            <text className="respondent-scale-svg-title" x="138" y="-10" textAnchor="middle">
              <tspan x="138" dy="0"># of Interviewees Coded pre Challenge</tspan>
              <tspan x="138" dy="1.2em">(Total n = 15)</tspan>
            </text>
            {respondentBands.map((band, index) => (
              <g key={band.label} transform={`translate(${index * 56}, 15)`}>
                <rect width="50" height="20" rx="4" fill={band.color} />
                <text x="26" y="35" textAnchor="middle">{band.label}</text>
              </g>
            ))}
          </g>
        )}
        </svg>
      </figure>
    </>
  );
}
