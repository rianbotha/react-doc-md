const reactDocs = require('react-docgen');
const fs = require('fs');
const path = require('path');
const upperCamelCase = require('uppercamelcase');
const chalk = require('chalk');
const localNameHandler = require('./local-name-handler');
const getExportDeclarations = require('./get-export-declarations');
const getImportPath = require('./get-import-path');
const stripComments = require('./strip-comments');
const formatType = require('./format-type');
const nlToBr = require('./nl-to-br');
const addLine = require('./add-line');


const buildDoc = (filename, root) => {
  try {
    const handlers = reactDocs.defaultHandlers.concat([ localNameHandler ]);
    const content = fs.readFileSync(path.resolve(process.cwd(), filename), 'utf-8');
    const components = reactDocs.parse(content, reactDocs.resolver.findAllExportedComponentDefinitions, handlers);
    const exportDeclarations = getExportDeclarations(content);

    let doc = '';

    components.forEach((component, i) => {
      const isNamed = exportDeclarations[component.localName] !== 'default' && exportDeclarations[component.localName] !== undefined;
      let importPath = getImportPath(filename, root);
      const displayName = component.displayName || upperCamelCase(/[^/]*$/.exec(importPath)[0]);
      const description = component.description;

      if (i > 0) doc = addLine(doc); // Add extra line between component sections

      doc = addLine(doc, `# ${displayName}`);
      doc = addLine(doc);

      if (description) {
        doc = addLine(doc, component.description);
        doc = addLine(doc);
      }

      doc = addLine(doc, '## Usage');
      doc = addLine(doc);

      doc = addLine(doc, '``` Javascript');
      doc = addLine(doc, `import ${isNamed ? '{ ' : ''}${displayName}${isNamed ? ' }' : ''} from '${importPath}';`);
      doc = addLine(doc, '```');
      doc = addLine(doc);

      doc = addLine(doc, '## Properties');
      doc = addLine(doc);

      if (component.props) {
        doc = addLine(doc, '| Property | PropType | Required | Default | Description |');
        doc = addLine(doc, '|----------|----------|----------|---------|-------------|');

        const shapes = [];

        for (const name of Object.keys(component.props)) {
          const { type, required, description, defaultValue } = component.props[name];
          const isShape = type.name === 'shape';
          const isShapeArray = type.name === 'arrayOf' && type.value.name === 'shape';
          const propType = isShape || isShapeArray ? `[${formatType(type)}](#${displayName}-${name})` : `${formatType(type)}`;
          doc = addLine(doc, `| ${name} | ${propType} | ${required ? 'yes' : ''} | ${defaultValue != null ? `\`${nlToBr(stripComments(defaultValue.value), true)}\`` : ''} | ${nlToBr(description)} |`);

          if (isShape || isShapeArray) {
            shapes.push({
              component: displayName,
              title: name,
              value: isShapeArray ? type.value.value : type.value,
              isShapeArray,
            })
          }
        }

        shapes.forEach((shape) => {
          doc = addLine(doc);
          doc = addLine(doc);
          doc = addLine(doc, `### <a name="${shape.component}-${shape.title}"></a> ${shape.title}`);
          doc = addLine(doc);

          if (shape.isShapeArray) {
            doc = addLine(doc, 'An array of:');
            doc = addLine(doc);
          }

          if (Object.keys(shape.value).length > 0) {
            doc = addLine(doc, '| Property | PropType | Required | Description |');
            doc = addLine(doc, '|----------|----------|----------|-------------|');


            for (const prop of Object.keys(shape.value)) {
              const { name, required, description = '', defaultValue } = shape.value[prop];
              doc = addLine(doc, `| ${prop} | ${formatType(shape.value[prop])} | ${required ? 'yes' : ''} | ${nlToBr(description)} |`);
            }
          } else {
            doc = addLine(doc, 'The structure has not been defined.');
          }
        });
      } else {
        doc = addLine(doc, 'This component has no properties');
      }

      doc = addLine(doc);
    });

    return doc;
  } catch (e) {
    console.error(chalk.red(`Can't extract data from file ${filename}: ${e.message}`));
    return null;
  }
}

module.exports = buildDoc;
