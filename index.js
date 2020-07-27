'use strict'
const fs = require('fs-extra')
const path = require('path')

module.exports = (opts = {}) => {
  const FIX = opts.fixtures || path.join(process.cwd(), 'test', 'fixtures')
  const TMP = opts.tmp || path.join(process.cwd(), 'test', 'tmp')

  return {
    FIX,
    TMP,
    setup: async function setup (name) {
      await this.teardown()
      await fs.mkdir(TMP, { recursive: true })
      if (name) {
        await fs.copy(path.join(FIX, name), TMP)
      }
    },
    teardown: async function teardown () {
      try {
        await fs.rmdir(TMP, { recursive: true })
      } catch (e) {
        // Ignore errors removing if it doesnt exist
        if (e.code !== 'ENOENT') {
          throw e
        }
      }
    }
  }
}
