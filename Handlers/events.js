const klaw = require('klaw');
const path = require('path');

module.exports = async (client) => {
  
  let eventsItems = [];
  klaw('./Events').on('readable', function(){
    let item;
    while(item = this.read()){
      eventsItems.push(item.path);
    }
  }).on('end', () => {
    eventsItems.forEach((file) => {
      if(!file.endsWith(".js")) return;
      let evt = require(file);
      let eName = path.basename(file).replace(".js","");
      client.on(eName, evt.bind(null, client));
    })
  })
  
}
