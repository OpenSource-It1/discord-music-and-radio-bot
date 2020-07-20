require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
require('./Utilities/functions')(client);
client.config = require('./Config/botconfig.json');
const db = require('quick.db');
client.categories = [];
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Discord.Collection();
require('./functions')(client);
const { Player } = require('discord-player')
const player = new Player(client, {
  leaveOnEmpty: false,
  leaveOnEnd: false,
  leaveOnStop: true
});
client.player = player;
client.login(process.env.token).then((token) => {
  console.log("Succesfully logged in.");

}).catch((e) => {
  console.log(e)
})
