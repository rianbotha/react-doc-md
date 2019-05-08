const path = require('path');

const getImportPath = (filename, root) => {
  const rootPath = path.resolve(process.cwd(), root);
  let importPath = path.resolve(process.cwd(), filename);
  importPath = importPath.replace(rootPath, '');
  importPath = importPath.replace(/^\//, '');
  importPath = importPath.replace(/\/(index)?\.\w+$/g, '');

  return importPath;
};

module.exports = getImportPath;
