const Command = require("../../base/Command.js");
const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Stats extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      description: "Gives some useful bot statistics.",
      usage: "stats",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const stats = codeBlock("asciidoc", `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${this.client.users.cache.size.toLocaleString()}
• Servers    :: ${this.client.guilds.cache.size.toLocaleString()}
• Channels   :: ${this.client.channels.cache.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`);
    message.channel.send(stats);
  }
};