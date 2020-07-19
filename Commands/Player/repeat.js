const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  
          const repeatModeEnabled = client.player.getQueue(message.guild.id).repeatMode;
        if(repeatModeEnabled){
             // if the repeat mode is currently enabled, disable it
             client.player.setRepeatMode(message.guild.id, false);
             message.channel.send("Repeat mode disabled! The current song will no longer be played again and again...");
        } else {
             // if the repeat mode is currently disabled, enable it
             client.player.setRepeatMode(message.guild.id, true);
             message.channel.send("Repeat mode enabled! The current song will be played again and again until you run the command again!");
        }
    }

module.exports.help = {
  name: "repeat",
  module: __dirname.slice(__dirname.lastIndexOf("/")).slice(1),
  description: "",
  aliases: ["loop"],
  usage: "R!repeat",
  checkArgs: args => !!args.length
};
