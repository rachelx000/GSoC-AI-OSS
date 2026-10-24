import { groups, stages, byId } from "../data/research";

const CENTER = [520, 320];
const point = (rx, ry, degrees) => {
  const angle = (degrees * Math.PI) / 180;
  return [CENTER[0] + rx * Math.cos(angle), CENTER[1] + ry * Math.sin(angle)];
};

function band(start, end) {
  const a = point(510, 294, start + 1);
  const b = point(510, 294, end - 1);
  const c = point(225, 117, end - 1);
  const d = point(225, 117, start + 1);
  return `M${a} A510 294 0 0 1 ${b} L${c} A225 117 0 0 0 ${d} Z`;
}

const PHASE_BANDS = [
  { id: "entry", start: -112.5, end: 67.5 },
  { id: "mentoring", start: 67.5, end: 202.5 },
  { id: "retention", start: 202.5, end: 247.5 },
];

const STAGE_LABELS = [
  ["Pre-engagement"],
  ["Proposal", "preparation"],
  ["Applicant review", "& selection"],
  ["Bonding & initial", "onboarding"],
  ["Contributing", "& mentoring"],
  ["Contribution", "review"],
  ["Evaluation", "& completion"],
  ["Retention &", "role transition"],
];

export function activateWithKeyboard(event, action) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}

export default function PipelineCycle({ onStageSelect, onGroupSelect }) {
  return (
    <figure className="cycle-figure">
      <svg
        className="pipeline-cycle"
        viewBox="0 0 1040 640"
        role="group"
        aria-label="GSoC mentoring pipeline. Select a stage or phase to explore its effects."
      >
        <defs>
          <marker
            id="cycle-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0 0L7 3.5L0 7Z" fill="context-stroke" />
          </marker>
        </defs>
        {PHASE_BANDS.map((phase) => {
          const group = byId(groups, phase.id);
          return (
            <path
              className="cycle-band"
              d={band(phase.start, phase.end)}
              fill={group.tint}
              stroke={group.color}
              strokeOpacity=".25"
              key={phase.id}
              role="button"
              tabIndex={0}
              aria-label={`Focus ${group.range}: ${group.name}`}
              onClick={() => onGroupSelect(group.id)}
              onKeyDown={(event) =>
                activateWithKeyboard(event, () => onGroupSelect(group.id))
              }
            />
          );
        })}
        {stages
          .filter((stage) => stage.id !== "X")
          .map((stage, index) => {
            const group = byId(groups, stage.groupId);
            const angle = -90 + index * 45;
            const [x, y] = point(382, 209, angle);
            const from = point(382, 209, angle + 17);
            const to = point(382, 209, angle + 28);
            return (
              <g key={stage.id}>
                <path
                  className="cycle-direction"
                  d={`M${from} A382 209 0 0 1 ${to}`}
                  stroke={group.color}
                  strokeDasharray={index === 7 ? "6 5" : undefined}
                  markerEnd="url(#cycle-arrow)"
                />
                <g
                  className="cycle-stage"
                  role="button"
                  tabIndex={0}
                  aria-label={`${stage.id}: ${stage.name}. Focus ${group.range}.`}
                  onClick={() => onStageSelect(stage.id)}
                  onKeyDown={(event) =>
                    activateWithKeyboard(event, () => onStageSelect(stage.id))
                  }
                  style={{ "--group-color": group.color }}
                >
                  <rect
                    x={x - 118}
                    y={y - 38}
                    width="236"
                    height="76"
                    rx="12"
                    fill="white"
                    stroke={group.color}
                    strokeOpacity=".6"
                  />
                  <rect
                    x={x - 106}
                    y={y - 20}
                    width="36"
                    height="40"
                    rx="7"
                    fill={group.color}
                  />
                  <text
                    x={x - 88}
                    y={y + 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize="20"
                    fontWeight="700"
                  >
                    {stage.id}
                  </text>
                  <text
                    x={x - 60}
                    y={y + (STAGE_LABELS[index].length === 1 ? 7 : -3)}
                    fill="#233449"
                    fontSize="20"
                    fontWeight="650"
                  >
                    {STAGE_LABELS[index].map((line, lineIndex) => (
                      <tspan x={x - 60} dy={lineIndex ? 24 : 0} key={line}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}
        <g className="cycle-center" textAnchor="middle">
          <text x="520" y="285" className="cycle-kicker">
            A regenerative cycle for OSS
          </text>
          <text x="520" y="320" className="cycle-title">
            GSoC mentoring
          </text>
          <text x="520" y="352" className="cycle-title">
            pipeline
          </text>
          <g
            className="cycle-governance"
            role="button"
            tabIndex={0}
            aria-label="X: Governance across S0 to S7"
            onClick={() => onStageSelect("X")}
            onKeyDown={(event) =>
              activateWithKeyboard(event, () => onStageSelect("X"))
            }
          >
            <rect
              x="388"
              y="376"
              width="264"
              height="37"
              rx="18"
              fill="#FEF5EF"
              stroke="#EFA484"
            />
            <text x="520" y="400" fill="#895447" fontSize="18" fontWeight="650">
              X · Cross-stage governance
            </text>
          </g>
        </g>
        <text x="444" y="50" className="cycle-note" fill="#94566B">
          Next cycle ↗
        </text>
        <text x="250" y="552" className="cycle-note" fill="#685C91">
          Submit ⇄ Revise
        </text>
      </svg>
      <figcaption>
        Literature-informed stages from the manuscript pipeline. Retention can
        renew future mentoring capacity; contribution and review iterate within
        a cycle.
      </figcaption>
    </figure>
  );
}
