exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = {
  "title": "Did you know that it costs money to host a discord bot?",
  "description": "With a small donation, you can keep this bot running for months",
  "color": 1464458,
  "timestamp": "2018-07-16T12:52:50.997Z",
  "footer": {
    "icon_url": "https://cdn.discordapp.com/avatars/467763647909724162/8eaf7ad192a3a38552167c4527bb2cfd.png?size=256",
    "text": "Infinite#6174"
  },
  "author": {
    "name": "Infinite#6174",
    "url": "https://discordapp.com",
    "icon_url": "https://cdn.discordapp.com/avatars/467763647909724162/8eaf7ad192a3a38552167c4527bb2cfd.png?size=256"
  },
  "fields": [
    {
      "name": "Donate",
      "value": "Please donate at https://paypal.me/infinitexe"
    }
  ]
  }

message.channel.send({ embed });


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "support",
  category: "Awesome people only",
  description: "Support the bot by donating",
  usage: "donate"
}};