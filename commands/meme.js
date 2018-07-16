exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
message.channel.startTyping();
randomPuppy('memes')
    .then(url => {
        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setImage(url)
            .setColor('RANDOM')
        message.channel.send(embed);
        message.channel.stopTyping(true);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "meme",
  category: "Fun",
  description: "Random meme",
  usage: "meme"
};