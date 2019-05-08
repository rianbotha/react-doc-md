const babelParser = require('@babel/parser');

const defaultPlugins = ['jsx', 'flow', 'asyncGenerators', 'bigInt', 'classProperties', 'classPrivateProperties', 'classPrivateMethods', ['decorators', {
  decoratorsBeforeExport: false
}], 'doExpressions', 'dynamicImport', 'exportDefaultFrom', 'exportNamespaceFrom', 'functionBind', 'functionSent', 'importMeta', 'logicalAssignment', 'nullishCoalescingOperator', 'numericSeparator', 'objectRestSpread', 'optionalCatchBinding', 'optionalChaining', ['pipelineOperator', {
  proposal: 'minimal'
}], 'throwExpressions'];

const getExportDeclarations = (content) => {
  const ast = babelParser.parse(content, {
    sourceType: 'module', // parse in strict mode and allow module declarations
    plugins: defaultPlugins,
  });

  let exportDeclarations = {};
  let namedDeclarations = ast.program.body.filter(node => node.type === 'ExportNamedDeclaration') || [];

  namedDeclarations.forEach((declaration) => {
    if (declaration.specifiers) {
      declaration.specifiers.forEach((specifier) => {
        exportDeclarations[specifier.local.name] = specifier.exported.name;
      });
    }
  });

  return exportDeclarations;
}

module.exports = getExportDeclarations;
