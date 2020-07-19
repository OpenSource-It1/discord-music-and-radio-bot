const Discord = require("discord.js");
const fs = require("fs")

module.exports.run = async (client, message, args) => {
  if (!message.member.voice.channel)
    return message.channel.send({
      embed: {
        color: client.config.error,
        description: `**Error** | You are not in a voice channel.`
      }
    });
  if (
    message.guild.me.voice.channel &&
    message.member.voice.channel.id !== message.guild.me.voice.channel.id
  )
    return message.channel.send({
      embed: {
        color: client.config.error,
        description: `**Error**| You are not in my voice channel.`
      }
    });

  if (!client.player.isPlaying(message.guild.id)) {
    return message.channel.send({
      embed: {
        color: client.config.error,
        description: `**Error** | I am not playing anything.`
      }
    });
  }
  const song = await client.player.pause(message.guild.id);
  message.channel.send(`${song.name} paused!`);
};

module.exports.help = {
  name: "pause",
  module: __dirname.slice(__dirname.lastIndexOf("/")).slice(1),
  description: "",
  usage: "R!pause",
  checkArgs: args => !!args.length
};
