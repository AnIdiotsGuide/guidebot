exports.run = async (client, message, args, level) => {
  var achievement = args.join(" ");
  var request = require('request');
  var fs = require('fs');
  var Discord = require('discord.js');
  function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }
  var wembed = new Discord.RichEmbed()
    .setColor('#DC3545')
    .setAuthor(`${message.author.username} try again`, `${message.author.avatarURL}`)
    .addField("**-achievement {ur achievement}**", "mudou `{ur achievement}` para a conquisa desejada!")
    .setTimestamp()
    .setFooter('Anubis', `${client.user.avatarURL}`);
  if (isEmpty(achievement)) return message.channel.send(wembed);
  var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
      //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  var dir = `achievement.png`;
  download('https://www.minecraftskinstealer.com/achievement/a.php?i=2&h=Tu+conseguiste%3A&t='+achievement, dir, function() {
    message.channel.send(`${message.author} has earned a new achievement.`, {file: dir});
  });
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mcconquista",
  category: "Outros",
  description: "Cria uma conquista de minecraft",
  usage: "mcconquista [conquista]"
};