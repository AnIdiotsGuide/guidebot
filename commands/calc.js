var math = require('mathjs');
const Discord = require("discord.js");

exports.run = (bot, message, args, command) => {
    let input = args.join(" ");
    if (!input) {
        message.reply('__You must provide a equation to be solved on the calculator!__');
        return;
    }

    const question = args.join(" ");

    let answer;
    try {
        answer = math.eval(question);
    } catch (err) {
        return message.reply(`**Invalid math equation:** ${err}`);
    }

    const Discord = require('discord.js');
    const embed = new Discord.RichEmbed()
        .setThumbnail("https://images-na.ssl-images-amazon.com/images/I/31QYTepQomL.png")
        .setColor('RANDOM')
        .addField("**Question:**", question, true)
        .addField("**Answer:**", answer)
        .setFooter(`requested by ${message.author.tag}`);

    message.channel.send({
        embed
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "calc",
  category: "Math",
  description: "Calculate The Data You Give Me!",
  usage: "Calculate"
};
