const nlToBr = require('./nl-to-br');
const addLine = require('./add-line');
const formatType = require('./format-type');

const buildShapeDoc = (shapes) => {
  let doc = '';

  shapes.forEach((shape) => {
    const linkId = `${shape.parent}-${shape.title}`.toLowerCase();
    doc = addLine(doc);
    doc = addLine(doc);
    doc = addLine(doc, `<a id="${linkId}" name="${linkId}"></a>`);
    doc = addLine(doc, `###${(shape.parent.match(/-/g) || []).map(() => '#').join('')} ${shape.title}`);
    doc = addLine(doc);

    if (shape.description) {
      doc = addLine(doc, shape.description);
      doc = addLine(doc);
    }

    if (shape.isShapeArray) {
      doc = addLine(doc, 'An array of:');
      doc = addLine(doc);
    }

    if (shape.isShapeObject) {
      doc = addLine(doc, 'An object of:');
      doc = addLine(doc);
    }

    if (typeof shape.value !== 'string' && Object.keys(shape.value).length > 0) {
      doc = addLine(doc, '| Property | PropType | Required | Description |');
      doc = addLine(doc, '|----------|----------|----------|-------------|');

      const nestedShapes = [];

      for (const prop of Object.keys(shape.value)) {
        const { name, required, description = '', defaultValue } = shape.value[prop];
        const isShape = name === 'shape';
        const isShapeArray = name === 'arrayOf' && shape.value[prop].value.name === 'shape';
        const isShapeObject = name === 'objectOf' && shape.value[prop].value.name === 'shape';
        const propName = isShape || isShapeArray || isShapeObject ? `[${prop}](#${shape.parent.toLowerCase()}-${shape.title.toLowerCase()}-${prop.toLowerCase()})` : prop;
        doc = addLine(doc, `| ${propName} | ${formatType(shape.value[prop])} | ${required ? 'yes' : ''} | ${nlToBr(description)} |`);

        if (isShape || isShapeArray || isShapeObject) {
          nestedShapes.push({
            parent: `${shape.parent}-${shape.title}`,
            title: prop,
            value: isShapeArray || isShapeObject ? shape.value[prop].value.value : shape.value[prop].value,
            description,
            isShapeArray,
            isShapeObject,
          })
        }
      }

      if (nestedShapes.length > 0) {
        const nestedShapeDoc = buildShapeDoc(nestedShapes);
        if (nestedShapeDoc) doc = addLine(doc, nestedShapeDoc, true);
      }
    } else {
      doc = addLine(doc, 'The structure has not been defined.');
    }
  });

  return doc;
};

module.exports = buildShapeDoc;
