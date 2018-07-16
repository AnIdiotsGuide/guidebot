const Discord = require("discord.js");

exports.run = (client, message, args) => {
    let suggestmessage = args.join(" ").slice(22);
    let suggestchannel = message.mentions.channels.first();

    if (!suggestchannel) {
        return message.reply("Please Mention the channel!")
    }

    if (!suggestmessage) {
        return message.reply("Plase Give Text To Suggestion Channel!")
    }

    let embed = new Discord.MessageEmbed()
        .addField("**SUGGESTION**", `${suggestmessage}`)
        .setFooter(`Suggestion By ${message.author.tag}`)
        .setTimestamp()
    suggestchannel.send({
        embed
    }).then(msg => {
        msg.react("✅").then(r => msg.react("❎"))
    });


    message.reply(`Your Suggestion is sent.`)
    return;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "suggest",
  category: "Miscelaneous",
  description: "Suggest features for the server",
  usage: "suggest [message] [channel]"
};
