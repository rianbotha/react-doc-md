const nlToBr = (str, addQuotes = false) => (
  str.replace(/\r\n|\r|\n/gi, addQuotes ? '`<br>`' : '<br>')
);

module.exports = nlToBr;
