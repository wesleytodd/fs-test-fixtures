'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const slugify = require('slugify');

module.exports = function create (opts = {}, setupName) {
  const cwd = opts.cwd || process.cwd();
  const FIX = opts.fixtures || path.join(cwd, 'test', 'fixtures');
  let TMP = opts.tmp;
  if (!TMP && opts.testName) {
    TMP = path.join(cwd, 'test', `tmp-${slugify(opts.testName)}`);
  } else if (!TMP) {
    TMP = path.join(cwd, 'test', 'tmp');
  }

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

  const instance = {
    FIX,
    TMP,
    setup: async function setup (name) {
      await instance.teardown();
      log(`Setting up fixture: ${name || '<empty>'}`);
      await fs.mkdir(TMP, { recursive: true });
      if (name) {
        await fs.cp(path.join(FIX, name), TMP, { recursive: true });
      }
      return instance;
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
      return instance;
    }
  };

  if (setupName) {
    return instance.setup(setupName);
  }

  return instance;
};
