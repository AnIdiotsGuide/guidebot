const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let replies = ["One", "Two", "Three", "Four", "Five", "Six"];
    let result = Math.floor((Math.random() * replies.length));

    message.delete().catch(O_o => {});

    try {
        let newembed = new Discord.MessageEmbed()
            .setAuthor("A dice has been rolled!")
            .setColor("#00FF00")
            .setDescription("Rolled By: " + message.author.username + "\nResult: " + replies[result]);

        message.channel.send({
            embed: newembed
        });
    } catch (e) {
        console.log(e.stack);
    }; // The try is because it errored when I didn't do it.
};



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "rolldice",
  category: "Miscelaneous",
  description: "keep on rollin'",
  usage: "rolldice"
};
