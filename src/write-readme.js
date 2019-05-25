const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const buildDoc = require('./build-doc');

const writeReadme = (filename, root, toConsole, regex, force) => {
  return new Promise((resolve, reject) => {
    const basename = path.parse(filename).name;
    const readme = `${path.dirname(filename)}/${basename === 'index' ? 'readme' : basename}.md`;

    const doc = buildDoc(filename, root);

    if (doc) {
      if (toConsole) {
        console.log(chalk.gray(`Doc for ${filename}:`))
        console.log('<!-- doc-md-start -->\n' + doc + '<!-- doc-md-end -->\n\n');
        resolve('Success');
      } else {
        try {
          let readmeContent = '';
          let newContent = '';
          let fileExists = false;

          if(!fs.existsSync(readme)) {
            console.warn(chalk.yellow(`${readme} not found and will be created`));
          } else {
            readmeContent = fs.readFileSync(path.resolve(process.cwd(), readme), 'utf-8');
            fileExists = true;
          }

          if (readmeContent.match(regex)) {
            newContent = readmeContent.replace(
              regex,
              '<!-- doc-md-start -->\n' + doc + '<!-- doc-md-end -->'
            );
          } else if (force || !fileExists) {
            newContent = '<!-- doc-md-start -->\n' + doc + '<!-- doc-md-end -->';
          }

          if (newContent) {
            try {
              fs.writeFileSync(readme, newContent, 'utf-8');

              console.log(chalk.green(`${readme} updated successfully.`));
              resolve('Success');
            } catch (e) {
              console.error(chalk.red(`Error updating ${readme}: ${e}`));
              reject('Error');
            }
          } else {
            console.warn(
              chalk.yellow(`Could not find content to replace in ${readme}`),
              '\nThe documentation needs to be wrapped between <!-- doc-md-start --> and <!-- doc-md-end -->',
              '\nor use with --force to overwrite the file'
            );
            reject('Warning');
          }
        } catch (e) {
          console.error(chalk.red(`Error updating ${readme}: ${e}`));
          reject('Error');
        }
      }
    } else {
      reject('Error');
    }
  });
};

module.exports = writeReadme;
