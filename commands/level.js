const Discord = require("discord.js");
const botconfig_colors = require("../botconfig_colors");
let purple = botconfig_colors.purple;
let xp = require("../xp.json");

module.exports.run = async (bot, message, args) => {

  if(!xp[message.author.id]){
   xp[message.author.id] = {
     xp: 0,
     level: 1
  };
}
  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvlXp = curlvl * 300;
  let difference = nxtLvlXp - curxp;

  let lvlEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor(purple)
  .addField("Nível", curlvl, true)
  .addField("XP", curxp, true)
  .setFooter(`${difference} XP para o próximo nível!`, message.author.displayAvatarURL);

  message.channel.send(lvlEmbed).then(msg => {msg.delete(5000)});

}

module.exports.help = {
  name: "level"
}
