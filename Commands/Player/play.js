const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  let query = args.join(" ");

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

  let search = await client.player.searchTracks(query).catch(e => {
    return message.channel.send({
      embed: {
        color: client.config.error,
        description: `**Error** | No results were found for that query.`
      }
    });
  });
  if (search.length < 1)
    return message.channel.send({
      embed: {
        color: client.config.embed,
        description: `**Error** | Query was too short... Please try again! `
      }
    });

  // let query = args.join(" ");
  let requestedBy = client.users.cache.get(message.author.id).tag;

  if (!query)
    return message.channel.send({
      embed: {
        color: client.config.error,
        description: `**Error** | Please enter a search query to search.`
      }
    });

  let playing = client.player.isPlaying(message.guild.id);
  if (client.player.isPlaying(message.guild.id)) {
    let song = await client.player.addToQueue(
      message.guild.id,
      query,
      requestedBy
    );
    message.channel.send({
      embed: {
        color: client.config.embed,
        description: `**Added To Queue** | [${song.name}](${song.url})`,
        thumbnail: {
          url: song.thumbnail
        },
        fields: [
          {
            name: `Duration`,
            value: `\`${song.duration}\``,
            inline: true
          },
          {
            name: `Author`,
            value: `\`${song.author}\``,
            inline: true
          },
          {
            name: `Views`,
            value: `\`${song.views.toLocaleString()}\``,
            inline: true
          },
          {
            name: `Requested By`,
            value: `\`${song.requestedBy}\``,
            inline: true
          }
        ]
      }
    });
  } else {
    let song = await client.player.play(
      message.member.voice.channel,
      query,
      requestedBy
    );
    client.player.setVolume("100");
    message.channel.send({
      embed: {
        color: client.config.embed,
        description: `**Now Playing** | [${song.name}](${song.url})`,
        thumbnail: {
          url: song.thumbnail
        },
        fields: [
          {
            name: `Duration`,
            value: `\`${song.duration}\``,
            inline: true
          },
          {
            name: `Author`,
            value: `\`${song.author}\``,
            inline: true
          },
          {
            name: `Views`,
            value: `\`${song.views.toLocaleString()}\``,
            inline: true
          },
          {
            name: `Requested By`,
            value: `\`${song.requestedBy}\``,
            inline: true
          }
        ]
      }
    });

    client.player
      .getQueue(message.guild.id)
      .on("end", () => {
        message.channel.send({
          embed: {
            color: client.config.embed,
            description: `**Queue** | The available queue has finished, please make a request again or run \`R!disconnect\`.`
          }
        });
      })
      .on("trackChanged", (oldTrack, newTrack, skipped, repeatMode) => {
        if (repeatMode) {
          message.channel.send({
            embed: {
              color: client.config.embed,
              description: `**Repeat Mode** | Repeating: [${oldTrack.name}](${oldTrack.url})`
            },
            fields: [
              {
                name: `Duration`,
                value: `\`${oldTrack.duration}\``,
                inline: true
              },
              {
                name: `Author`,
                value: `\`${oldTrack.author}\``,
                inline: true
              },
              {
                name: `Requested By`,
                value: `\`${oldTrack.requestedBy}\``,
                inline: true
              }
            ]
          });
        } else {
          message.channel.send({
            embed: {
              color: client.config.embed,
              description: `**Now Playing** | [${song.name}](${song.url})`,
              thumbnail: {
                url: newTrack.thumbnail
              },
              fields: [
                {
                  name: `Duration`,
                  value: `\`${newTrack.duration}\``,
                  inline: true
                },
                {
                  name: `Author`,
                  value: `\`${newTrack.author}\``,
                  inline: true
                },
                {
                  name: `Requested By`,
                  value: `\`${newTrack.requestedBy}\``,
                  inline: true
                }
              ]
            }
          });
        }
      });
  }
};

module.exports.help = {
  name: "play",
  module: __dirname.slice(__dirname.lastIndexOf("/")).slice(1),
  description: "",
  aliases: ["p"],
  usage: "R!play song",
  checkArgs: args => !!args.length
};
