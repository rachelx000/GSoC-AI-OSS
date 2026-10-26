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

/** Preserve stage ownership while including opportunities shared with another group. */
export function getGroupScope(groupId) {
  const group = byId(groups, groupId);
  if (!group) return null;
  const localEffects = effects.filter((effect) => effect.groupId === groupId);
  const localIds = new Set(localEffects.map((effect) => effect.id));
  const scopedPathways = pathways.filter((pathway) =>
    pathway.sourceType === 'group'
      ? pathway.groupId === groupId
      : pathway.linkedGroupId === groupId ||
        pathway.effectIds.some((id) => localIds.has(id)),
  );
  const crossStageIds = new Set(
    scopedPathways
      .filter((pathway) => pathway.sourceType === 'effect' && pathway.linkedGroupId === groupId)
      .flatMap((pathway) => pathway.effectIds)
      .filter((id) => !localIds.has(id)),
  );
  const primaryImpactIds = new Set(
    scopedPathways
      .filter((pathway) => pathway.sourceType === 'group' && pathway.linkType === 'main')
      .flatMap((pathway) => pathway.impactIds),
  );
  const impactIds = new Set(
    scopedPathways.flatMap((pathway) => pathway.impactIds),
  );
  return {
    group,
    stages: stages.filter((stage) => stage.groupId === groupId),
    localEffects,
    crossStageEffects: effects.filter((effect) => crossStageIds.has(effect.id)),
    effects: effects.filter((effect) => localIds.has(effect.id) || crossStageIds.has(effect.id)),
    pathways: scopedPathways,
    primaryImpacts: impacts.filter((impact) => primaryImpactIds.has(impact.id)),
    impacts: impacts.filter((impact) => impactIds.has(impact.id)),
  };
}

export function groupsForImpact(impactId) {
  return groups.filter((group) =>
    getGroupScope(group.id).impacts.some((impact) => impact.id === impactId),
  );
}
