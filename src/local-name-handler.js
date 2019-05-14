const localNameHandler = (doc, def) => {
  if (def.parentPath.value.type === 'ExportDefaultDeclaration') {
    doc.set('localName', 'default');
  } else {
    if (def.value.type === 'ClassDeclaration') {
      doc.set('localName', def.value.id.name);
    } else {
      doc.set('localName', def.parentPath.value.id.name);
    }
  }

  return doc;
};

module.exports = localNameHandler;
