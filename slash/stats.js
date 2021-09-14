const slashCommand = require("../base/slashCommand.js");
const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();
module.exports = class Stats extends slashCommand {

  constructor(client) {
    super(client, {
      name: "stats",
      description: "Show's the bots stats",
      options: [],
      guildOnly: false
    });
  }

  async run(interaction) {
    const duration = durationFormatter.format(this.client.uptime);
    const stats = codeBlock("asciidoc", `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${this.client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}
• Servers    :: ${this.client.guilds.cache.size.toLocaleString()}
• Channels   :: ${this.client.channels.cache.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`);
    await interaction.reply(stats);
  }
};