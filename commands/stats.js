const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter, TimeTypes } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter({
  [TimeTypes.Year]: { 1: "year", DEFAULT: "years" },
  [TimeTypes.Month]: { 1: "month", DEFAULT: "months" },
  [TimeTypes.Week]: { 1: "week", DEFAULT: "weeks" },
  [TimeTypes.Day]: { 1: "day", DEFAULT: "days" },
  [TimeTypes.Hour]: { 1: "hour", DEFAULT: "hours" },
  [TimeTypes.Minute]: { 1: "minute", DEFAULT: "minutes" },
  [TimeTypes.Second]: { 1: "second", DEFAULT: "seconds" }
});

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const stats = codeBlock("asciidoc", `= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime     :: ${duration}
  • Users      :: ${client.users.cache.size.toLocaleString()}
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
