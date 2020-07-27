'use strict'
const { suite, test } = require('mocha')
const path = require('path')
const assert = require('assert')
const fs = require('fs-extra')
const loggerr = require('loggerr')
const pkg = require('../package.json')
const fix = require('..')

suite(pkg.name, () => {
  test('setup and teardown a fixture', async () => {
    assert(fix)
    const f = fix()
    assert(f)
    assert(f.FIX)
    assert(f.TMP)
    assert.strictEqual(typeof f.setup, 'function')
    assert.strictEqual(typeof f.teardown, 'function')

    // Setup an empty directory
    await f.setup()
    assert.strictEqual(await fs.pathExists(f.TMP), true)
    assert.rejects(fs.readFile(path.join(f.TMP, 'package.json')))

    // Setup an fixture with file
    await f.setup('testfixture')
    assert.strictEqual(await fs.pathExists(f.TMP), true)
    assert.doesNotReject(fs.readJSON(path.join(f.TMP, 'package.json')))

    // Teardown
    await f.teardown()
    assert.strictEqual(await fs.pathExists(f.TMP), false)
    assert.rejects(fs.readJSON(path.join(f.TMP, 'package.json')))
  })

  test('configure fixture and tmp dirs', async () => {
    const f = fix({
      fixtures: path.join(__dirname, 'fake'),
      tmp: path.join(__dirname, '_tmp'),
      log: loggerr({ formatter: 'cli', level: 'info' }).info
    })
    assert.strictEqual(f.FIX, path.join(__dirname, 'fake'))
    assert.strictEqual(f.TMP, path.join(__dirname, '_tmp'))

    // Setup an fixture with file
    await assert.rejects(f.setup('testfixture'))

    // Teardown
    await f.teardown()
    assert.strictEqual(await fs.pathExists(f.TMP), false)
  })
})
