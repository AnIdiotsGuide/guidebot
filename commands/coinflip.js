const Discord = require('discord.js');

exports.run = function (client, message) {
  /*
    Randomize the answer
  */
    let answers = [
        'cara',
        'coroa',
        'cara',
        'coroa',
        'cara',
        'coroa',
        'cara',
        'coroa',
        'cara',
        'coroa'
    ];
    let embed = new Discord.RichEmbed()
  .addField('CoinFlip', `${answers[~~(Math.random() * answers.length)]}`);
    message.channel.send({embed}).catch(e => logger.error(e))
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "coinflip",
  category: "Diversão",
  description: "Joga o coinflip.",
  usage: "coinflip"
};
