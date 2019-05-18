const nlToBr = require('./nl-to-br');

const formatType = (type) => {
  switch(type.name) {
    case 'union':
      return `${type.value.map(formatType).join(' \\ ')}`;

    case 'enum':
      return nlToBr(`One of: \n${type.value.map(type => `\`${type.value}\``).join('\n')}`);

    default:
      return `\`${type.name}\``;
  }
};

module.exports = formatType;
