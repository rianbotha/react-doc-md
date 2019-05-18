const nlToBr = require('./nl-to-br');
const addLine = require('./add-line');
const formatType = require('./format-type');

const buildShapeDoc = (shapes) => {
  let doc = '';

  shapes.forEach((shape) => {
    doc = addLine(doc);
    doc = addLine(doc);
    doc = addLine(doc, `###${(shape.parent.match(/-/g) || []).map(() => '#').join('')} <a name="${shape.parent}-${shape.title}"></a> ${shape.title}`);
    doc = addLine(doc);

    if (shape.isShapeArray) {
      doc = addLine(doc, 'An array of:');
      doc = addLine(doc);
    }

    if (Object.keys(shape.value).length > 0) {
      doc = addLine(doc, '| Property | PropType | Required | Description |');
      doc = addLine(doc, '|----------|----------|----------|-------------|');

      const nestedShapes = [];

      for (const prop of Object.keys(shape.value)) {
        const { name, required, description = '', defaultValue } = shape.value[prop];
        const isShape = name === 'shape';
        const isShapeArray = name === 'arrayOf' && shape.value[prop].value.name === 'shape';
        const propType = isShape || isShapeArray ? `[${formatType(shape.value[prop])}](#${shape.parent}-${shape.title}-${prop})` : `${formatType(shape.value[prop])}`;
        doc = addLine(doc, `| ${prop} | ${propType} | ${required ? 'yes' : ''} | ${nlToBr(description)} |`);

        if (isShape || isShapeArray) {
          nestedShapes.push({
            parent: `${shape.parent}-${shape.title}`,
            title: prop,
            value: isShapeArray ? shape.value[prop].value.value : shape.value[prop].value,
            isShapeArray,
          })
        }

        const nestedShapeDoc = buildShapeDoc(nestedShapes);
        if (nestedShapeDoc) doc = addLine(doc, nestedShapeDoc);
      }
    } else {
      doc = addLine(doc, 'The structure has not been defined.');
    }
  });

  return doc;
};

module.exports = buildShapeDoc;
