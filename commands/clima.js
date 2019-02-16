const Discord = require('discord.js');
const settings = require('./config.json');

exports.run = (client, message) => {
  const apiKey = settings.weatherAPI;
  const fetch = require('node-fetch');
  const arg = message.content.split(' ').join(' ').slice(8);
  if (!arg) {
    return message.reply('Preciso de uma cidade para verificar, LOL :wink:');
  }
  fetch('http://api.openweathermap.org/data/2.5/weather?q=' + arg + '&APPID=' + apiKey + '&units=metric')
    .then(res => {
      return res.json();
    }).then(json => {
      if (json.main === undefined) {
        return message.reply(`**${arg}** não está na minha lista. Por favor tenta de novo.`);
      }
      const rise = json.sys.sunrise;
      const date = new Date(rise * 1000);
      const timestr = date.toLocaleTimeString();
      const set = json.sys.sunset;
      const setdate = new Date(set * 1000);
      const timesstr = setdate.toLocaleTimeString();
      const embed = new Discord.RichEmbed()
        .setColor(26368)
        .setTitle(`Este é o clima para:flag_${json.sys.country.toLowerCase()}: **${json.name}**`)
        .addField('Info:', `**Temp:** ${json.main.temp}°C\n**WindSpeed:** ${json.wind.speed}m/s\n**Humidade:** ${json.main.humidity}%\n**Nascer do Sol:** ${timestr}\n**Pôr do Sol:** ${timesstr}`);
      message.channel.send({embed})
        .catch(console.error);
    }).catch(err => {
      if (err) {
        message.channel.send('Algo deu errado enquanto verificava a lista!');
      }
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "clima",
  category: "Outros",
  description: "Mostra o clima na cidade especificada.",
  usage: "clima <cidade>"
};