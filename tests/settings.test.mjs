import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultSettings, validateSettings } from '../lib/settings-validation.ts';
import { pageNumber } from '../lib/pagination.ts';
function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries(defaultSettings)) data.set(key, value);
  return data;
}
test('settings whitelist and trim public configuration', () => {
  const data = form(); data.set('site_name', '  My site  '); data.set('ADMIN_PASSWORD', 'not a setting');
  const result = validateSettings(data);
  assert.equal(result.site_name, 'My site'); assert.ok(!('ADMIN_PASSWORD' in result));
});
test('settings reject unsafe social links, oversized values, and invalid emails', () => {
  for (const value of ['javascript:alert(1)', 'http://example.com', 'https://user:password@example.com', 'not a url']) {
    const data = form(); data.set('social_twitter', value); assert.throws(() => validateSettings(data));
  }
  const email = form(); email.set('contact_email', 'invalid'); assert.throws(() => validateSettings(email));
  const large = form(); large.set('site_name', 'x'.repeat(101)); assert.throws(() => validateSettings(large));
  const empty = form(); empty.set('site_name', ' '); assert.throws(() => validateSettings(empty));
  const missing = form(); missing.delete('site_name'); assert.throws(() => validateSettings(missing));
});
test('optional policy and social fields may be empty', () => {
  const data = form(); data.set('social_linkedin','https://www.linkedin.com/company/example');
  assert.equal(validateSettings(data).terms_content, '');
});
test('pagination rejects malformed values and bounds database offsets', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', 'NaN', ['2'], '999999999999999999999']) assert.equal(pageNumber(value),1);
  assert.equal(pageNumber('2'),2); assert.equal(pageNumber('10001'),10000);
});
