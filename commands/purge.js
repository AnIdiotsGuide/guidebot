const Discord = require("discord.js");

module.exports.run = async (bot, message, args, messages) => {

  const deleteCount = parseInt(args[0], 10);
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Não. Apenas não.");
  if (!args[0] || args[0 == "help"]) return message.reply(`Por favor usa: //purge <número entre 2 e 100>"`);
    
  if (!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Por favor especifica um número entr 2 e 100 de mensagens para eliminar.");
   
  const fetched = await message.channel.fetchMessages({limit: deleteCount});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  
  let purgeEmbed = new Discord.RichEmbed()
    .setAuthor("♻️ Ação | Purge")
    .setColor("RANDOM")
    .addField("Executador", `<@${message.author.id}>`)
    .addField("Purge", `${args[0]}`)
    .addField("Eliminadas", `${args[0]}`)
    .setFooter("Versão do bot: 1.0.0", bot.user.displayAvatarURL);

  let purgeChannel = message.guild.channels.find(`name`, "🚫mod-logs🚫");
  if (!purgeChannel) return message.channel.send("Não encontrei o canal mod-logs");

  purgeChannel.send(purgeEmbed);

}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "purge",
  category: "Sistema",
  description: "Elimina as mensagens especificadas.",
  usage: "purge <número>"
};