const { RichEmbed } = require('discord.js'), 
  { get } = require('node-superfetch');

exports.run = async (client, message, args, color) => {
  
  let m = await message.channel.send(`*Espera por favor...*`);
  try {
    const { body } = await get('https://api-to.get-a.life/meme')

    let memeEmbed = new RichEmbed() 
      .setColor(color) 
      .setTitle(body.text)
      .setImage(body.url)
      .setTimestamp()
      .setFooter(`Request by: ${message.author.tag}`);
  
    message.channel.send(memeEmbed).then(() => { m.delete();});
  } catch (e) {
    message.channel.send(`Um erro ocorreu :( \`${e.message}\` tenta outra vez mais tarde!`);
  } 
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "meme",
  category: "Diversão",
  description: "Vê um meme",
  usage: "meme"
};
