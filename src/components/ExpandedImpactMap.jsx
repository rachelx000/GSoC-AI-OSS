import figure from '../assets/rq1.svg';
import { groups, stages, effects, impacts, byId } from '../data/research';
import { activateWithKeyboard } from './PipelineCycle';

const STAGE_Y = {
  S0: 63,
  S1: 118,
  S2: 172,
  S3: 227,
  S4: 377,
  S5: 561,
  S6: 682,
  S7: 769,
  X: 933,
};
const EFFECT_Y = {
  CH1: 52,
  CH2: 83,
  CH3: 119,
  CH4: 161,
  CH5: 191,
  OP1: 228,
  OP2: 314,
  CH6: 356,
  CH7: 386,
  CH8: 415,
  CH9: 444,
  CH10: 485,
  CH11: 515,
  CH12: 545,
  CH13: 574,
  CH14: 604,
  OP3: 641,
  CH15: 683,
  CH16: 771,
  CH17: 894,
  CH18: 923,
  CH19: 952,
  CH20: 981,
};
const IMPACT_BOXES = {
  IM1: [51, 103],
  IM2: [163, 131],
  IM3: [303, 103],
  IM4: [429, 115],
  IM5: [553, 115],
  IM6: [691, 89],
  IM7: [789, 103],
  IM8: [901, 115],
};
const GROUP_BOXES = {
  entry: [40, 240],
  mentoring: [298, 439],
  retention: [758, 60],
  governance: [879, 147],
};

function Target({ x, y, width, height, label, onSelect }) {
  return (
    <rect
      className="map-target"
      x={x}
      y={y}
      width={width}
      height={height}
      rx="8"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onSelect}
      onKeyDown={(event) => activateWithKeyboard(event, onSelect)}
    >
      <title>{label}</title>
    </rect>
  );
}

export default function ExpandedImpactMap({
  onStageSelect,
  onEffectSelect,
  onImpactSelect,
  onGroupSelect,
}) {
  return (
    <figure className="expanded-figure">
      <div
        className="expanded-map-scroll"
        tabIndex={0}
        role="region"
        aria-label="Expanded manuscript figure. Scroll horizontally on small screens."
      >
        <svg
          viewBox="0 0 1887 1028"
          className="expanded-impact-map"
          role="group"
          aria-label="Manuscript RQ1 map: stages, GenAI challenges and opportunities, and implications for GSoC sustainability."
        >
          <image href={figure} width="1887" height="1028" aria-hidden="true" />
          {groups.map((group) => (
            <Target
              key={group.id}
              x={0}
              y={GROUP_BOXES[group.id][0]}
              width={80}
              height={GROUP_BOXES[group.id][1]}
              label={`Focus ${group.range}: ${group.name}`}
              onSelect={() => onGroupSelect(group.id)}
            />
          ))}
          {stages.map((stage) => (
            <Target
              key={stage.id}
              x={90}
              y={STAGE_Y[stage.id]}
              width={340}
              height={39}
              label={`${stage.id}: ${stage.name}. Focus ${byId(groups, stage.groupId).range}.`}
              onSelect={() => onStageSelect(stage.id)}
            />
          ))}
          {effects.map((effect) => (
            <Target
              key={effect.id}
              x={476}
              y={EFFECT_Y[effect.id]}
              width={478}
              height={
                effect.id.startsWith('OP') ||
                ['CH3', 'CH15', 'CH16'].includes(effect.id)
                  ? 36
                  : 29
              }
              label={`${effect.id}: ${effect.name}. Inspect interview excerpts.`}
              onSelect={() => onEffectSelect(effect.id)}
            />
          ))}
          {impacts.map((impact) => (
            <Target
              key={impact.id}
              x={1194}
              y={IMPACT_BOXES[impact.id][0]}
              width={679}
              height={IMPACT_BOXES[impact.id][1]}
              label={`${impact.id}: ${impact.figureName}. Choose a linked stage group.`}
              onSelect={() => onImpactSelect(impact.id)}
            />
          ))}
        </svg>
      </div>
      <figcaption>
        The manuscript’s RQ1 figure. Select S, CH, OP, or IM to inspect a single
        stage group and its linked evidence. Colored pathways join groups of
        effects; they do not represent measured effect sizes.
      </figcaption>
    </figure>
  );
}
