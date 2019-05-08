const stripComments = (str) => (
  // This is a little blunt, but can be improved when we run into problems
  str.replace(/\/\*(.|[\r\n])*?\*\/(\s)?/g, '')
);

module.exports = stripComments;
