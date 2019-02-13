const Discord = require("discord.js");

module.exports.run = async (bot, message, args, messages) => {

  const deleteCount = parseInt(args[0], 10);
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Não. Apenas não..");
    
  if (!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Por favor esecifique um número entre 2 e 100 de mensagens para eliminar.");
   
  const fetched = await message.channel.fetchMessages({limit: deleteCount});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Não pude eliminar as mensagens por causa de: ${error}`));
  
  let purgeEmbed = new Discord.RichEmbed()
    .setAuthor("♻️ Action | Purge")
    .setColor("RANDOM")
    .addField("Executador", `<@${message.author.id}>`)
    .addField("Purge", `${args[0]}`)
    .addField("Deletado", `${args[0]}`)
    .setFooter("Versão do bot 1.0.0", bot.user.displayAvatarURL);

  let purgeChannel = message.guild.channels.find(`name`, "🚫mod-logs🚫");
  if (!purgeChannel) return message.channel.send("Não foi possível localizar o canal mod-logs.");

  purgeChannel.send(purgeEmbed);

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["p", "purga"],
  permLevel: "User"
};

exports.help = {
  name: "purge",
  category: "Sistema",
  description: "Elimina um número especificado de mensagens.",
  usage: "purge [número entre 2 e 100]"
};
