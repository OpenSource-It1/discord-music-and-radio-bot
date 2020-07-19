module.exports = (client) => {
    client.clean = (text) => {
    if (typeof (text) === 'string') {
      return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
    return text;
  };
}
