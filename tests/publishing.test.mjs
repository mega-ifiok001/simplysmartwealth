import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePublicationDate, publicationTime, validatePost } from '../lib/validation.ts';
test('UTC publication dates reject invalid calendar values and ambiguous time zones', () => {
  for (const raw of ['2027-02-29T12:00', '2028-02-30T12:00', '2027-13-01T00:00', '2027-01-01T24:00', '2027-01-01T12:00Z', '1999-01-01T00:00', 'tomorrow']) {
    assert.throws(() => parsePublicationDate(raw), raw);
  }
  assert.equal(parsePublicationDate('2028-02-29T12:30').toISOString(), '2028-02-29T12:30:00.000Z');
  assert.equal(parsePublicationDate(null), null); assert.equal(parsePublicationDate(''), null);
  assert.throws(() => parsePublicationDate(new File(['x'], 'date.txt')));
});
test('publication preserves existing dates, schedules explicitly, and clears drafts', () => {
  const now = new Date('2026-09-17T10:00Z');
  const old = new Date('2026-01-01T00:00Z');
  const future = new Date('2027-01-01T00:00Z');
  assert.equal(publicationTime('DRAFT', future, old, now), null);
  assert.equal(publicationTime('PUBLISHED', null, null, now), now);
  assert.equal(publicationTime('PUBLISHED', null, old, now), old);
  assert.equal(publicationTime('PUBLISHED', future, old, now), future);
});
test('post validation exposes featured and scheduling fields without requiring them', () => {
  const data = new FormData();
  for (const [key,value] of Object.entries({title:'Test article', slug:'test-article', excerpt:'A useful introduction.', content:'Complete article content for testing.', status:'PUBLISHED',coverAlt:''})) data.set(key,value);
  assert.equal(validatePost(data).featured,false);
  assert.equal(validatePost(data).publicationDate,null);
  data.set('featured','on'); data.set('publicationDate','2028-02-29T12:30');
  assert.equal(validatePost(data).featured,true);
  assert.equal(validatePost(data).publicationDate.toISOString(),'2028-02-29T12:30:00.000Z');
});
