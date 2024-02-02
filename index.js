'use strict';
const fs = require('fs-extra');
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
        await fs.copy(path.join(FIX, name), TMP);
      }
    },
    teardown: async function teardown () {
      try {
        log('Tearing down fixtures');
        await fs.remove(TMP);
      } catch (e) {
        // Ignore errors removing if it doesnt exist
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    }
  };
};
