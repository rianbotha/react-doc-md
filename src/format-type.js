const nlToBr = require('./nl-to-br');

const formatType = (type) => {
  switch(type.name) {
    case 'arrayOf':
      return `\`${type.name}: ${type.value.name}\``;

    case 'enum':
      return nlToBr(`One of: \n${type.value.map(type => `\`${type.value}\``).join('\n')}`);

    case 'union':
      return `${type.value.map(formatType).join(' \\ ')}`;

    default:
      return `\`${type.name}\``;
  }
};

module.exports = formatType;
