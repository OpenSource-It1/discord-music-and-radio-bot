require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
require('./utils/functions')(client);
client.config = require('./botconfig.json');
const db = require('quick.db');
client.categories = [];
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Discord.Collection();
require('./functions')(client);

client.login(process.env.token).then((token) => {
  console.log("Succesfully logged in.");
  
}).catch((e) => {
  console.log(e)
})
