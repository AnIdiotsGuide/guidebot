const slashCommand = require("../../base/slashCommand.js");
const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Stats extends slashCommand {

  constructor(client) {
    super(client, {
      name: "stats",
      description: "Show's the bots stats",
      options: [],
      guildOnly: false
    });
  }

  async run(client, interaction) {
    try {
      const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
      const stats = codeBlock("asciidoc", `= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime     :: ${duration}
  • Users      :: ${this.client.users.cache.size.toLocaleString()}
  • Servers    :: ${this.client.guilds.cache.size.toLocaleString()}
  • Channels   :: ${this.client.channels.cache.size.toLocaleString()}
  • Discord.js :: v${version}
  • Node       :: ${process.version}`);
      await interaction.reply(stats);
        
    } catch (e) {
      console.log(e);
      return await interaction.reply(`There was a problem with your request.\n\`\`\`${e.message}\`\`\``);
    }
  }
};