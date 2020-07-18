const Discord = require("discord.js");
const radioJSON = require("./organizedRadio.json");

module.exports.run = async (client, message, args) => {
  
    let NoAuthorConnection = new Discord.MessageEmbed()
    .setColor(client.config.success)
    .setTitle('Radio | Error')
    .setDescription('You need to be in voice channel in order to use that command!')
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());

    if (!message.member.voice.channel)
      return message.channel.send(NoAuthorConnection).then(msg => {
        msg.delete(10000);
      });

    let dataStructureForRadioJSON = getData();
    let pages = embedPagesArray(client, message, dataStructureForRadioJSON);

    let options = {
      min: 0,
      max: pages.length,
      page: 0
    };

    let embed = await message.channel.send({ embed: pages[options.page] });
    await embed.react("◀");
    await embed.react("▶");
    await embed.react("🗑️");

    let reactFilter = (reaction, user) => {
      return (
        ["◀", "▶", "🗑️"].includes(reaction.emoji.name) &&
        user.id == message.author.id
      );
    };

    let page = 0;
    let reactCollector = embed.createReactionCollector(reactFilter, {
      time: 60000
    });

    let msgFilter = msg =>
      msg.author.id == message.author.id &&
      new RegExp(
        `[0-9]{${
          pages[page].urls.length.toString().split("").length
        }}|[0-9]|cancel`,
        `i`
      ).test(msg.content);

    reactCollector.on("collect", async (element, reaction) => {
      if (element._emoji.name == "◀") {
        element.users.remove(message.author.id);
        if (page >= options.min) {
          page = page - 1;
          msgFilter = msg =>
            msg.author.id == message.author.id &&
            new RegExp(
              `[0-9]{${
                pages[page].urls.length.toString().split("").length
              }}|[0-9]|cancel`,
              `i`
            ).test(msg.content);
          await embed.edit({ embed: pages[page] });
        }
      } else if (element._emoji.name == "▶") {
        element.users.remove(message.author.id);
        if (page <= options.max) {
          page = page + 1;
          msgFilter = msg =>
            msg.author.id == message.author.id &&
            new RegExp(
              `[0-9]{${
                pages[page].urls.length.toString().split("").length
              }}|[0-9]|cancel`,
              `i`
            ).test(msg.content);
          await embed.edit({ embed: pages[page] });
        }
      } else if (element._emoji.name == "🗑️") {
        element.users.remove(message.author.id);
        return embed.delete();
      } else {
        return;
      }
    });

    reactCollector.on("end", async () => {});

    let msgCollector = message.channel.createMessageCollector(msgFilter, {
      time: 60000,
      max: 1,
      maxMatches: 1
    });

    msgCollector.on("collect", async (msg, collector) => {
      embed.delete();
      reactCollector.emit("end");
    });

    msgCollector.on("end", async (data, reason) => {
      let msg = data.first();

      if (msg == undefined) return message.channel.send(`No radio station ID was selected, cancelled process.`);
      if (msg.content.toLowerCase() == "cancel") return message.channel.send(`Cancelled process`);
      let currentPage = pages[page];
      let radioNum = parseInt(msg.content);
      let radioURL = currentPage.urls[radioNum - 1];
      let radioName = currentPage.description.split("\n")[currentPage.urls.findIndex(url => url == radioURL) + 1].split(" ").slice(1).join(" ");
      let connection = await message.member.voice.channel.join();
      let dispatcher = connection.play(radioURL, { volume: 0.5 });
      let RadioNowPlaying = new Discord.MessageEmbed();
      RadioNowPlaying.setColor(client.config.success);
      RadioNowPlaying.setTitle("Radio");
      RadioNowPlaying.setDescription(`Now playing the radio station: __**${radioName}**__`);
      RadioNowPlaying.setFooter(`Requested by: ${message.author.tag}`,message.author.displayAvatarURL());
      
      let nowPlayingMsg = await message.channel.send(RadioNowPlaying);

      let musicDataConstruct = {
        radioStationPlaying: true,
        msg: nowPlayingMsg
      }
      client.queue.set(message.guild.id, musicDataConstruct)
    })
//   } catch (e) {
//     console.log(e);
//     return message.channel.send(errorEmbed);
  
//     let errorEmbed = new Discord.RichEmbed()
//     .setColor(success)
//     .setTitle('Radio | Error')
//     .setDescription('An unexpected error has occured! Please try the command again.')
//     .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL);
//   }
};

module.exports.help = {
  name: "radio",
  module: __dirname.slice(__dirname.lastIndexOf("/")).slice(1),
  description: "",
  usage: "*radio",
  checkArgs: args => true
};

function getData() {
  let obj = new Object();
  let radioCountries = Object.keys(radioJSON).sort();
  Object.values(radioJSON).forEach((country, c) => {
    let array = new Array();
    let countryObj = new Object();
    let countryName = radioCountries[c];
    let companies = Object.keys(country);
    Object.values(country).forEach((company, i) => {
      let companyObject = new Object();
      let arrayData = new Array();
      let companyName = companies[i];
      Object.values(company).forEach(url => {
        let name = Object.keys(company)[
          Object.values(company).findIndex(uri => uri == url)
        ];
        if (
          typeof name != "string" ||
          name.length == 0 ||
          typeof url != "string" ||
          url.length == 0
        )
          return;
        arrayData.push({
          Name: name,
          Url: url
        });
      });
      companyObject.name = companyName;
      companyObject.country = countryName;
      companyObject.data = arrayData.sort(function(a, b) {
        let nameA = a.Name.toLowerCase();
        let nameB = b.Name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      array.push(companyObject);
    });
    obj[c] = array;
  });
  return obj;
}

function embedPagesArray(client, message, objectRadioJSON) {
  
  let pages = new Array();
  let correctFormat = new Array();
  Object.values(objectRadioJSON).forEach((country, i)=> {
    correctFormat = correctFormat.concat(country)
  })
  correctFormat.forEach((company, i) => {
    let country = company.country;
    let description = company.data.sort(function(a, b) {
      let nameA = a.Name.toLowerCase();
      let nameB = b.Name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    let ownedBy = `__**Owned by ${company.name}**__`;
    let embed = new Discord.MessageEmbed();
    embed.setTitle(country)
    embed.setColor(client.config.success)
    embed.setDescription(description.length == 0 ? `${ownedBy}\nSorry, we currently don't have any radios owned by ${company.name}!`: `${ownedBy}\n${description.map((radio, i) => `**${i + 1}**: ${radio.Name}`).join("\n")}`)
    embed.setFooter(`You have 1 minute to choose a radio Station!`, message.guild.iconURL())
    embed.urls = description.map(radios => radios.Url);
    pages.push(embed)
  });
  return pages;

  // let pages = new Array();
  // let correctFormat = new Array();
  // Object.values(objectRadioJSON).forEach((country, i)=> {
  //   correctFormat = correctFormat.concat(country)
  // })
  // correctFormat.forEach((company, i) => {
  //   let companyObject = new Object();
  //   let country = company.country;
  //   let description = company.data.sort(function(a, b) {
  //     let nameA = a.Name.toLowerCase();
  //     let nameB = b.Name.toLowerCase();
  //     if (nameA < nameB) return -1;
  //     if (nameA > nameB) return 1;
  //     return 0;
  //   });
  //   let ownedBy = `__**Owned by ${company.name}**__`;
  //   let embedDescription = description.length == 0 ? `${ownedBy}\nSorry we currently don't have any radios from ${company.name}!`: `${ownedBy}\n${description.map((radio, i) => `**${i + 1}**: ${radio.Name}`).join("\n")}`;
  //   companyObject.title = country;
  //   companyObject.color
  //   companyObject.description = embedDescription;
  //   companyObject.footer = {
  //     text: `You have 1 minute to choose a radio Station!`,
  //     icon_url: message.guild.iconURL
  //   };
  //   companyObject.urls = description.map(radios => radios.Url);
  //   pages[i] = companyObject;
  // });
  // return pages;
}
