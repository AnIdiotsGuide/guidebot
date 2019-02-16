const Discord = require("discord.js");
const botconfig = require("./config.json");

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}
module.exports.run = async (client, message, args) => {
  var rnd = randomIntInc(1, 5);
  if (rnd === 1) {
    const embed1 = new Discord.RichEmbed()
      .setDescription(':8ball: 8ball')
      .setColor('RANDOM')
      .addField(args.join(" "), 'Não')
    message.channel.send(embed1);
  } else if (rnd === 2) {
    const embed2 = new Discord.RichEmbed()
      .setDescription(':8ball: 8ball')
      .setColor('RANDOM')
      .addField(args.join(" "), 'Não é provavel')
    message.channel.send(embed2);
  } else if (rnd === 3) {
    const embed3 = new Discord.RichEmbed()
      .setDescription(':8ball: 8ball')
      .setColor('RANDOM')
      .addField(args.join(" "), 'Talvez')
    message.channel.send(embed3);
  } else if (rnd === 4) {
    const embed3 = new Discord.RichEmbed()
      .setDescription(':8ball: 8ball')
      .setColor('RANDOM')
      .addField(args.join(" "), 'Provavelmente')
    message.channel.send(embed3);
  } else if (rnd === 5) {
    const embed3 = new Discord.RichEmbed()
      .setDescription(':8ball: 8ball')
      .setColor('RANDOM')
      .addField(args.join(" "), 'Sim')
    message.channel.send(embed3);
  }

}


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["8"],
  permLevel: "User"
};

exports.help = {
  name: "8ball",
  category: "Diversão",
  description: "Mostra uma resposta negativa ou positiva a uma questão.",
  usage: "8ball [pergunta]"
};
