import { groups, stages, byId } from "../data/research";

const CENTER = [520, 320];
const CARD_WIDTH = 236;
const CARD_HEIGHT = 76;
const ARROW_GAP = 6;
const ARROW_SIZE = 10;
const ARROW_OVERHANG = 3;
const ROUTE_RADII = [382, 209];
const REVIEW_OFFSET = 10;
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

const cycleStages = stages
  .filter((stage) => stage.id !== "X")
  .map((stage, index) => ({
    ...stage,
    angle: -90 + index * 45,
    center: point(...ROUTE_RADII, -90 + index * 45),
  }));

function cardExitAngle(stage, insideAngle, outsideAngle, radii, gap = ARROW_GAP) {
  // Find where the ellipse exits a card padded for the stroke and arrowhead.
  for (let step = 0; step < 32; step += 1) {
    const angle = (insideAngle + outsideAngle) / 2;
    const [x, y] = point(...radii, angle);
    const inside =
      Math.abs(x - stage.center[0]) <= CARD_WIDTH / 2 + gap &&
      Math.abs(y - stage.center[1]) <= CARD_HEIGHT / 2 + gap;
    if (inside) insideAngle = angle;
    else outsideAngle = angle;
  }
  return outsideAngle;
}

function connectCards(from, to, offset = 0, clockwise = true) {
  const radii = ROUTE_RADII.map((radius) => radius + offset);
  const endAngle = from.angle + (clockwise ? 45 : -45);
  const start = cardExitAngle(from, from.angle, endAngle, radii);
  // Stop the shaft inside the arrowhead, keeping its tip clear of the next card.
  const end = cardExitAngle(to, endAngle, from.angle, radii, ARROW_GAP + ARROW_OVERHANG);
  return `M${point(...radii, start)} A${radii} 0 0 ${clockwise ? 1 : 0} ${point(...radii, end)}`;
}

const connections = cycleStages.map((stage, index) => {
  const next = cycleStages[(index + 1) % cycleStages.length];
  const [sx, sy] = stage.center;
  const [tx, ty] = next.center;
  const connection = {
    from: stage.id,
    to: next.id,
    groupId: stage.groupId,
    color: byId(groups, stage.groupId).color,
    path: connectCards(stage, next, stage.id === "S4" ? REVIEW_OFFSET : 0),
  };

  if (stage.id === "S4") {
    connection.label = "Submit";
    connection.labelPosition = [tx + 110, ty + 86];
  }
  if (stage.id === "S7") {
    connection.label = "Next cycle";
    connection.labelPosition = [sx + 94, sy - 71];
  }
  return connection;
});

const [contributionX, contributionY] = byId(cycleStages, "S4").center;
connections.push({
  from: "S5",
  to: "S4",
  groupId: "mentoring",
  color: byId(groups, "mentoring").color,
  // Equal offsets keep the pair's midpoint on the main elliptical route.
  path: connectCards(byId(cycleStages, "S5"), byId(cycleStages, "S4"), -REVIEW_OFFSET, false),
  label: "Revise",
  labelPosition: [contributionX - 104, contributionY - 55],
});

export function activateWithKeyboard(event, action) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}

export default function PipelineCycle({ onStageSelect, onGroupSelect }) {
  return (
    <figure className="cycle-figure">
      <div
        className="cycle-scroll"
        role="region"
        aria-label="Mentoring cycle. Scroll horizontally on small screens."
        tabIndex={0}
      >
        <svg
          className="pipeline-cycle"
          viewBox="0 0 1040 640"
          role="group"
          aria-label="GSoC mentoring pipeline. Select a stage or phase to explore its effects."
        >
          <defs>
            {groups.map((group) => (
              <marker
                key={group.id}
                id={`cycle-arrow-${group.id}`}
                viewBox="0 0 10 10"
                markerWidth={ARROW_SIZE}
                markerHeight={ARROW_SIZE}
                markerUnits="userSpaceOnUse"
                refX={ARROW_SIZE - ARROW_OVERHANG}
                refY="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10Z" fill={group.color} />
              </marker>
            ))}
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
          {connections.map((connection) => (
            <g key={`${connection.from}-${connection.to}`}>
              <path
                className="cycle-direction"
                data-from={connection.from}
                data-to={connection.to}
                data-action={connection.label}
                d={connection.path}
                stroke={connection.color}
                strokeDasharray={connection.from === "S7" ? "6 5" : undefined}
                markerEnd={`url(#cycle-arrow-${connection.groupId})`}
                role="img"
                aria-label={`${connection.from} to ${connection.to}${connection.label ? `: ${connection.label}` : ""}`}
              />
              {connection.label && (
                <text
                  className="cycle-note"
                  data-link={`${connection.from}-${connection.to}`}
                  x={connection.labelPosition[0]}
                  y={connection.labelPosition[1]}
                  textAnchor="middle"
                  fill={connection.color}
                >
                  {connection.label}
                </text>
              )}
            </g>
          ))}
          {cycleStages.map((stage, index) => {
            const group = byId(groups, stage.groupId);
            const [x, y] = stage.center;
            return (
              <g
                key={stage.id}
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
                  x={x - CARD_WIDTH / 2}
                  y={y - CARD_HEIGHT / 2}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
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
            );
          })}
          <g className="cycle-center" textAnchor="middle">
            <text x="520" y="278" className="cycle-kicker">
              A regenerative cycle for OSS
            </text>
            <text x="520" y="312" className="cycle-title">
              GSoC mentoring
            </text>
            <text x="520" y="344" className="cycle-title">
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
                x="380"
                y="365"
                width="280"
                height="36"
                rx="18"
                fill="#FEF5EF"
                stroke="#EFA484"
              />
              <text x="520" y="389" fill="#895447" fontSize="20" fontWeight="650">
                X · Cross-stage governance
              </text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  );
}
