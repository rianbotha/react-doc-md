#!/usr/bin/env node
const { performance } = require('perf_hooks');
const path = require('path');
const fg = require('fast-glob');
const writeReadme = require('./src/write-readme');
const endMessage = require('./src/end-message');
const argv = require('yargs')
  .usage('Usage: $0 <filename or glob> <root> [options]\nGlob can be a comma separated list. Glob needs to be wrapped in quotes.')
  .boolean(['to-console', 'force'])
  .describe('ignore', 'A filename or glob to exclude. You can comma separate a list. Make sure to wrap globs in quotes.')
  .describe('to-console', 'Outputs props table to command line instead of readme.')
  .describe('force', 'Overwrite the current readme if it exists and start and end comments are missing.')
  .demandCommand(2, 'You need to provide a filename or glob to generate the documentation from and a root path to calculate imports from.')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv

const filenames = argv._[0].split(',');
const root = argv._[1];
const ignore = argv['ignore'] ? argv['ignore'].split(',') : [];
const toConsole = argv['to-console'];
const force = argv.force;
const regex = /<!-- doc-md-start -->[\s\S]*<!-- doc-md-end -->/m;

const startTime = performance.now();

const stream = fg.stream(filenames, { ignore });
const entries = [];
const success = [];
const errors = [];
const warnings = [];

stream.on('data', (filename) => entries.push(filename));
stream.once('error', console.log);
stream.once('end', () => {
  Promise.all(entries.map(filename =>
    writeReadme(filename, root, toConsole, regex, force)
      .then(() => success.push(filename))
      .catch((e) => {
        if (e !== 'Warning') {
          errors.push(filename);
        } else {
          warnings.push(filename);
        }
      })
  )).then(
    () => {
      endMessage(startTime, entries.length, success, errors, warnings);
    }
  );
});
