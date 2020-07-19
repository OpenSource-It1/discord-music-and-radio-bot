onst Discord = require("discord.js");

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
        color: client.config.embed,
        description: `**Error** | I am not playing anything.`
      }
    });
  }
  client.player.clearQueue(message.guild.id);
  message.channel.send("Queue cleared!");
};

module.exports.help = {
  name: "clear-queue",
  module: __dirname.slice(__dirname.lastIndexOf("/")).slice(1),
  description: "",
  aliases: ["clear"],
  usage: "R!clear-queue",
  checkArgs: args => !!args.length
};
