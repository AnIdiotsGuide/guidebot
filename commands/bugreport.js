const Discord = require('discord.js');
const moment = require('moment');

const cooldown = new Set();
exports.run = (client, message) => {
  let args = message.content.split(' ').slice(1).join(' ');
  message.delete();

  if (cooldown.has(message.author.id && message.guild.id)) {
    return message.reply('**[COOLDOWN]** Bugreport command has **5 Minutes** Cooldown!');
  }
  if (args.length < 1) {
    return message.reply('You must supply me full reportation!');
  }
  cooldown.add(message.author.id && message.guild.id);

  setTimeout(() => {
    cooldown.delete(message.author.id && message.guild.id);
  }, 300000);
  let guild = message.guild;
  const cnl = client.channels.get('316266748670115843');
  message.reply('OK. Recebemos o teu reporte. Iremos responder-te o mais cedo possível:');
  const embed2 = new Discord.RichEmbed()
    .setAuthor(`Reporte de ${message.author.tag}`, message.author.displayAvatarURL)
    .addField('Reporte:', `**Autor do reporte:** ${message.author.tag}\n**Server:** ${guild.name}\n**Reporte inteiro:** ${args}`)
    .setThumbnail(message.author.displayAvatarURL)
    .setFooter(`${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
    .setColor(16711728);
  message.channel.send({embed: embed2});
  const embed = new Discord.RichEmbed()
    .setAuthor(`Report from ${message.author.tag}`, message.author.displayAvatarURL)
    .addField('Report:', `**Autor do reporte:** ${message.author.tag}\n**Server:** ${guild.name}\n**Reporte inteiro:** ${args}`)
    .setThumbnail(message.author.displayAvatarURL)
    .setColor(16711728);
  cnl.send({embed})
    .catch(e => logger.error(e))
// In your command
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "bugreport",
  category: "Sistema",
  description: "Faz um reporte de bugs.",
  usage: "bugreport [reporte]"
};
