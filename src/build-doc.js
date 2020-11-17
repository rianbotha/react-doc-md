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
const buildShapeDoc = require('./build-shape-doc');


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
          const isShapeObject = type.name === 'objectOf' && type.value.name === 'shape';
          const propName = isShape || isShapeArray || isShapeObject ? `[${name}](#${displayName.toLowerCase()}-${name.toLowerCase()})` : name;
          doc = addLine(doc, `| ${propName} | ${formatType(type)} | ${required ? 'yes' : ''} | ${defaultValue != null ? `\`${nlToBr(stripComments(defaultValue.value), true)}\`` : ''} | ${nlToBr(description)} |`);

          if (isShape || isShapeArray || isShapeObject) {
            shapes.push({
              parent: displayName,
              title: name,
              value: isShapeArray || isShapeObject ? type.value.value : type.value,
              description,
              isShapeArray,
              isShapeObject,
            })
          }
        }

        doc = addLine(doc, buildShapeDoc(shapes));
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
