const discord = require('discord.js')
const db = require('quick.db')
const send = require('quick.hook')
var currencyFormatter = require('currency-formatter')
var ms = require('parse-ms');

module.exports.run= async (bot, message, args) => {
  
  // This Code Is Registered To RyansHDs#4461 & Zinx#9129
  // The Code Presented Is A More Modified Version Of RyansHDs
  // With His Permission To Include His Name + Upload This,
  
  try {
    let worklog = bot.channels.get('545252395391778817') // MODIFY - This is used to log any work processed & if failed logged as well.
    let cooldown = 2.88e+7; //8 Hours in ms
    let amount = Math.floor((Math.random() * 100) + 100); // Cost
    let workplace = ["Escritório", "Centro comercial", "Restaurante", "Mercado", "Segurança", "ICT"] // Different outputs match below, from 0 to 5 with an included error system.
    let workDaily = await db.fetch(`workDaily_${message.author.id}`) // Used for fetching the time on when work is available.
    let result = Math.floor((Math.random() * workplace.length))
    let timeObj = ms(cooldown - (Date.now() - workDaily))
    
    let workEmbed = new discord.RichEmbed()
     .setDescription(`**${message.author.tag}** Começou a trabalhar e agora tem: ${currencyFormatter.format(amount, { code: 'USD' })}`)
      .setColor(`GREEN`)

    let dailytEmbed = new discord.RichEmbed()
      .setDescription(`${message.author.tag} Tentou arranjar trabalho, mas está em cooldown! Tempo restante: **${timeObj.hours}h, ${timeObj.minutes}m, and ${timeObj.seconds}s**`)
      .setColor(`RED`)

    
    try {
      db.fetch(`currency_${message.author.id}`).then(rm => { // MODIFY - This checks your account to see if your account has a valid amount
        if (rm == null || 0){
          db.set(`currency_${message.author.id}`, 50)} // MODIFY - This wipes any data & updates the account if it isn't a valid number

        else if (workDaily !== null && cooldown - (Date.now() - workDaily) > 0) {
        

          let workDailyEmbed = new discord.RichEmbed()
            .setAuthor(`${message.author.tag} || Trabalho em cooldown!`, message.author.displayAvatarURL)
            .setColor(`BLUE`)
            .setDescription(`**${message.author.tag}**, Tu trabalhas-te 6 horas!\nTens de descansar por, **${timeObj.hours}h, ${timeObj.minutes}m**`)
          message.channel.send(workDailyEmbed)
          send(worklog, dailytEmbed, {
            name: "Manager",
            icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
          })
        } else if (`${result}` == "0"){
          db.set(`workDaily_${message.author.id}`, Date.now());
          db.add(`currency_${message.author.id}`, amount).then(i => { // MODIFY - This updates your account to add the amount earned
            var discord = require('discord.js')
            let dailyEmbed = new discord.RichEmbed()
              .setAuthor(`${message.author.tag} Terminsate de contabilizar`, message.author.displayAvatarURL)
              .setColor(`ORANGE`)
              .addField(`Foste pago pelo teu serviço,`, `O Manager pagou-te: ${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
            send(worklog, workEmbed, {
              name: "Manager",
              icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
            })
          })}
        else if (`${result}` == "1"){
          db.set(`workDaily_${message.author.id}`, Date.now());
          db.add(`currency_${message.author.id}`, amount).then(i => { // MODIFY - This updates your account to add the amount earned
            var discord = require('discord.js')
            let dailyEmbed = new discord.RichEmbed()
              .setAuthor(`${message.author.tag} Vendeu um monte de roupas`, message.author.displayAvatarURL)
              .setColor(`#FFFFCC`)
              .addField(`Foste pago pelo teu trabalho,`, `O Manager pagou-te: ${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
            send(worklog, workEmbed, {
              name: "Manager",
              icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
            })
          })}
        else if (`${result}` == "2"){
          db.set(`workDaily_${message.author.id}`, Date.now());
          db.add(`currency_${message.author.id}`, amount).then(i => { // MODIFY - This updates your account to add the amount earned
            var discord = require('discord.js')
            let dailyEmbed = new discord.RichEmbed()
              .setAuthor(`${message.author.tag} Terminou de cozinhar e limpar`, message.author.displayAvatarURL)
              .setColor(`RED`)
              .addField(`Foste pago pelo teu trabalho,`, `O Manager pagou-te: ${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
            send(worklog, workEmbed, {
              name: "Manager",
              icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
            })
          })}
        else if (`${result}` == "3"){
          db.set(`workDaily_${message.author.id}`, Date.now());
          db.add(`currency_${message.author.id}`, amount).then(i => { // MODIFY - This updates your account to add the amount earned
            var discord = require('discord.js')
            let dailyEmbed = new discord.RichEmbed()
              .setAuthor(`${message.author.tag} Vendeu alguns melões`, message.author.displayAvatarURL)
              .setColor(`RED`)
              .addField(`Foste pago pelo teu serviço,`, `O Manager pagou-te: ${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
            send(worklog, workEmbed, {
              name: "Manager",
              icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
            })
          })}
        else if (`${result}` == "4"){
          db.set(`workDaily_${message.author.id}`, Date.now());
          db.add(`currency_${message.author.id}`, amount).then(i => { // MODIFY - This updates your account to add the amount earned
            var discord = require('discord.js')
            let dailyEmbed = new discord.RichEmbed()
              .setAuthor(`${message.author.tag} Terminou a proteção de pessoas`, message.author.displayAvatarURL)
              .setColor(`BLACK`)
              .addField(`Foste pago pelo teu trabalho,`, `O Manager pagou-te: ${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
            send(worklog, workEmbed, {
              name: "Manager",
              icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
            })
          })}
        else if (`${result}` == "5"){
          db.set(`workDaily_${message.author.id}`, Date.now());
          db.add(`currency_${message.author.id}`, amount).then(i => { // MODIFY - This updates your account to add the amount earned
            var discord = require('discord.js')
            let dailyEmbed = new discord.RichEmbed()
              .setAuthor(`${message.author.tag} Encontrou alguns erros de código.`, message.author.displayAvatarURL)
              .setColor(`AQUA`)
              .addField(`Foste pago pelo teu trabalho.,`, `O Manager pagou-te: ${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
            send(worklog, workEmbed, {
              name: "Manager",
              icon: "https://pbs.twimg.com/profile_images/518086933218467840/aMuhHjnl_400x400.jpeg"
            })
          })}
        else {
          message.channel.send(`EH LÁ! Cometeste um grande erro, hem? Para o suporte usa, \`-//suporte <work> <error>\``)
          console.log(result)
        }
      })} catch (err) {console.log(err)}
  } catch (err) {console.log(`Error with work \n${err}`)}
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["8"],
  permLevel: "User"
};

exports.help = {
  name: "banco",
  category: "Economia",
  description: "Mostra os trabalhos que tens.",
  usage: "banco"
};