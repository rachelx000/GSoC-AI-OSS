import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = new URL('../', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root));
const data = JSON.parse(read('src/data/manuscript.json'));
const server = await createServer({
  server: { middlewareMode: true, ws: false, watch: null },
});
const { getGroupScope, groupsForImpact } = await server.ssrLoadModule('/src/data/research.js');
const { default: ExpandedImpactMap } = await server.ssrLoadModule('/src/components/ExpandedImpactMap.jsx');
await server.close();
const ids = (items) => items.map((item) => item.id);
const challenges = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => `CH${start + i}`);

test('rendered stage-to-effect branches follow RQ1 figure associations, including the shared S3 source', () => {
  const markup = renderToStaticMarkup(createElement(ExpandedImpactMap));
  const pairs = [...markup.matchAll(/data-from="([^"]+)" data-to="([^"]+)"/g)]
    .map(([, stage, effect]) => `${stage}:${effect}`).sort();
  const expected = {
    S0: ['CH1', 'CH2'],
    S1: ['CH3'],
    S2: ['CH4', 'CH5'],
    S3: ['OP1', 'OP1'],
    S4: ['OP2', 'CH6', 'CH7', 'CH8', 'CH9'],
    S5: ['CH10', 'CH11', 'CH12', 'CH13', 'CH14', 'OP3'],
    S6: ['CH15'],
    S7: ['CH16'],
    X: ['CH17', 'CH18', 'CH19', 'CH20'],
  };
  assert.deepEqual(pairs, Object.entries(expected)
    .flatMap(([stage, effectIds]) => effectIds.map((effect) => `${stage}:${effect}`)).sort());
  assert.doesNotMatch(markup, /data-from="S4" data-to="OP1"/);
  assert.match(markup, /Shared from S0–S3/);
});

test('main linkages preserve the four collective code groups and three broad impact groups', () => {
  const main = data.pathways.filter((path) => path.linkType === 'main');
  assert.deepEqual(main.map((path) => ({
    group: path.groupId,
    source: path.sourceType,
    effects: path.effectIds,
    impacts: path.impactIds,
  })), [
    { group: 'entry', source: 'group', effects: [...challenges(1, 5), 'OP1'], impacts: ['IM1', 'IM2', 'IM3'] },
    { group: 'mentoring', source: 'group', effects: [...challenges(6, 15), 'OP1', 'OP2', 'OP3'], impacts: ['IM4', 'IM5'] },
    { group: 'retention', source: 'group', effects: ['CH16'], impacts: ['IM6', 'IM7', 'IM8'] },
    { group: 'governance', source: 'group', effects: challenges(17, 20), impacts: ['IM5', 'IM6', 'IM8'] },
  ]);
  assert.deepEqual(ids(getGroupScope('entry').primaryImpacts), ['IM1', 'IM2', 'IM3']);
  assert.deepEqual(ids(getGroupScope('mentoring').primaryImpacts), ['IM4', 'IM5']);
  assert.deepEqual(ids(getGroupScope('retention').primaryImpacts), ['IM6', 'IM7', 'IM8']);
});

test('additional connections preserve both group links and cross-stage opportunity joins', () => {
  const additional = data.pathways.filter((path) => path.linkType === 'additional');
  assert.deepEqual(additional.map((path) => ({
    source: path.sourceType === 'group' ? path.groupId : path.effectIds,
    linkedGroup: path.linkedGroupId ?? null,
    impacts: path.impactIds,
  })), [
    { source: 'entry', linkedGroup: null, impacts: ['IM6'] },
    { source: 'mentoring', linkedGroup: null, impacts: ['IM2', 'IM3'] },
    { source: ['OP1'], linkedGroup: 'mentoring', impacts: ['IM2', 'IM3', 'IM4', 'IM5'] },
    { source: ['OP2'], linkedGroup: 'retention', impacts: ['IM6', 'IM7', 'IM8'] },
  ]);
  const mentoring = getGroupScope('mentoring');
  const retention = getGroupScope('retention');
  assert.deepEqual(ids(mentoring.crossStageEffects), ['OP1']);
  assert.deepEqual(ids(retention.crossStageEffects), ['OP2']);
  assert.deepEqual(ids(getGroupScope('entry').crossStageEffects), []);
  assert.equal(mentoring.effects.find((effect) => effect.id === 'OP1').stageId, 'S3');
  assert.equal(retention.effects.find((effect) => effect.id === 'OP2').stageId, 'S4');
  assert.equal(mentoring.effects.find((effect) => effect.id === 'OP1').groupId, 'entry');
  assert.equal(retention.effects.find((effect) => effect.id === 'OP2').groupId, 'mentoring');
  assert.ok(mentoring.localEffects.some((effect) => effect.id === 'OP3'));
  assert.equal(getGroupScope('unknown'), null);
});

test('OP3 remains at S5 and shares the mentoring group links without a standalone bridge', () => {
  const scope = getGroupScope('mentoring');
  const effect = scope.localEffects.find((item) => item.id === 'OP3');
  assert.equal(effect.stageId, 'S5');
  assert.equal(effect.groupId, 'mentoring');
  assert.deepEqual(scope.pathways
    .filter((path) => path.sourceType === 'group' && path.effectIds.includes('OP3'))
    .map((path) => ({ type: path.linkType, impacts: path.impactIds })), [
    { type: 'main', impacts: ['IM4', 'IM5'] },
    { type: 'additional', impacts: ['IM2', 'IM3'] },
  ]);
  assert.ok(!data.pathways.some((path) => path.sourceType === 'effect' && path.effectIds.includes('OP3')));
  assert.ok(!scope.crossStageEffects.some((item) => item.id === 'OP3'));
});

test('each impact offers every group carrying a main or additional connection', () => {
  const expected = {
    IM1: ['entry'],
    IM2: ['entry', 'mentoring'],
    IM3: ['entry', 'mentoring'],
    IM4: ['entry', 'mentoring'],
    IM5: ['entry', 'mentoring', 'governance'],
    IM6: ['entry', 'mentoring', 'retention', 'governance'],
    IM7: ['mentoring', 'retention'],
    IM8: ['mentoring', 'retention', 'governance'],
  };
  for (const [impactId, groupIds] of Object.entries(expected)) {
    assert.deepEqual(ids(groupsForImpact(impactId)), groupIds);
  }
  assert.deepEqual(groupsForImpact('unknown'), []);
});

test('mapping provenance distinguishes researcher clarification from the unchanged source figure', () => {
  assert.deepEqual(read('src/assets/rq1.svg'), read('references/figures/rq1-latest.svg'));
  assert.equal(data.sources.relationships, 'references/figures/rq1-latest.svg');
  assert.match(data.sources.relationshipMapping, /^Researcher clarification:/);
  for (const path of data.pathways) {
    assert.ok(['main', 'additional'].includes(path.linkType));
    assert.ok(path.effectIds.every((id) => data.effects.some((effect) => effect.id === id)));
    assert.ok(path.impactIds.every((id) => data.impacts.some((impact) => impact.id === id)));
    if (path.sourceType === 'group') {
      assert.ok(data.groups.some((group) => group.id === path.groupId));
    } else {
      assert.equal(path.effectIds.length, 1);
      assert.ok(data.groups.some((group) => group.id === path.linkedGroupId));
    }
  }
});

test('snapshot-only check succeeds and regeneration refuses to change data without LaTeX', {
  skip: fs.existsSync(new URL('references/manuscript/tables/framework_table.tex', root)),
}, () => {
  const before = read('src/data/manuscript.json');
  const run = (...args) => spawnSync('python3', ['scripts/sync-manuscript-data.py', ...args], {
    cwd: fileURLToPath(root), encoding: 'utf8',
  });
  const checked = run('--check');
  assert.equal(checked.status, 0, checked.stderr);
  assert.match(checked.stdout, /Snapshot links match the researcher clarification/);
  const synced = run();
  assert.equal(synced.status, 1);
  assert.match(synced.stderr, /snapshot was not modified/);
  assert.deepEqual(read('src/data/manuscript.json'), before);
});
