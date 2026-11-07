import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeLegacyEdition} from '../tools/html-analysis.mjs';

function article(attributes = '') {
  return `<html><head><title>Test edition</title><meta name="description" content="Fixture"></head><body>
<header><time>2026-11-08</time></header><main><p>Fixture</p>
<article id="date-fixture" ${attributes}><div class="brief-body">
<h2 id="date-fixture-title">Explicit dates</h2><p>Fixture summary.</p>
<div class="byline"><time datetime="2026-11-06">Source display date</time><a href="https://example.org/source">Source</a></div>
</div></article></main></body></html>`;
}
const read = attributes => analyzeLegacyEdition(article(attributes), '2026-11-08').items[0];

test('Legacy HTML keeps unknown event and source dates unknown', () => {
  const item = read();
  assert.equal(item.sourceDate, '2026-11-06');
  assert.equal(item.eventDate, null);
  assert.equal(item.sourcePublishedAt, null);
});

test('Explicit event and source dates survive HTML analysis without conflation', () => {
  const item = read('data-event-date="2026-11-04" data-source-published-at="2026-11-05T23:30:00-05:00"');
  assert.equal(item.eventDate, '2026-11-04');
  assert.equal(item.sourcePublishedAt, '2026-11-05T23:30:00-05:00');
  assert.equal(item.sourceDate, '2026-11-06');
});

test('A known event date does not invent a source publication date', () => {
  const item = read('data-event-date="2026-11-04"');
  assert.equal(item.eventDate, '2026-11-04');
  assert.equal(item.sourcePublishedAt, null);
});

test('A date-only source publication date does not invent time or event date', () => {
  const item = read('data-source-published-at="2026-11-05"');
  assert.equal(item.eventDate, null);
  assert.equal(item.sourcePublishedAt, '2026-11-05');
});

test('Empty explicit metadata is not silently treated as missing metadata', () => {
  const item = read('data-event-date="" data-source-published-at=""');
  assert.equal(item.eventDate, '');
  assert.equal(item.sourcePublishedAt, '');
});
