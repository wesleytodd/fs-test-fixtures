'use strict';
const fs = require('node:fs/promises');
const path = require('path');

module.exports = (opts = {}) => {
  const FIX = opts.fixtures || path.join(process.cwd(), 'test', 'fixtures');
  const TMP = opts.tmp || path.join(process.cwd(), 'test', 'tmp');

  // Log can be passed in, default is noop, true uses console.log
  let log;
  if (typeof opts.log === 'function') {
    log = opts.log;
  } else if (opts.log) {
    log = (msg) => { console.log(msg); };
  } else {
    log = () => { /* noop */ };
  }
  log(`Fixture directory: ${FIX}`);
  log(`Temp directory: ${TMP}`);

  return {
    FIX,
    TMP,
    setup: async function setup (name) {
      await this.teardown();
      log(`Setting up fixture: ${name || '<empty>'}`);
      await fs.mkdir(TMP, { recursive: true });
      if (name) {
        await fs.cp(path.join(FIX, name), TMP, { recursive: true });
      }
    },
    teardown: async function teardown () {
      try {
        log('Tearing down fixtures');
        await fs.rm(TMP, { recursive: true });
      } catch (e) {
        // Ignore errors removing if it doesnt exist
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    }
  };
};
