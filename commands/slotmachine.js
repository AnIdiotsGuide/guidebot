const Discord = require('discord.js');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission("SEND_MESSAGES")) return message.author.send('Não tenho permissões para amandar mensagens. Por favor pede para eu poder mandar mensagens.');

  let slots = ["🍎", "🍌", "🍒", "🍓", "🍈"];
  let result1 = Math.floor((Math.random() * slots.length));
  let result2 = Math.floor((Math.random() * slots.length));
  let result3 = Math.floor((Math.random() * slots.length));
  let name = message.author.displayName;
  let aicon = message.author.displayAvatarURL;

  if (slots[result1] === slots[result2] && slots[result3]) {
    let wEmbed = new Discord.RichEmbed()
      .setFooter("Ganhou!", aicon)
      .setTitle(':slot_machine:Slots:slot_machine:')
      .addField('Result:', slots[result1] + slots[result2] + slots[result3], true)
      .setColor("#f4e842");
    message.channel.send(wEmbed);
  } else {
    let embed = new Discord.RichEmbed()
      .setFooter('Perdeu!', aicon)
      .setTitle(':slot_machine:Slots:slot_machine:')
      .addField('Result', slots[result1] + slots[result2] + slots[result3], true)
      .setColor("#f4e842");
    message.channel.send(embed);
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "slotmachine",
  category: "Diversão",
  description: "É a roleta do casino!!!",
  usage: "slotmachine"
};
