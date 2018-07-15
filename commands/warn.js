const db = require('quick.db');
const Discord = require('discord.js')
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars




  let user = message.mentions.users.first()
  if (!user) return message.channel.send('**Please mention a user!**')

  const numberwarn = new db.table('WARNNUMBERs')
  numberwarn.fetch(`user_${user.id}_${message.guild.id}`).then(i => {


  //if (i === null) i = '0'
  if (i === null) return message.channel.send(`**This user don't have any warnings**`)

  if (!args[1]) return message.channel.send(`**Please specify which warning do you want to see! This user have ${i} warnings!**`)
  })



  const userwarns = new db.table('USERWARNINGs')
  //const num2 = await numberwarn.fetch(`user_${user.id}`)
  if (!args[1]) return;
   const warns = await userwarns.fetch(`warn_${user.id}_${args[1]}_${message.guild.id}`)



      const embed1 = new Discord.MessageEmbed()
      .setAuthor(`${user.username}'s ${args[1]}st warning`)
      .setDescription(`Reason: **${warns}**`)
      .setColor('BLUE')


      const embed2 = new Discord.MessageEmbed()
      .setAuthor(`${user.username}'s ${args[1]}nd warning`)
      .setDescription(`Reason: **${warns}**`)
      .setColor('BLUE')


      const embed3 = new Discord.MessageEmbed()
      .setAuthor(`${user.username}'s ${args[1]}rd warning`)
      .setDescription(`Reason: **${warns}**`)
      .setColor('BLUE')


      const embed4 = new Discord.MessageEmbed()
      .setAuthor(`${user.username}'s ${args[1]}th warning`)
      .setDescription(`Reason: **${warns}**`)
      .setColor('BLUE')


      if (args[1] === '1') return message.channel.send(embed1)
      if (args[1] === '2') return message.channel.send(embed1)
      if (args[1] === '3') return message.channel.send(embed1)

      else {
          message.channel.send(embed4)
      }



  //message.channel.send(`warn${user.id}_${args[1]}`)




    //console.log(`${warns}`);
  }

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "warn",
  category: "Moderation",
  description: "warns a user",
  usage: "warn @Infinite#3277"
};
