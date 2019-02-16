const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {



  let youtube = args.slice(0).join('+');

  let link = `https://www.youtube.com/results?search_query=` + youtube;
  if (!youtube) return message.reply(`Please enter a word `)
  if (!link) return message.reply("Console error")
  let embed = new Discord.RichEmbed()
 
         
    .setColor("RED")
         
    .setTimestamp()
        
    .addField('Ação do cabrão:', 'Searching on youtube')

    .addField("Palavra (de Deus):", `${args.slice(0).join(' ')}`)

    .addField('Link:', `${link}`)
         
    .setFooter("O teu avatar", message.author.avatarURL);
          
  message.channel.send(embed);
  message.author.send(`Procuraste por ${link} em ${ message.guild.name}`);

        
    
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "youtube",
  category: "Diversão",
  description: "Pesquisa no youtube",
  usage: "youtube [video]"
};