# fs-test-fixtures

[![NPM Version](https://img.shields.io/npm/v/fs-test-fixtures.svg)](https://npmjs.org/package/fs-test-fixtures)
[![NPM Downloads](https://img.shields.io/npm/dm/fs-test-fixtures.svg)](https://npmjs.org/package/fs-test-fixtures)
[![Build Status](https://travis-ci.org/wesleytodd/fs-test-fixtures.svg?branch=master)](https://travis-ci.org/wesleytodd/fs-test-fixtures)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)

Helper for writing filesystem fixtures

```
$ npm i fs-test-fixtures
```

Example usage in `mocha` tests:

```javascript
'use strict'
const { suite, test, before } = require('mocha')
const path = require('path')
const fs = require('fs').promise
const fixtures = require('fs-test-fixtures')

suite('some package tests', () => {
  let fix
  before(() => {
    // Setup our fixtures instance with a directory structure like:
    // test/
    //  - index.js
    //  - tmp/
    //  - fixtures/
    //    - example/
    //      - package.json
    fix = fixtures({
      fixtures: path.join(__dirname, 'fixtures'),
      tmp: path.join(__dirname, 'tmp')
    })
  })

  test('test some things which require filesystem mocks', async () => {
    // Copy the contens of fixtures/example to tmp
    await fix.setup('example')

    // Do your tests
    assert.strictEqual(await fs.access(path.join(fix.TMP, 'package.json'), true)

    // Teardown (optional, because each call to `.setup`
    // will teardown first to ensure a clean state)
    // await fix.teardown()
  })
})

```
