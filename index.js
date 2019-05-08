#!/usr/bin/env node
const path = require('path');
const buildDoc = require('./src/build-doc');
const writeReadme = require('./src/write-readme');
const argv = require('yargs')
  .usage('Usage: $0 <filename> <root> [options]')
  .boolean(['to-console', 'force'])
  .describe('to-console', 'Outputs props table to command line instead of readme')
  .describe('force', 'Overwrite the current readme if it exists and start and end comments are missing.')
  .demandCommand(2, 'You need to provide a file to generate the documentation from and a root path to calculate imports from.')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv

const filename = argv._[0];
const root = argv._[1];
const toConsole = argv['to-console'];
const force = argv.force;
const basename = path.parse(filename).name;
const readme = `${path.dirname(filename)}/${basename === 'index' ? 'readme' : basename}.md`;
const regex = /<!-- doc-md-start -->[\s\S]*<!-- doc-md-end -->/m;

const doc = buildDoc(filename, root);

if (doc) {
  if (toConsole) {
    console.log('<!-- doc-md-start -->\n' + doc + '<!-- doc-md-end -->');
  } else {
    writeReadme(readme, doc, regex, force);
  }
}
