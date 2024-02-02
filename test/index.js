'use strict';
const { suite, test } = require('mocha');
const path = require('path');
const assert = require('assert');
const fs = require('node:fs/promises');
const loggerr = require('loggerr');
const pkg = require('../package.json');
const fix = require('..');

suite(pkg.name, () => {
  test('setup and teardown a fixture', async () => {
    assert(fix);
    const f = fix();
    assert(f);
    assert(f.FIX);
    assert(f.TMP);
    assert.strictEqual(typeof f.setup, 'function');
    assert.strictEqual(typeof f.teardown, 'function');

    // Setup an empty directory
    await f.setup();
    assert.strictEqual(await fs.access(f.TMP), undefined);
    assert.rejects(fs.readFile(path.join(f.TMP, 'package.json')));

    // Setup an fixture with file
    await f.setup('testfixture');
    assert.strictEqual(await fs.access(f.TMP), undefined);
    assert.doesNotReject(async () => {
      JSON.parse(await fs.readFile(path.join(f.TMP, 'package.json')));
    });

    // Teardown
    await f.teardown();
    assert.rejects(fs.access(f.TMP));
    assert.rejects(async () => {
      JSON.parse(await fs.readFile(path.join(f.TMP, 'package.json')));
    });
  });

  test('configure fixture and tmp dirs', async () => {
    const f = fix({
      fixtures: path.join(__dirname, 'fake'),
      tmp: path.join(__dirname, '_tmp'),
      log: loggerr.info
    });
    assert.strictEqual(f.FIX, path.join(__dirname, 'fake'));
    assert.strictEqual(f.TMP, path.join(__dirname, '_tmp'));

    // Setup an fixture with file
    await assert.rejects(f.setup('testfixture'));

    // Teardown
    await f.teardown();
    assert.rejects(fs.access(f.TMP));
  });

  test('configure multiple tmp directories based on test name', async function () {
    const f = await fix({
      testName: this.test.title
    }, 'testfixture');
    assert.strictEqual(f.TMP, path.join(__dirname, 'tmp-configure-multiple-tmp-directories-based-on-test-name'));

    const f2 = fix();
    assert.strictEqual(f2.TMP, path.join(__dirname, 'tmp'));
    await f2.setup('testfixture');

    await f.teardown();
    await f2.teardown();
  });
});
