import manuscript from './manuscript.json';

export const {
  groups,
  stages,
  effects,
  impacts,
  pathways,
  strategyGroups,
  strategies,
  stances,
  capacity,
  references,
} = manuscript;
export const byId = (items, id) => items.find((item) => item.id === id);

/** Resolve only the part of each figure pathway belonging to the chosen stage group. */
export function getGroupScope(groupId) {
  const group = byId(groups, groupId);
  if (!group) return null;
  const scopedEffects = effects.filter((effect) => effect.groupId === groupId);
  const effectIds = new Set(scopedEffects.map((effect) => effect.id));
  const scopedPathways = pathways
    .map((pathway) => ({
      ...pathway,
      effectIds: pathway.effectIds.filter((id) => effectIds.has(id)),
    }))
    .filter((pathway) => pathway.effectIds.length);
  const impactIds = new Set(
    scopedPathways.flatMap((pathway) => pathway.impactIds),
  );
  return {
    group,
    stages: stages.filter((stage) => stage.groupId === groupId),
    effects: scopedEffects,
    pathways: scopedPathways,
    impacts: impacts.filter((impact) => impactIds.has(impact.id)),
  };
}

export function groupsForImpact(impactId) {
  return groups.filter((group) =>
    getGroupScope(group.id).impacts.some((impact) => impact.id === impactId),
  );
}
