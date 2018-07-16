const Discord = require("discord.js")

const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")

exports.run = (client, message, args) => { // eslint-disable-line no-unused-vars
  message.channel.startTyping();
  let cpuLol;

  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }



  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const embedStats = new Discord.MessageEmbed()
    .setTitle("*** Stats ***")
    .setColor("RANDOM")
    .addField("• Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("• Uptime ", `${duration}`, true)
    .addField("• Users", `${client.users.size.toLocaleString()}`, true)
    .addField("• Servers", `${client.guilds.size.toLocaleString()}`, true)
    .addField("• Channels ", `${client.channels.size.toLocaleString()}`, true)
    .addField("• Discord.js", `v${version}`, true)
    .addField("• Node", `${process.version}`, true)
    .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
    .addField("• CPU usage", `\`${percent.toFixed(2)}%\``,true)
    .addField("• Arch", `\`${os.arch()}\``,true)
    .addField("• Platform", `\`\`${os.platform()}\`\``,true)
    message.channel.send(embedStats)
    message.channel.stopTyping(true);
  });
};

exports.conf = {
  enabled: true, ownerOnly: false,
  guildOnly: false,
  aliases: [],
 botPerm: "VIEW_CHANNEL",
  permNeed: "VIEW_CHANNEL"
};

exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
