// Regression tests for auto-linking: run with `node --test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inline } from './inline.mjs';

const MAIL = '<a href="mailto:tolgayeniyurt@gmail.com">tolgayeniyurt@gmail.com</a>';

test('e-mail at the end of a sentence: the full stop stays outside the link', () => {
  assert.equal(inline('Write to tolgayeniyurt@gmail.com.'), `Write to ${MAIL}.`);
});
test('e-mail followed by a comma: the comma stays outside the link', () => {
  assert.equal(inline('Write to tolgayeniyurt@gmail.com, please.'), `Write to ${MAIL}, please.`);
});
test('e-mail without punctuation', () => {
  assert.equal(inline('Contact: tolgayeniyurt@gmail.com'), `Contact: ${MAIL}`);
});
test('e-mail with dots in the name and a multi-part domain', () => {
  assert.equal(inline('first.last+tag@mail.example.co.uk.'), '<a href="mailto:first.last+tag@mail.example.co.uk">first.last+tag@mail.example.co.uk</a>.');
});
test('URL at the end of a sentence: the full stop stays outside the link', () => {
  assert.equal(inline('See https://example.com/a.html.'), 'See <a href="https://example.com/a.html">https://example.com/a.html</a>.');
});
test('URL followed by a comma: the comma stays outside the link', () => {
  assert.equal(inline('See https://example.com/a, then go on.'), 'See <a href="https://example.com/a">https://example.com/a</a>, then go on.');
});
test('URL without punctuation, and in parentheses', () => {
  assert.equal(inline('https://example.com/a?b=1'), '<a href="https://example.com/a?b=1">https://example.com/a?b=1</a>');
  assert.equal(inline('(https://example.com/a)'), '(<a href="https://example.com/a">https://example.com/a</a>)');
});
test('built pages: every mailto target is exactly the support address', () => {
  const targets = ['fashionista', 'heroes', 'monsters'].flatMap(d => ['support', 'privacy'].flatMap(p =>
    [...fs.readFileSync(new URL(`./${d}/${p}.html`, import.meta.url), 'utf8').matchAll(/href="(mailto:[^"]*)"/g)].map(m => m[1])));
  assert.equal(targets.length, 9);
  for (const t of targets) assert.equal(t, 'mailto:tolgayeniyurt@gmail.com');
});
