const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const writeReadme = (readme, doc, regex, force) => {
  try {
    let readmeContent = '';
    let fileExists = false;

    if(!fs.existsSync(readme)) {
      console.warn(chalk.yellow(`${readme} not found and will be created`));
    } else {
      readmeContent = fs.readFileSync(path.resolve(process.cwd(), readme), 'utf-8');
      fileExists = true;
    }

    if (readmeContent.match(regex)) {
      const result = readmeContent.replace(
        regex,
        '<!-- doc-md-start -->\n' + doc + '<!-- doc-md-end -->'
      );

      fs.writeFile(readme, result, 'utf-8', (e) => {
        if (e) {
          return console.error(chalk.red(`Error updating ${readme}: ${e}`));
        } else {
          return console.log(chalk.green(`${readme} updated successfully.`));
        }
      });
    } else {
      if (force || !fileExists) {
        const result = '<!-- doc-md-start -->\n' + doc + '<!-- doc-md-end -->';

        fs.writeFile(readme, result, 'utf-8', (e) => {
          if (e) {
            return console.error(chalk.red(`Error updating ${readme}: ${e}`));
          } else {
            return console.log(chalk.green(`${readme} written successfully.`));
          }
        });
      } else {
        console.warn(
          chalk.yellow(`Could not find doc to replace in ${readme}\n`),
          'The documentation needs to be wrapped between <!-- doc-md-start --> and <!-- doc-md-end -->\n',
          'or use with --force to overwrite the file'
        )
      }
    }
  } catch (e) {
    console.error(chalk.red(`Error updating ${readme}: ${e}`));
  }
}

module.exports = writeReadme;
