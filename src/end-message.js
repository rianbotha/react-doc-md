const { performance } = require('perf_hooks');
const chalk = require('chalk');

const endMessage = (startTime, entryLength, success, errors = [], warnings = []) => {
  const successLength = success.length;
  const errorsLength = errors.length;
  const warningsLength = warnings.length;
  const isSuccess = entryLength === successLength;
  const endTime = performance.now();
  const elapsed = endTime - startTime;

  console.log('');

  if (entryLength > 1 && successLength > 0) {
    console.log(chalk.green(`${successLength} doc${successLength === 1 ? '' : 's'} successfully created.`));
  }

  if (entryLength > 1 && warningsLength > 0) {
    console.log(chalk.yellow(`${warningsLength} file${warningsLength === 1 ? '' : 's'} skipped.`));
  }

  if (entryLength > 1 && errorsLength > 0) {
    console.log(chalk.red(`${errorsLength} file${errorsLength === 1 ? '' : 's'} with errors:`));
    errors.forEach(error => {
      console.log(error);
    });
  }

  console.log(
    chalk.bold(`\n${isSuccess ? chalk.green('Done!') : chalk.yellow('Done with errors.')}`),
    chalk.gray(`${entryLength} file${entryLength === 1 ? '' : 's'} parsed in ${+(elapsed/1000).toFixed(2)}s`),
  );
};

module.exports = endMessage;
