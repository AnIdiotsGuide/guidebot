const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const stats = codeBlock("asciidoc", `= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime     :: ${duration}
  • Users      :: ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}
  • Servers    :: ${client.guilds.cache.size.toLocaleString()}
  • Channels   :: ${client.channels.cache.size.toLocaleString()}
  • Discord.js :: v${version}
  • Node       :: ${process.version}`);
  message.channel.send(stats);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Miscellaneous",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
