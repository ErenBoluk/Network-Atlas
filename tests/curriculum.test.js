import test from 'node:test'
import assert from 'node:assert/strict'
import { topics, stages, resources } from '../src/data/roadmap.js'

test('every displayed topic has a unique identity, valid stage and usable learning material', () => {
  const ids = new Set()
  for (const topic of topics) {
    assert.ok(!ids.has(topic.id), `Duplicate topic: ${topic.id}`)
    ids.add(topic.id)
    assert.ok(stages.some(stage => stage.id === topic.category), `Unknown category for ${topic.id}`)
    assert.ok(topic.objectives.length && topic.lab && topic.description, `Missing learning content for ${topic.id}`)
    assert.ok(topic.resources.length, `No resource for ${topic.id}`)
    for (const resource of topic.resources) {
      assert.ok(resource?.title && resource?.provider, `Broken resource reference in ${topic.id}`)
      assert.equal(new URL(resource.url).protocol, 'https:')
    }
  }
  for (const stage of stages) assert.ok(topics.some(topic => topic.category === stage.id), `Empty stage: ${stage.id}`)
  assert.equal(new Set(Object.values(resources).map(resource => resource.url)).size, Object.keys(resources).length)
})
