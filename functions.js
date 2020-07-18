const klaw = require('klaw');

module.exports = (client) => {
  
  let items = [];
  klaw('./Commands').on('readable', function(){
    let item;
    while(item = this.read()){
      items.push(item.path)
    }
  }).on('end', () => {
    items.forEach((file) => {
      if(!file.endsWith(".js")) return;
      if(require(file).help == undefined) return;
      let prop = require(file)
      client.commands.set(prop.help.name, prop)
      if(prop.help.aliases == undefined) return;
      prop.help.aliases.forEach(alias => {
        client.aliases.set(alias, prop.help.name)
      })
    })
  })
  
  let handlerItems = [];
  klaw('./Handlers').on('readable', function(){
    let item;
    while(item = this.read()){
      handlerItems.push(item.path)
    }
  }).on('end', () => {
    handlerItems.forEach((file) => {
      if(!file.endsWith(".js")) return;
      require(file)(client);
    })
  })
  
}
