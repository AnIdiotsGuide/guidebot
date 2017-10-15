const { get : fetch } = require("snekfetch");
const { Attachment } = require("discord.js");

const animals = {
  "cat": {
    fetch: async () => fetch ("http://random.cat/meow"),
    get: async (resp) => resp.body.file
  },
  "dog": {
    fetch: async (args) => {
      const url = args[1] ? `https://dog.ceo/api/breed/${args[1]}/images/random` : "https://dog.ceo/api/breeds/image/random";
      return fetch(url);
    },
    get: async (resp) => resp.body.message
  },
  "bunny": {
    fetch: async () => fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png"),
    get: async (resp) => resp.body.media.poster
  }
};

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args[0]) {
    return message.reply("Please give me a `thing` or choose one of those : " + Object.keys(animals).join(" , "));
  }
  const api = animals[args[0]];
  try {
    if (!api) {
      const resp = await fetch(`http://loremflickr.com/400/300/${args[0]}`);
      console.log(typeof resp.body);
      return message.channel.send(new Attachment(resp.body, `random${args[0]}.jpg`));
    }
  } catch (e) {
    return message.reply("Sorry I couldn't find any valid API for that keyword, try again!");
  }

  const response = await api.fetch(args);
  const image = await api.get(response);
  message.channel.send({files: [image]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "random",
  category: "Fun",
  description: "Grabs a random image from some internet API.",
  usage: "random <thing> []"
};
