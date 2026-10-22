import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { topics, stages } from '../src/data/roadmap.js'
import { parseProgress } from '../src/lib/learning.js'

let server
let App
let TopicDialog
before(async () => {
  // Middleware mode compiles the real JSX without opening a listening port.
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })
  App = (await server.ssrLoadModule('/src/App.jsx')).default
  TopicDialog = (await server.ssrLoadModule('/src/components/TopicDialog.jsx')).default
})
after(async () => { await server?.close() })

test('first render works without browser storage and offers all curriculum topics', () => {
  const html = renderToStaticMarkup(createElement(App))
  assert.match(html, /<main id="main-content"/)
  assert.equal((html.match(/class="topic-row /g) ?? []).length, 50)
  assert.match(html, /%0/)
  assert.match(html, /Konu veya kaynak ara/)
})

test('topic detail renders real resource links, saved notes and completion state', () => {
  const topic = topics.find(topic => topic.id === 'dns')
  const progress = parseProgress(JSON.stringify({ statuses: { dns: 'done' }, bookmarks: ['dns'], notes: { dns: 'TTL test notum' } }), topics)
  const html = renderToStaticMarkup(createElement(TopicDialog, {
    topic, stage: stages.find(stage => stage.id === topic.category), progress,
    onClose() {}, onStatus() {}, onBookmark() {}, onNote() {},
  }))
  assert.match(html, /aria-labelledby="topic-title"/)
  assert.match(html, /https:\/\/www.cloudflare.com\/learning\/dns\/what-is-dns\//)
  assert.match(html, /TTL test notum/)
  assert.match(html, /status-done" aria-pressed="true"/)
})
