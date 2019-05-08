const localNameHandler = (doc, def) => {
  if (def.parentPath.value.type === 'ExportDefaultDeclaration') {
    doc.set('localName', 'default');
  } else {
    doc.set('localName', def.parentPath.value.id.name);
  }

  return doc;
};

module.exports = localNameHandler;
