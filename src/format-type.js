const formatType = (type) => (
  type.name === 'union'
    ? type.value.map(formatType).join(' | ')
    : type.name
);

module.exports = formatType;
