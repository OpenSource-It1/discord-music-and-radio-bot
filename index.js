require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
require('./Utilities/functions')(client);
client.config = require('./Config/botconfig.json');
client.categories = [];
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Discord.Collection();
require('./functions')(client);
const fs = require("fs");

client.login(process.env.token).then((token) => {
  console.log("Succesfully logged in.");
  
}).catch((e) => {
  console.log(e)
})
