const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return;
  const sayMessage = args.join(" ");
  message.delete().catch();
  message.channel.send(sayMessage);
}
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "say",
  category: "Outros",
  description: "Faz o bot dizer aquilo que escreves.",
  usage: "say"
};
