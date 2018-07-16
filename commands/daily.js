exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  var discord = require('discord.js');
    var currencyFormatter = require('currency-formatter')
    var db = require('quick.db')
    var ms = require('parse-ms');
  
   // This Code Is Registered To Zinx#9129
   // Some Of This Code Has Been Altered To Work As Much As Possible
    
    let cooldown = 8.64e+7; // Cooldown Daily
    let amount = 250; // Daily Payout

    let lastDaily = await db.fetch(`lastDaily_${message.author.id}`)
    try {
    db.fetch(`account_${message.member.id}`).then(bucks => {
    if(bucks == null || 0){
        db.set(`account_${message.member.id}`, 50)}

    else if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
        let timeObj = ms(cooldown - (Date.now() - lastDaily))

        let lastDailyEmbed = new discord.MessageEmbed()
        .setAuthor(`Infinite`, `Picture Here`)
        .setColor(`DARK_RED`)
        .setDescription(`Daily Not Ready. Please Wait **${timeObj.hours}h ${timeObj.minutes}m**!`)
        message.channel.send(lastDailyEmbed)
    } else {
        db.set(`lastDaily_${message.author.id}`, Date.now());
        db.add(`account_${message.member.id}`, amount).then(i => {
            var discord = require('discord.js')
            let dailyEmbed = new discord.MessageEmbed()
            .setAuthor(`Author Here`, `Picture Here`)
            .setColor(`DARK_RED`)
            .addField(`Account Holder: `, `${message.author}`)
            .addField(`Daily Retrieved:`, `${currencyFormatter.format(amount, { code: 'USD' })}`)
            message.channel.send(dailyEmbed)
        })}
    })} catch(err) {console.log(err)}
 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "daily",
  category: "Fun",
  description: "Daily economy",
  usage: "daily"
};
