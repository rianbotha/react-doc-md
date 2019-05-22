const addLine = (source, strToAdd = '', noNewLine = false) => (
  `${source}${strToAdd}${noNewLine ? '' : '\n'}`
);

module.exports = addLine;
