import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createServer } from 'vite';

const data = JSON.parse(
  fs.readFileSync(new URL('../src/data/manuscript.json', import.meta.url)),
);
const server = await createServer({
  server: { middlewareMode: true, ws: false, watch: null },
});
const { getGroupScope, groupsForImpact } = await server.ssrLoadModule(
  '/src/data/research.js',
);
await server.close();

test('all manuscript codes have evidence and stable identifiers', () => {
  assert.deepEqual(
    data.effects
      .filter((item) => item.kind === 'challenge')
      .map((item) => item.id),
    Array.from({ length: 20 }, (_, index) => `CH${index + 1}`),
  );
  assert.deepEqual(
    data.effects
      .filter((item) => item.kind === 'opportunity')
      .map((item) => item.id),
    ['OP1', 'OP2', 'OP3'],
  );
  assert.deepEqual(
    data.impacts.map((item) => item.id),
    Array.from({ length: 8 }, (_, index) => `IM${index + 1}`),
  );
  assert.deepEqual(
    data.strategies.map((item) => item.id),
    Array.from({ length: 14 }, (_, index) => `ST${index + 1}`),
  );
  for (const item of [...data.effects, ...data.impacts, ...data.strategies]) {
    assert.ok(item.excerpts.length, `${item.id} lacks evidence`);
    for (const excerpt of item.excerpts) {
      assert.match(excerpt.participant, /^P(?:[1-9]|1[0-5])$/);
      assert.ok(excerpt.text.trim());
      assert.doesNotMatch(excerpt.text, /\\(?:myquote|unused|hl|par|vspace)/);
    }
  }
});

test('scope follows the four stage groups in the supplied figure', () => {
  const expected = {
    entry: {
      stages: ['S0', 'S1', 'S2', 'S3'],
      impacts: ['IM1', 'IM2', 'IM3', 'IM4', 'IM6'],
    },
    mentoring: {
      stages: ['S4', 'S5', 'S6'],
      impacts: ['IM2', 'IM3', 'IM4', 'IM7'],
    },
    retention: { stages: ['S7'], impacts: ['IM7'] },
    governance: { stages: ['X'], impacts: ['IM5', 'IM6', 'IM8'] },
  };
  for (const [id, expectation] of Object.entries(expected)) {
    const scope = getGroupScope(id);
    assert.deepEqual(
      scope.stages.map((item) => item.id),
      expectation.stages,
    );
    assert.deepEqual(
      scope.impacts.map((item) => item.id),
      expectation.impacts,
    );
    assert.ok(scope.effects.every((effect) => effect.groupId === id));
    for (const pathway of scope.pathways) {
      assert.ok(
        pathway.effectIds.every((effectId) =>
          scope.effects.some((effect) => effect.id === effectId),
        ),
      );
    }
  }
  assert.equal(getGroupScope('unknown'), null);
});

test('shared sustainability functions offer only their linked groups', () => {
  assert.deepEqual(
    groupsForImpact('IM2').map((group) => group.id),
    ['entry', 'mentoring'],
  );
  assert.deepEqual(
    groupsForImpact('IM6').map((group) => group.id),
    ['entry', 'governance'],
  );
  assert.deepEqual(
    groupsForImpact('IM7').map((group) => group.id),
    ['mentoring', 'retention'],
  );
  assert.deepEqual(
    groupsForImpact('IM8').map((group) => group.id),
    ['governance'],
  );
});

test('figure paths cover each effect once without inventing individual links', () => {
  const linkedEffects = data.pathways
    .flatMap((pathway) => pathway.effectIds)
    .sort();
  assert.deepEqual(linkedEffects, data.effects.map((item) => item.id).sort());
  for (const pathway of data.pathways) {
    assert.ok(
      pathway.impactIds.every((id) =>
        data.impacts.some((impact) => impact.id === id),
      ),
    );
  }
  assert.deepEqual(
    data.stages.flatMap((stage) => stage.effectIds).sort(),
    linkedEffects,
  );
});

test('qualifications, practice status, and baseline sustainability evidence survive extraction', () => {
  assert.match(
    data.effects.find((item) => item.id === 'CH16').excerpts[0].text,
    /I am worried/,
  );
  assert.match(
    data.effects.find((item) => item.id === 'CH7').excerpts[0].text,
    /until my AI limit renews/,
  );
  assert.equal(
    data.strategies.find((item) => item.id === 'ST14').status,
    'Program-level proposal',
  );
  assert.equal(
    data.strategies.find((item) => item.id === 'ST2').status,
    'Reported and planned',
  );
  assert.match(
    data.impacts.find((item) => item.id === 'IM7').excerpts[0].text,
    /Almost 70%/,
  );
  assert.ok(data.impacts.every((item) => item.definition.startsWith('GSoC')));
});

test('AIM has complete stance, integration, and persistent capacity guidance', () => {
  assert.deepEqual(
    data.stances.map((item) => item.name),
    ['Prohibitionist', 'Skeptic', 'Accommodator', 'Pragmatist', 'Advocate'],
  );
  for (const stance of data.stances) {
    for (const row of ['boundary', 'entry', 'mentoring', 'governance']) {
      assert.ok(stance.actions[row].length, `${stance.name}: ${row}`);
      assert.ok(stance.actions[row].every((action) => !action.includes('\\')));
    }
  }
  assert.equal(data.capacity.length, 4);
  assert.ok(data.capacity.every((dimension) => dimension.actions.length === 3));
});

test('stage references resolve and participant-frequency fields are absent', () => {
  for (const stage of data.stages) {
    assert.ok(stage.referenceIds.length);
    for (const id of stage.referenceIds)
      assert.ok(data.references[id]?.title, id);
  }
  assert.doesNotMatch(
    JSON.stringify(data),
    /"(?:participantCount|respondentCount|interviewees|openCodeCount)"/,
  );
});
